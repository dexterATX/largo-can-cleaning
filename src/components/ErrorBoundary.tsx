'use client'

import { Component, ReactNode } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component to catch JavaScript errors in child components
 * Provides a fallback UI instead of crashing the entire app
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    console.error('Error Boundary caught an error:', error, errorInfo)

    // In production, you could send this to an error reporting service
    // Example: Sentry.captureException(error)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-xl font-semibold text-white mb-2">
              Something went wrong
            </h2>

            <p className="text-[var(--slate-gray)] mb-6">
              We encountered an unexpected error. Please try refreshing the page or go back to the home page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-left">
                <p className="text-sm font-mono text-red-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--safety-orange)] text-white font-medium hover:bg-[var(--safety-orange-dark)] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--concrete-gray)]/50 text-[var(--light-gray)] font-medium hover:bg-[var(--concrete-gray)] transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Simpler functional wrapper for sections that might fail
 */
interface SectionErrorBoundaryProps {
  children: ReactNode
  sectionName?: string
}

export function SectionErrorBoundary({ children, sectionName }: SectionErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 rounded-xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20">
          <div className="flex items-center gap-3 text-[var(--slate-gray)]">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>
              {sectionName ? `Failed to load ${sectionName}` : 'This section failed to load'}
            </span>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary
