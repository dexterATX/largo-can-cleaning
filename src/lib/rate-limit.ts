// Simple in-memory rate limiter for public API routes
const requests = new Map<string, { count: number; resetTime: number }>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 100 // 100 requests per minute

export function checkPublicRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = requests.get(ip)

  if (!record || now > record.resetTime) {
    requests.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return true
  }

  if (record.count >= MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of requests.entries()) {
    if (now > record.resetTime) {
      requests.delete(ip)
    }
  }
}, 60000)
