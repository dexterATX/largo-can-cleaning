import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/auth/session'
import { getCsrfTokenFromRequest, validateCsrfToken } from '@/lib/auth/csrf'
import { isValidUUID } from '@/lib/validation'
import slugify from 'slugify'
import type { CategoryUpdate } from '@/types/admin'

// PUT - Update category
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
      return NextResponse.json({ error: 'Invalid category ID format' }, { status: 400 })
    }

    const body: CategoryUpdate = await request.json()
    const supabase = createAdminClient()

    // Update slug if name changed
    if (body.name && !body.slug) {
      body.slug = slugify(body.name, { lower: true, strict: true })
    }

    // Check slug uniqueness
    if (body.slug) {
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single()

      if (existing) {
        return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 400 })
      }
    }

    const { data, error } = await supabase
      .from('categories')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE - Delete category
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
      return NextResponse.json({ error: 'Invalid category ID format' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Check if category has posts
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('category_id', id)
      .limit(1)

    if (posts && posts.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing posts. Remove or reassign posts first.' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting category:', error)
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
