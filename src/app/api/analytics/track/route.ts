import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

// Generate a cryptographically secure session ID
function generateSessionId(): string {
  return crypto.randomUUID()
}

// Detect device type from user agent
function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  const ua = userAgent.toLowerCase()
  if (/mobile|android|iphone|ipod|blackberry|windows phone/.test(ua)) {
    return 'mobile'
  }
  if (/tablet|ipad|playbook|silk/.test(ua)) {
    return 'tablet'
  }
  return 'desktop'
}

// Extract browser from user agent
function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (ua.includes('firefox')) return 'Firefox'
  if (ua.includes('edg')) return 'Edge'
  if (ua.includes('chrome')) return 'Chrome'
  if (ua.includes('safari')) return 'Safari'
  if (ua.includes('opera') || ua.includes('opr')) return 'Opera'
  return 'Other'
}

// Constants for input validation
const MAX_PATH_LENGTH = 2048
const MAX_REFERRER_LENGTH = 2048
const MAX_SESSION_ID_LENGTH = 100
const MAX_READ_TIME = 86400 // 24 hours in seconds
const MAX_SCROLL_DEPTH = 100 // percentage

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      page_path,
      referrer,
      session_id,
      read_time,
      scroll_depth,
    } = body

    // Input validation
    if (!page_path || typeof page_path !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid page path' },
        { status: 400 }
      )
    }

    if (page_path.length > MAX_PATH_LENGTH) {
      return NextResponse.json(
        { success: false, error: 'Page path too long' },
        { status: 400 }
      )
    }

    // Validate read_time if provided
    if (read_time !== undefined && read_time !== null) {
      const readTimeNum = Number(read_time)
      if (isNaN(readTimeNum) || readTimeNum < 0 || readTimeNum > MAX_READ_TIME) {
        return NextResponse.json(
          { success: false, error: 'Invalid read time' },
          { status: 400 }
        )
      }
    }

    // Validate scroll_depth if provided
    if (scroll_depth !== undefined && scroll_depth !== null) {
      const scrollDepthNum = Number(scroll_depth)
      if (isNaN(scrollDepthNum) || scrollDepthNum < 0 || scrollDepthNum > MAX_SCROLL_DEPTH) {
        return NextResponse.json(
          { success: false, error: 'Invalid scroll depth' },
          { status: 400 }
        )
      }
    }

    // Sanitize referrer
    const sanitizedReferrer = referrer && typeof referrer === 'string'
      ? referrer.substring(0, MAX_REFERRER_LENGTH)
      : null

    // Sanitize session_id
    const sanitizedSessionId = session_id && typeof session_id === 'string'
      ? session_id.substring(0, MAX_SESSION_ID_LENGTH)
      : null

    // Get user agent
    const userAgent = request.headers.get('user-agent') || ''

    // Detect device and browser
    const device_type = getDeviceType(userAgent)
    const browser = getBrowser(userAgent)

    // Use provided session_id or generate new one
    const finalSessionId = sanitizedSessionId || generateSessionId()

    // Insert page view record (using only columns that exist in the original schema)
    const supabase = createAdminClient()
    const { error } = await supabase.from('page_views').insert({
      page_path: page_path.substring(0, MAX_PATH_LENGTH),
      referrer: sanitizedReferrer,
      device_type,
      browser,
      session_id: finalSessionId,
      read_time: read_time ? Math.min(Number(read_time), MAX_READ_TIME) : null,
      scroll_depth: scroll_depth ? Math.min(Number(scroll_depth), MAX_SCROLL_DEPTH) : null,
    })

    if (error) {
      console.error('Analytics insert error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      session_id: finalSessionId
    })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
}

// Also support GET for simple pixel tracking
export async function GET(request: NextRequest) {
  // Return 1x1 transparent GIF header regardless of tracking success
  const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')
  const headers = {
    'Content-Type': 'image/gif',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  }

  const searchParams = request.nextUrl.searchParams
  const rawPath = searchParams.get('path')
  const rawReferrer = searchParams.get('ref')

  // Validate path
  if (!rawPath || rawPath.length > MAX_PATH_LENGTH) {
    return new NextResponse(gif, { headers })
  }

  const page_path = rawPath.substring(0, MAX_PATH_LENGTH)
  const referrer = rawReferrer ? rawReferrer.substring(0, MAX_REFERRER_LENGTH) : null

  const userAgent = request.headers.get('user-agent') || ''
  const device_type = getDeviceType(userAgent)
  const browser = getBrowser(userAgent)

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from('page_views').insert({
      page_path,
      referrer,
      device_type,
      browser,
      session_id: generateSessionId(),
    })

    if (error) {
      console.error('Pixel tracking database error:', error)
    }
  } catch (error) {
    console.error('Pixel tracking error:', error)
  }

  return new NextResponse(gif, { headers })
}
