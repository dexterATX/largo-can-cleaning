'use client'

// Analytics Tracker for CleanCan Pro
// Tracks page views, scroll depth, and time on page

const TRACKING_ENDPOINT = '/api/analytics/track'
const SESSION_KEY = 'cleancan_session_id'

// Get or create session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  try {
    let sessionId = sessionStorage.getItem(SESSION_KEY)
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      sessionStorage.setItem(SESSION_KEY, sessionId)
    }
    return sessionId
  } catch {
    // sessionStorage may be unavailable in private browsing
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  }
}

// Track a page view
export async function trackPageView(pathOrSignal?: string | AbortSignal, title?: string): Promise<void> {
  if (typeof window === 'undefined') return

  // Handle overloaded signature: trackPageView(signal) or trackPageView(path, title)
  const signal = pathOrSignal instanceof AbortSignal ? pathOrSignal : undefined
  const path = typeof pathOrSignal === 'string' ? pathOrSignal : undefined

  try {
    await fetch(TRACKING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_path: path || window.location.pathname,
        page_title: title || document.title,
        referrer: document.referrer || null,
        session_id: getSessionId(),
        event_type: 'pageview',
      }),
      keepalive: true,
      signal,
    })
  } catch (error) {
    // Silently fail - don't break user experience for analytics
    if (error instanceof Error && error.name !== 'AbortError') {
      console.debug('Analytics tracking failed:', error)
    }
  }
}

// Track scroll depth
export async function trackScrollDepth(depth: number, signal?: AbortSignal): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    await fetch(TRACKING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_path: window.location.pathname,
        session_id: getSessionId(),
        scroll_depth: Math.round(depth),
        event_type: 'scroll',
      }),
      keepalive: true,
      signal,
    })
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      console.debug('Scroll tracking failed:', error)
    }
  }
}

// Track time on page (exit event)
export async function trackTimeOnPage(readTime: number, signal?: AbortSignal): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    await fetch(TRACKING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_path: window.location.pathname,
        session_id: getSessionId(),
        read_time: Math.round(readTime),
        event_type: 'exit',
      }),
      keepalive: true,
      signal,
    })
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      console.debug('Exit tracking failed:', error)
    }
  }
}

// Cleanup function type
type CleanupFunction = () => void

// Initialize tracker with automatic scroll and exit tracking
export function initTracker(): CleanupFunction {
  // Return no-op cleanup if not in browser
  if (typeof window === 'undefined') {
    return () => {}
  }

  const controller = new AbortController()
  const startTime = Date.now()
  let maxScrollDepth = 0
  let hasTrackedScroll25 = false
  let hasTrackedScroll50 = false
  let hasTrackedScroll75 = false
  let hasTrackedScroll100 = false

  // Track initial page view
  void trackPageView(controller.signal)

  // Track scroll depth
  const handleScroll = (): void => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

    maxScrollDepth = Math.max(maxScrollDepth, scrollPercent)

    // Track at 25%, 50%, 75%, 100% milestones
    if (!hasTrackedScroll25 && scrollPercent >= 25) {
      hasTrackedScroll25 = true
      void trackScrollDepth(25, controller.signal)
    }
    if (!hasTrackedScroll50 && scrollPercent >= 50) {
      hasTrackedScroll50 = true
      void trackScrollDepth(50, controller.signal)
    }
    if (!hasTrackedScroll75 && scrollPercent >= 75) {
      hasTrackedScroll75 = true
      void trackScrollDepth(75, controller.signal)
    }
    if (!hasTrackedScroll100 && scrollPercent >= 95) {
      hasTrackedScroll100 = true
      void trackScrollDepth(100, controller.signal)
    }
  }

  // Track time on page when leaving
  const handleBeforeUnload = (): void => {
    const readTime = (Date.now() - startTime) / 1000 // in seconds
    void trackTimeOnPage(readTime, controller.signal)
  }

  // Add event listeners
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('beforeunload', handleBeforeUnload)

  // Cleanup function
  return () => {
    controller.abort()
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('beforeunload', handleBeforeUnload)
  }
}
