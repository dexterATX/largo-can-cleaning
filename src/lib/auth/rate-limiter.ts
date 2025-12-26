/**
 * Simple in-memory rate limiter for login attempts
 *
 * WARNING: This in-memory implementation has limitations for production:
 * - State is lost when the server restarts
 * - Does not work across multiple server instances/replicas
 * - Memory usage grows with number of unique IPs
 *
 * For production, consider using Redis or a database-backed solution
 * to ensure rate limiting works correctly across all instances.
 */

interface RateLimitEntry {
  attempts: number
  firstAttempt: number
  blockedUntil: number | null
}

// In-memory store for rate limiting
const loginAttempts = new Map<string, RateLimitEntry>()

// Configuration
const MAX_ATTEMPTS = 5 // Maximum login attempts
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes window
const BLOCK_DURATION_MS = 30 * 60 * 1000 // 30 minutes block after max attempts

// Clean up old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()
// Maximum number of entries to prevent unbounded memory growth
const MAX_ENTRIES = 10000

function cleanupOldEntries(): void {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  lastCleanup = now
  for (const [ip, entry] of loginAttempts.entries()) {
    // Remove entries that are outside the window and not blocked
    if (now - entry.firstAttempt > WINDOW_MS && !entry.blockedUntil) {
      loginAttempts.delete(ip)
    }
    // Remove entries where block has expired
    if (entry.blockedUntil && now > entry.blockedUntil) {
      loginAttempts.delete(ip)
    }
  }

  // If still too many entries, remove oldest ones to prevent memory leak
  if (loginAttempts.size > MAX_ENTRIES) {
    const entries = Array.from(loginAttempts.entries())
      .sort((a, b) => a[1].firstAttempt - b[1].firstAttempt)

    const toRemove = entries.slice(0, entries.length - MAX_ENTRIES)
    for (const [ip] of toRemove) {
      loginAttempts.delete(ip)
    }
  }
}

/**
 * Force cleanup of all expired entries - can be called externally if needed
 * Useful for manual cleanup or testing
 */
export function forceCleanup(): number {
  const now = Date.now()
  let removed = 0

  for (const [ip, entry] of loginAttempts.entries()) {
    const isExpired = now - entry.firstAttempt > WINDOW_MS && !entry.blockedUntil
    const isBlockExpired = entry.blockedUntil && now > entry.blockedUntil

    if (isExpired || isBlockExpired) {
      loginAttempts.delete(ip)
      removed++
    }
  }

  return removed
}

/**
 * Get current memory usage statistics for monitoring
 */
export function getStats(): { entries: number; maxEntries: number } {
  return {
    entries: loginAttempts.size,
    maxEntries: MAX_ENTRIES,
  }
}

/**
 * Check if an IP is rate limited
 * @param ip - The IP address to check
 * @returns Object with isLimited boolean and retryAfter seconds (if limited)
 */
export function checkRateLimit(ip: string): { isLimited: boolean; retryAfter?: number } {
  cleanupOldEntries()

  const now = Date.now()
  const entry = loginAttempts.get(ip)

  if (!entry) {
    return { isLimited: false }
  }

  // Check if IP is blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000)
    return { isLimited: true, retryAfter }
  }

  // Reset if window has passed
  if (now - entry.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(ip)
    return { isLimited: false }
  }

  // Check if max attempts reached
  if (entry.attempts >= MAX_ATTEMPTS) {
    // Block the IP
    entry.blockedUntil = now + BLOCK_DURATION_MS
    const retryAfter = Math.ceil(BLOCK_DURATION_MS / 1000)
    return { isLimited: true, retryAfter }
  }

  return { isLimited: false }
}

/**
 * Record a failed login attempt
 * @param ip - The IP address that failed login
 */
export function recordFailedAttempt(ip: string): void {
  const now = Date.now()
  const entry = loginAttempts.get(ip)

  if (!entry) {
    loginAttempts.set(ip, {
      attempts: 1,
      firstAttempt: now,
      blockedUntil: null,
    })
    return
  }

  // Reset if window has passed
  if (now - entry.firstAttempt > WINDOW_MS) {
    loginAttempts.set(ip, {
      attempts: 1,
      firstAttempt: now,
      blockedUntil: null,
    })
    return
  }

  entry.attempts++
}

/**
 * Clear rate limit for an IP (call on successful login)
 * @param ip - The IP address to clear
 */
export function clearRateLimit(ip: string): void {
  loginAttempts.delete(ip)
}

/**
 * Get remaining attempts for an IP
 * @param ip - The IP address to check
 * @returns Number of remaining attempts
 */
export function getRemainingAttempts(ip: string): number {
  const entry = loginAttempts.get(ip)
  if (!entry) return MAX_ATTEMPTS
  return Math.max(0, MAX_ATTEMPTS - entry.attempts)
}
