'use client'

import { useSyncExternalStore } from 'react'

/**
 * Custom hook to track media query matches
 * Uses useSyncExternalStore for better React 18+ compatibility and SSR safety
 */
export function useMediaQuery(query: string): boolean {
  // For SSR, always return false to avoid hydration mismatch
  const subscribe = (callback: () => void) => {
    const mediaQuery = window.matchMedia(query)
    mediaQuery.addEventListener('change', callback)
    return () => mediaQuery.removeEventListener('change', callback)
  }

  const getSnapshot = () => window.matchMedia(query).matches

  // Server snapshot always returns false for SSR safety
  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
