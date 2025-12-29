import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase/anon'
import crypto from 'crypto'

// ============================================
// RATE LIMITING (stricter for analytics)
// ============================================

const analyticsRequests = new Map<string, { count: number; resetTime: number }>()
const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_MINUTE = 10 // Very strict: 10 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = analyticsRequests.get(ip)

  if (!record || now > record.resetTime) {
    analyticsRequests.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return true
  }

  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return false
  }

  record.count++
  return true
}

// Cleanup old entries every minute
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [ip, record] of analyticsRequests.entries()) {
      if (now > record.resetTime) {
        analyticsRequests.delete(ip)
      }
    }
  }, 60000)
}

// ============================================
// BOT DETECTION
// ============================================

const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
  /googlebot/i, /bingbot/i, /yandex/i, /baiduspider/i,
  /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i,
  /whatsapp/i, /telegrambot/i, /discordbot/i,
  /pinterest/i, /redditbot/i, /semrush/i, /ahrefs/i,
  /mj12bot/i, /dotbot/i, /petalbot/i, /bytespider/i,
  /gptbot/i, /claudebot/i, /ccbot/i, /applebot/i,
  /headless/i, /phantom/i, /selenium/i, /puppeteer/i,
  /curl/i, /wget/i, /python-requests/i, /axios/i, /node-fetch/i,
  /scrapy/i, /httpclient/i, /java\//i, /libwww/i,
]

function isBot(userAgent: string): boolean {
  if (!userAgent || userAgent.length < 10) return true
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent))
}

// ============================================
// HELPERS
// ============================================

function generateSessionId(): string {
  return crypto.randomUUID()
}

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

function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (ua.includes('firefox')) return 'Firefox'
  if (ua.includes('edg')) return 'Edge'
  if (ua.includes('chrome')) return 'Chrome'
  if (ua.includes('safari')) return 'Safari'
  if (ua.includes('opera') || ua.includes('opr')) return 'Opera'
  return 'Other'
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

// ============================================
// VALIDATION CONSTANTS
// ============================================

const MAX_PATH_LENGTH = 500 // Reduced from 2048
const MAX_REFERRER_LENGTH = 500
const MAX_SESSION_ID_LENGTH = 64
const MAX_READ_TIME = 3600 // 1 hour max (reduced from 24h)
const MAX_SCROLL_DEPTH = 100

// Valid page paths (whitelist approach)
const VALID_PATH_PATTERN = /^\/[a-zA-Z0-9\-_\/]*$/

// ============================================
// ROUTE HANDLERS
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request)

    // Rate limit check
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Bot detection
    const userAgent = request.headers.get('user-agent') || ''
    if (isBot(userAgent)) {
      // Silently accept but don't track bots
      return NextResponse.json({ success: true, session_id: 'bot' })
    }

    const body = await request.json()
    const {
      page_path,
      referrer,
      session_id,
      read_time,
      scroll_depth,
    } = body

    // Validate page_path
    if (!page_path || typeof page_path !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid page path' },
        { status: 400 }
      )
    }

    const trimmedPath = page_path.substring(0, MAX_PATH_LENGTH)

    // Whitelist validation for paths
    if (!VALID_PATH_PATTERN.test(trimmedPath)) {
      return NextResponse.json(
        { success: false, error: 'Invalid page path format' },
        { status: 400 }
      )
    }

    // Validate read_time
    let validReadTime: number | null = null
    if (read_time !== undefined && read_time !== null) {
      const readTimeNum = Number(read_time)
      if (!isNaN(readTimeNum) && readTimeNum >= 0 && readTimeNum <= MAX_READ_TIME) {
        validReadTime = Math.floor(readTimeNum)
      }
    }

    // Validate scroll_depth
    let validScrollDepth: number | null = null
    if (scroll_depth !== undefined && scroll_depth !== null) {
      const scrollDepthNum = Number(scroll_depth)
      if (!isNaN(scrollDepthNum) && scrollDepthNum >= 0 && scrollDepthNum <= MAX_SCROLL_DEPTH) {
        validScrollDepth = Math.floor(scrollDepthNum)
      }
    }

    // Sanitize optional fields
    const sanitizedReferrer = (referrer && typeof referrer === 'string')
      ? referrer.substring(0, MAX_REFERRER_LENGTH)
      : null

    const sanitizedSessionId = (session_id && typeof session_id === 'string')
      ? session_id.substring(0, MAX_SESSION_ID_LENGTH)
      : null

    // Detect device and browser
    const device_type = getDeviceType(userAgent)
    const browser = getBrowser(userAgent)
    const finalSessionId = sanitizedSessionId || generateSessionId()

    // Insert using anon client (respects RLS)
    const supabase = createAnonClient()
    const { error } = await supabase.from('page_views').insert({
      page_path: trimmedPath,
      referrer: sanitizedReferrer,
      device_type,
      browser,
      session_id: finalSessionId,
      read_time: validReadTime,
      scroll_depth: validScrollDepth,
    })

    if (error) {
      // Log but don't expose internal errors
      console.error('Analytics insert error:', error.message)
      // Return success anyway to not leak info about DB state
      return NextResponse.json({ success: true, session_id: finalSessionId })
    }

    return NextResponse.json({
      success: true,
      session_id: finalSessionId
    })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    // Return success to not leak error info
    return NextResponse.json({ success: true, session_id: 'error' })
  }
}

// GET for pixel tracking (1x1 transparent GIF)
export async function GET(request: NextRequest) {
  // Always return the GIF regardless of tracking result
  const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')
  const headers = {
    'Content-Type': 'image/gif',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  }

  const clientIp = getClientIp(request)

  // Rate limit check
  if (!checkRateLimit(clientIp)) {
    return new NextResponse(gif, { headers })
  }

  // Bot detection
  const userAgent = request.headers.get('user-agent') || ''
  if (isBot(userAgent)) {
    return new NextResponse(gif, { headers })
  }

  const searchParams = request.nextUrl.searchParams
  const rawPath = searchParams.get('path')

  // Validate path
  if (!rawPath || rawPath.length > MAX_PATH_LENGTH) {
    return new NextResponse(gif, { headers })
  }

  const page_path = rawPath.substring(0, MAX_PATH_LENGTH)

  // Whitelist validation
  if (!VALID_PATH_PATTERN.test(page_path)) {
    return new NextResponse(gif, { headers })
  }

  const rawReferrer = searchParams.get('ref')
  const referrer = rawReferrer ? rawReferrer.substring(0, MAX_REFERRER_LENGTH) : null

  const device_type = getDeviceType(userAgent)
  const browser = getBrowser(userAgent)

  try {
    const supabase = createAnonClient()
    await supabase.from('page_views').insert({
      page_path,
      referrer,
      device_type,
      browser,
      session_id: generateSessionId(),
    })
  } catch (error) {
    // Silently fail - don't block the GIF response
    console.error('Pixel tracking error:', error)
  }

  return new NextResponse(gif, { headers })
}
