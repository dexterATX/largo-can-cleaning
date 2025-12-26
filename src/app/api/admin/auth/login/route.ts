import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/auth/password'
import { createSession } from '@/lib/auth/session'
import {
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
} from '@/lib/auth/rate-limiter'

export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                    request.headers.get('x-real-ip') ||
                    'unknown'

  // Check rate limit before processing
  const { isLimited, retryAfter } = checkRateLimit(ipAddress)
  if (isLimited) {
    return NextResponse.json(
      {
        error: 'Too many login attempts. Please try again later.',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
        },
      }
    )
  }

  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const isValid = await verifyPassword(password)

    if (!isValid) {
      // Record failed attempt
      recordFailedAttempt(ipAddress)

      return NextResponse.json(
        {
          error: 'Invalid credentials',
        },
        { status: 401 }
      )
    }

    // Clear rate limit on successful login
    clearRateLimit(ipAddress)

    // Get user agent for session
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create session
    await createSession(ipAddress, userAgent)

    return NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
