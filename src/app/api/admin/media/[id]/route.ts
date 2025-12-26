import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/auth/session'
import { getCsrfTokenFromRequest, validateCsrfToken } from '@/lib/auth/csrf'
import { isValidUUID } from '@/lib/validation'

// DELETE - Delete media
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
      return NextResponse.json({ error: 'Invalid media ID format' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Check if media is referenced by any posts before deleting
    const { data: referencingPosts } = await supabase
      .from('blog_posts')
      .select('id')
      .or(`featured_image_id.eq.${id},og_image_id.eq.${id}`)
      .limit(1)

    if (referencingPosts && referencingPosts.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete media. It is being used by posts.' },
        { status: 400 }
      )
    }

    // Get media record first to get the file path
    const { data: media } = await supabase
      .from('media')
      .select('file_path')
      .eq('id', id)
      .single()

    if (media?.file_path) {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([media.file_path])

      if (storageError) {
        console.error('Error deleting from storage:', storageError)
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting media:', error)
      return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete media error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
