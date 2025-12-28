'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home, Phone } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 sm:p-6">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" aria-hidden="true" />

      {/* Gradient Orbs */}
      <div
        className="absolute top-1/4 -left-16 md:-left-32 w-48 md:w-96 h-48 md:h-96 bg-[var(--safety-orange)]/10 rounded-full blur-[40px] md:blur-[60px]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-16 md:-right-32 w-48 md:w-96 h-48 md:h-96 bg-[var(--safety-orange)]/5 rounded-full blur-[40px] md:blur-[60px]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--error)]/10 border border-[var(--error)]/20 mb-6 sm:mb-8">
          <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--error)]" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
          Oops! Something Went Wrong
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-[var(--slate-gray)] mb-6 sm:mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. Our team has been notified and is working to fix
          the issue. Please try again or return to the homepage.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
          <button
            onClick={reset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--safety-orange)] text-white font-semibold text-sm uppercase tracking-wide hover:bg-[var(--safety-orange-dark)] transition-all duration-300 shadow-lg hover:shadow-[var(--glow-orange)]"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-transparent text-[var(--safety-orange)] font-semibold text-sm uppercase tracking-wide border-2 border-[var(--safety-orange)] hover:bg-[var(--safety-orange)] hover:text-white transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {/* Contact Section */}
        <div className="pt-6 sm:pt-8 border-t border-[var(--steel-gray)]/20">
          <p className="text-xs sm:text-sm text-[var(--slate-gray)] mb-3">
            Need immediate assistance? Contact us directly:
          </p>
          <a
            href="tel:+13528433425"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--concrete-gray)]/50 border border-[var(--steel-gray)]/30 hover:border-[var(--safety-orange)]/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--safety-orange)]/10 flex items-center justify-center">
              <Phone className="w-4 h-4 text-[var(--safety-orange)]" />
            </div>
            <span className="text-sm sm:text-base font-medium text-white">
              (352) 843-3425
            </span>
          </a>
        </div>

        {/* Business Name */}
        <p className="mt-6 sm:mt-8 text-xs text-[var(--steel-gray)]">
          Largo Can Cleaning - Largo, Florida
        </p>
      </div>
    </div>
  )
}
