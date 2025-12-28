import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/auth/session'
import { getCsrfTokenFromRequest, validateCsrfToken } from '@/lib/auth/csrf'
import slugify from 'slugify'
import type { CategoryInsert } from '@/types/admin'

// GET - List all categories
export async function GET() {
  try {
    const isAuthenticated = await verifySession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Get categories with post count in a single query using Supabase's count feature
    // This avoids the N+1 pattern of fetching categories then all posts separately
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*, blog_posts(count)')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

    // Transform the response to include post_count at the top level
    const categoriesWithCount = categories?.map((cat) => {
      // Supabase returns count as an array with a single object containing count
      const postCount = Array.isArray(cat.blog_posts) && cat.blog_posts.length > 0
        ? (cat.blog_posts[0] as { count: number }).count
        : 0
      // Remove the nested blog_posts from the response
      const { blog_posts: _blog_posts, ...categoryData } = cat
      return {
        ...categoryData,
        post_count: postCount,
      }
    })

    return NextResponse.json({ data: categoriesWithCount })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate CSRF token
    const csrfToken = getCsrfTokenFromRequest(request.headers)
    if (!validateCsrfToken(csrfToken)) {
      return NextResponse.json({ error: 'Invalid or missing CSRF token' }, { status: 403 })
    }

    const body: CategoryInsert = await request.json()

    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const slug = body.slug || slugify(body.name, { lower: true, strict: true })
    const supabase = createAdminClient()

    // Check if slug exists
    const { data: existing, error: existingError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (existingError) {
      console.error('Error checking existing category:', existingError)
      return NextResponse.json({ error: 'Failed to check existing category' }, { status: 500 })
    }

    if (existing) {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 400 })
    }

    // Get next sort order
    const { data: lastCategory, error: sortOrderError } = await supabase
      .from('categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (sortOrderError) {
      console.error('Error getting sort order:', sortOrderError)
      return NextResponse.json({ error: 'Failed to determine sort order' }, { status: 500 })
    }

    const sortOrder = (lastCategory?.sort_order || 0) + 1

    const { data, error } = await supabase
      .from('categories')
      .insert({
        ...body,
        slug,
        sort_order: body.sort_order ?? sortOrder,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
