import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/auth/session'
import { getCsrfTokenFromRequest, validateCsrfToken } from '@/lib/auth/csrf'
import { isValidUUID } from '@/lib/validation'
import slugify from 'slugify'
import type { BlogPostUpdate } from '@/types/admin'
import {
  sanitizeBlogPostContent,
  validateBlogPostInput,
} from '@/lib/sanitize'

// GET - Get single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await verifySession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Validate UUID format to prevent invalid database queries
    if (!isValidUUID(id)) {
      return NextResponse.json({ error: 'Invalid post ID format' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, category:categories(*), featured_image:media(*)')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Get post error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Validate UUID format to prevent invalid database queries
    if (!isValidUUID(id)) {
      return NextResponse.json({ error: 'Invalid post ID format' }, { status: 400 })
    }

    const body: BlogPostUpdate = await request.json()

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

    const supabase = createAdminClient()

    // If title changed, update slug
    if (sanitizedBody.title && !sanitizedBody.slug) {
      sanitizedBody.slug = slugify(sanitizedBody.title, { lower: true, strict: true })
    }

    // Check if slug already exists (for another post)
    if (sanitizedBody.slug) {
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', sanitizedBody.slug)
        .neq('id', id)
        .single()

      if (existingPost) {
        return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 })
      }
    }

    // Handle publishing
    if (sanitizedBody.status === 'published') {
      const { data: currentPost } = await supabase
        .from('blog_posts')
        .select('status, published_at')
        .eq('id', id)
        .single()

      // Set published_at if not already published
      if (currentPost && currentPost.status !== 'published') {
        sanitizedBody.published_at = new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(sanitizedBody)
      .eq('id', id)
      .select('*, category:categories(*)')
      .single()

    if (error) {
      console.error('Error updating post:', error)
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Validate UUID format to prevent invalid database queries
    if (!isValidUUID(id)) {
      return NextResponse.json({ error: 'Invalid post ID format' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting post:', error)
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
