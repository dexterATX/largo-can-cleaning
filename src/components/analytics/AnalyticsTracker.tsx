'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { initTracker, trackPageView } from '@/lib/analytics/tracker'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const isInitialized = useRef(false)
  const previousPathname = useRef<string | null>(null)

  // Check if we should track this path
  const shouldTrack = (path: string) => {
    // Don't track admin routes or API routes
    return !path.startsWith('/admin') && !path.startsWith('/api')
  }

  // Initialize tracker on mount (only for non-admin pages)
  useEffect(() => {
    if (pathname && shouldTrack(pathname) && !isInitialized.current) {
      isInitialized.current = true
      const cleanup = initTracker()
      return cleanup
    }
  }, [pathname])

  // Track page views on route change
  useEffect(() => {
    // Only track if:
    // 1. We have a pathname
    // 2. It's not an admin route
    // 3. It's different from the previous pathname (to avoid double-tracking)
    if (pathname && shouldTrack(pathname) && pathname !== previousPathname.current) {
      // Skip initial mount if already handled by initTracker
      if (previousPathname.current !== null) {
        trackPageView(pathname)
      }
      previousPathname.current = pathname
    }
  }, [pathname])

  // This component doesn't render anything
  return null
}
