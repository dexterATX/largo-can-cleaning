import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/auth/session'
import { getCsrfTokenFromRequest, validateCsrfToken } from '@/lib/auth/csrf'
import slugify from 'slugify'
import type { BlogPostInsert } from '@/types/admin'
import {
  sanitizeBlogPostContent,
  validateBlogPostInput,
} from '@/lib/sanitize'

// GET - List all posts with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const isAuthenticated = await verifySession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    // Validate and sanitize pagination parameters
    const rawPage = parseInt(searchParams.get('page') || '1')
    const rawPageSize = parseInt(searchParams.get('pageSize') || '10')
    const page = isNaN(rawPage) ? 1 : Math.max(1, rawPage)
    const pageSize = isNaN(rawPageSize) ? 10 : Math.min(100, Math.max(1, rawPageSize))

    const status = searchParams.get('status') // draft, published, all
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Validate status parameter
    const validStatuses = ['draft', 'published', 'all']
    const sanitizedStatus = status && validStatuses.includes(status) ? status : null

    const supabase = createAdminClient()

    // Build query
    let query = supabase
      .from('blog_posts')
      .select('*, category:categories(*)', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (sanitizedStatus && sanitizedStatus !== 'all') {
      query = query.eq('status', sanitizedStatus)
    }
    if (category) {
      query = query.eq('category_id', category)
    }
    if (search) {
      // Escape special characters for LIKE pattern to prevent injection
      const escapedSearch = search.replace(/[%_\\]/g, '\\$&')
      query = query.or(`title.ilike.%${escapedSearch}%,excerpt.ilike.%${escapedSearch}%`)
    }

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    return NextResponse.json({
      data,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    })
  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST - Create a new post
export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const isAuthenticated = await verifySession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate CSRF token
    const csrfToken = getCsrfTokenFromRequest(request.headers)
    if (!validateCsrfToken(csrfToken)) {
      return NextResponse.json({ error: 'Invalid or missing CSRF token' }, { status: 403 })
    }

    const body: BlogPostInsert = await request.json()

    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Validate input lengths
    const validation = validateBlogPostInput(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors.join(', ') },
        { status: 400 }
      )
    }

    // Sanitize content to prevent XSS
    const sanitizedBody = sanitizeBlogPostContent(body)

    // Generate slug if not provided
    const slug = sanitizedBody.slug || slugify(sanitizedBody.title, { lower: true, strict: true })

    const supabase = createAdminClient()

    // Check if slug already exists
    const { data: existingPost, error: existingError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (existingError) {
      console.error('Error checking existing post:', existingError)
      return NextResponse.json({ error: 'Failed to check existing post' }, { status: 500 })
    }

    if (existingPost) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 })
    }

    // Validate foreign keys exist before insert - batch validations in parallel
    // This reduces N+1 sequential queries to a single parallel batch
    const validationPromises: Promise<{ type: string; valid: boolean; error?: string }>[] = []

    if (sanitizedBody.category_id) {
      validationPromises.push(
        (async () => {
          const { data, error } = await supabase
            .from('categories')
            .select('id')
            .eq('id', sanitizedBody.category_id)
            .maybeSingle()
          if (error) {
            console.error('Error validating category:', error)
            return { type: 'category', valid: false, error: 'Failed to validate category' }
          }
          if (!data) {
            return { type: 'category', valid: false, error: 'Category not found' }
          }
          return { type: 'category', valid: true }
        })()
      )
    }

    if (sanitizedBody.featured_image_id) {
      validationPromises.push(
        (async () => {
          const { data, error } = await supabase
            .from('media')
            .select('id')
            .eq('id', sanitizedBody.featured_image_id)
            .maybeSingle()
          if (error) {
            console.error('Error validating featured image:', error)
            return { type: 'media', valid: false, error: 'Failed to validate featured image' }
          }
          if (!data) {
            return { type: 'media', valid: false, error: 'Featured image not found' }
          }
          return { type: 'media', valid: true }
        })()
      )
    }

    // Run all validations in parallel
    if (validationPromises.length > 0) {
      const validationResults = await Promise.all(validationPromises)
      const failedValidation = validationResults.find(result => !result.valid)
      if (failedValidation) {
        const status = failedValidation.error?.includes('Failed to validate') ? 500 : 400
        return NextResponse.json({ error: failedValidation.error }, { status })
      }
    }

    // Create post
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        ...sanitizedBody,
        slug,
        published_at: sanitizedBody.status === 'published' ? new Date().toISOString() : null,
      })
      .select('*, category:categories(*)')
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
