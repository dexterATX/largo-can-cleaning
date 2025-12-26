import { randomBytes } from 'crypto'

// CSRF token configuration
const TOKEN_LENGTH = 32
const TOKEN_EXPIRY_MS = 60 * 60 * 1000 // 1 hour

interface CsrfToken {
  token: string
  expires: number
}

// In-memory store for server-side token validation
// In production, use Redis or database for distributed systems
const tokenStore = new Map<string, CsrfToken>()

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  const token = randomBytes(TOKEN_LENGTH).toString('hex')
  const expires = Date.now() + TOKEN_EXPIRY_MS

  tokenStore.set(token, { token, expires })

  // Clean up expired tokens periodically
  cleanupExpiredTokens()

  return token
}

/**
 * Validate a CSRF token
 */
export function validateCsrfToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') {
    return false
  }

  const storedToken = tokenStore.get(token)

  if (!storedToken) {
    return false
  }

  // Check if token is expired
  if (Date.now() > storedToken.expires) {
    tokenStore.delete(token)
    return false
  }

  // Token is valid - delete it to prevent reuse (single-use tokens)
  tokenStore.delete(token)
  return true
}

/**
 * Clean up expired tokens from the store
 */
function cleanupExpiredTokens(): void {
  const now = Date.now()
  for (const [key, value] of tokenStore.entries()) {
    if (now > value.expires) {
      tokenStore.delete(key)
    }
  }
}

/**
 * Middleware helper to extract CSRF token from request
 */
export function getCsrfTokenFromRequest(headers: Headers): string | null {
  // Check X-CSRF-Token header first (preferred)
  const headerToken = headers.get('X-CSRF-Token')
  if (headerToken) {
    return headerToken
  }

  // Fallback to X-XSRF-Token (used by some frameworks)
  return headers.get('X-XSRF-Token')
}

/**
 * Create CSRF validation middleware for API routes
 */
export function withCsrfProtection<T>(
  handler: (request: Request) => Promise<T>
): (request: Request) => Promise<T | Response> {
  return async (request: Request) => {
    // Skip CSRF check for safe methods
    const safeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(request.method)
    if (safeMethod) {
      return handler(request)
    }

    const token = getCsrfTokenFromRequest(request.headers)

    if (!validateCsrfToken(token)) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing CSRF token' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return handler(request)
  }
}
