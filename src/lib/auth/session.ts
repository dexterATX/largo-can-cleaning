import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 hours in milliseconds

// Generate a secure random session token
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Create a new admin session
export async function createSession(ipAddress?: string, userAgent?: string): Promise<string> {
  const supabase = createAdminClient()
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  const { error } = await supabase.from('admin_sessions').insert({
    session_token: token,
    ip_address: ipAddress || null,
    user_agent: userAgent || null,
    expires_at: expiresAt.toISOString(),
  })

  if (error) {
    console.error('Failed to create session:', error)
    throw new Error('Failed to create session')
  }

  // Set HTTP-only cookie with strict security settings
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Strict prevents CSRF attacks
    expires: expiresAt,
    path: '/',
  })

  return token
}

// Verify and get current session
export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return false
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('admin_sessions')
    .select('*')
    .eq('session_token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error || !data) {
    return false
  }

  return true
}

// Destroy current session (logout)
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (token) {
    const supabase = createAdminClient()
    // Delete from DB first, then clear cookie to prevent race condition
    // where cookie is deleted but DB session still exists
    const { error } = await supabase.from('admin_sessions').delete().eq('session_token', token)

    if (error) {
      console.error('Failed to delete session from database:', error)
      // Still clear the cookie even if DB delete fails to ensure user is logged out
    }
  }

  // Clear cookie after successful (or attempted) DB delete
  cookieStore.delete(SESSION_COOKIE_NAME)
}

// Clean up expired sessions (can be called periodically)
export async function cleanupExpiredSessions(): Promise<number> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('admin_sessions')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .select('id')

  if (error) {
    console.error('Failed to cleanup expired sessions:', error)
    throw new Error('Failed to cleanup expired sessions')
  }

  return data?.length || 0
}
