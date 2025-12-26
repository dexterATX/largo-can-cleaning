import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/auth/session'
import { getCsrfTokenFromRequest, validateCsrfToken } from '@/lib/auth/csrf'

// GET - List all media
export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams

    // Validate and sanitize pagination parameters
    const rawPage = parseInt(searchParams.get('page') || '1')
    const rawPageSize = parseInt(searchParams.get('pageSize') || '20')
    const page = isNaN(rawPage) ? 1 : Math.max(1, rawPage)
    const pageSize = isNaN(rawPageSize) ? 20 : Math.min(100, Math.max(1, rawPageSize))
    const folder = searchParams.get('folder')

    const supabase = createAdminClient()

    let query = supabase
      .from('media')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (folder) {
      query = query.eq('folder', folder)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching media:', error)
      return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
    }

    return NextResponse.json({
      data,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    })
  } catch (error) {
    console.error('Media API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST - Upload media (placeholder - actual upload handled by Supabase Storage)
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

    const body = await request.json()
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('media')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Error creating media record:', error)
      return NextResponse.json({ error: 'Failed to create media record' }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Media upload error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
