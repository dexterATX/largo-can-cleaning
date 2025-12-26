import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/auth/session'
import { getCsrfTokenFromRequest, validateCsrfToken } from '@/lib/auth/csrf'
import { getFormDataFile, getFormDataString } from '@/lib/validation'

const BUCKET_NAME = 'media'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
// SVG removed from allowed types - can contain JavaScript/XSS vectors
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

// Generate unique filename
function generateFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg'
  const baseName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9]/g, '-') // Replace special chars
    .substring(0, 50) // Limit length
    .toLowerCase()
  return `${baseName}-${timestamp}-${random}.${ext}`
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isValid = await verifySession()
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate CSRF token
    const csrfToken = getCsrfTokenFromRequest(request.headers)
    if (!validateCsrfToken(csrfToken)) {
      return NextResponse.json({ error: 'Invalid or missing CSRF token' }, { status: 403 })
    }

    const supabase = createAdminClient()

    // Parse form data with proper runtime validation
    const formData = await request.formData()
    const file = getFormDataFile(formData, 'file')
    // Sanitize folder parameter to prevent path traversal attacks
    const rawFolder = getFormDataString(formData, 'folder') || 'uploads'
    const folder = rawFolder
      .replace(/\.\./g, '') // Remove parent directory references
      .replace(/^\/+/g, '') // Remove leading slashes
      .replace(/\/+$/g, '') // Remove trailing slashes
      .replace(/[<>:"|?*]/g, '') // Remove invalid characters
      .toLowerCase()
      .substring(0, 50) // Limit length

    if (!folder || folder.length === 0) {
      return NextResponse.json({ error: 'Invalid folder name' }, { status: 400 })
    }
    const altText = getFormDataString(formData, 'alt_text')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Generate unique filename
    const filename = generateFilename(file.name)
    const filePath = `${folder}/${filename}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: uploadError.message || 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    const fileUrl = urlData.publicUrl

    // Get image dimensions if it's an image
    let width: number | null = null
    let height: number | null = null

    // Insert media record in database
    const { data: mediaRecord, error: dbError } = await supabase
      .from('media')
      .insert({
        filename: filename,
        original_filename: file.name,
        file_path: filePath,
        file_url: fileUrl,
        file_size: file.size,
        mime_type: file.type,
        width,
        height,
        alt_text: altText || null,
        folder,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Try to delete the uploaded file if db insert fails - with proper error handling
      try {
        const { error: cleanupError } = await supabase.storage.from(BUCKET_NAME).remove([filePath])
        if (cleanupError) {
          console.error('Failed to cleanup uploaded file after DB error:', cleanupError)
        }
      } catch (cleanupErr) {
        console.error('Exception during file cleanup:', cleanupErr)
      }
      return NextResponse.json(
        { error: 'Failed to save media record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mediaRecord,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
