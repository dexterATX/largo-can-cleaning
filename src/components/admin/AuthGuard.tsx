'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

// Auth verification timeout (10 seconds)
const AUTH_TIMEOUT = 10000

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    let timeoutId: NodeJS.Timeout | null = null

    async function checkAuth() {
      // Set up timeout protection
      timeoutId = setTimeout(() => {
        controller.abort()
      }, AUTH_TIMEOUT)

      try {
        const res = await fetch('/api/admin/auth/verify', {
          method: 'GET',
          credentials: 'include',
          signal: controller.signal,
        })

        if (!isMounted) return

        if (res.ok) {
          const data = await res.json()
          if (isMounted) {
            setIsAuthenticated(data.authenticated)

            // If on login page and authenticated, redirect to dashboard
            if (data.authenticated && pathname === '/admin/login') {
              router.push('/admin/dashboard')
            }
          }
        } else {
          if (isMounted) {
            setIsAuthenticated(false)
            // If not on login page, redirect to login
            if (pathname !== '/admin/login') {
              router.push('/admin/login')
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Check if this was a timeout vs user navigation
          if (isMounted) {
            console.error('Auth verification timed out after', AUTH_TIMEOUT, 'ms')
            setAuthError('Authentication verification timed out. Please refresh the page.')
            setIsAuthenticated(false)
            setIsLoading(false)
          }
          return
        }
        console.error('Auth check failed:', error)
        if (isMounted) {
          setAuthError('Authentication check failed. Please try again.')
          setIsAuthenticated(false)
          if (pathname !== '/admin/login') {
            router.push('/admin/login')
          }
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      isMounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      controller.abort()
    }
  }, [router, pathname])

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--asphalt-dark)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[var(--safety-orange)] animate-spin" />
          <p className="text-[var(--slate-gray)] text-sm">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Show error state if auth verification failed (e.g., timeout)
  if (authError && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-[var(--asphalt-dark)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-400 text-sm max-w-sm">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[var(--safety-orange)] text-white rounded-lg hover:bg-[var(--safety-orange-dark)] transition-colors text-sm"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // If on login page, always render children (the login form)
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // For protected pages, only render if authenticated
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
