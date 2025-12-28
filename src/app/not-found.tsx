'use client'

import Link from 'next/link'
import { Home, Phone, Wrench, Mail, ArrowLeft, Trash2 } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--asphalt-dark)] relative overflow-hidden flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="hidden md:block absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--safety-orange)]/5 rounded-full blur-[100px]" />
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--safety-orange)]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Main Card */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-[var(--steel-gray)]/30 bg-gradient-to-br from-[var(--concrete-gray)] to-[var(--asphalt-black)] p-6 sm:p-12 overflow-hidden text-center">
          {/* Accent Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--safety-orange)] to-transparent" />

          {/* Glow Effect */}
          <div className="hidden sm:block absolute -top-20 -right-20 w-40 h-40 bg-[var(--safety-orange)]/10 rounded-full blur-2xl" />

          {/* Trash Can Icon */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[var(--safety-orange)]/10 flex items-center justify-center">
                <Trash2 className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--safety-orange)] opacity-80" />
              </div>
              {/* 404 Badge */}
              <div className="absolute -bottom-2 -right-2 bg-[var(--safety-orange)] text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                404
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Page Not Found
          </h1>

          <p className="text-base sm:text-lg text-[var(--slate-gray)] mb-8 max-w-lg mx-auto leading-relaxed">
            Oops! It looks like this page has been taken out with the trash.
            Don&apos;t worry, we can help you find what you&apos;re looking for.
          </p>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-2xl mx-auto">
            <Link
              href="/"
              className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-[var(--safety-orange)] text-white font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-[var(--safety-orange-dark)] hover:shadow-[var(--glow-orange)]"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Go Home</span>
            </Link>

            <Link
              href="/services"
              className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-[var(--asphalt-black)]/50 text-white font-semibold text-sm sm:text-base border border-[var(--steel-gray)]/30 transition-all duration-300 hover:bg-[var(--steel-gray)]/30 hover:border-[var(--safety-orange)]/50"
            >
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--safety-orange)]" />
              <span>Our Services</span>
            </Link>

            <Link
              href="/contact"
              className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-[var(--asphalt-black)]/50 text-white font-semibold text-sm sm:text-base border border-[var(--steel-gray)]/30 transition-all duration-300 hover:bg-[var(--steel-gray)]/30 hover:border-[var(--safety-orange)]/50"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--safety-orange)]" />
              <span>Contact Us</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--steel-gray)]/50 to-transparent mb-6 sm:mb-8" />

          {/* Contact Info */}
          <div className="space-y-4">
            <p className="text-sm text-[var(--slate-gray)]">
              Need immediate assistance? Give us a call:
            </p>
            <a
              href="tel:+13528433425"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20 text-[var(--safety-orange)] font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-[var(--safety-orange)]/20 hover:border-[var(--safety-orange)]/40"
            >
              <Phone className="w-5 h-5" />
              (352) 843-3425
            </a>
          </div>

          {/* Back Link */}
          <div className="mt-8 sm:mt-10">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-sm text-[var(--slate-gray)] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back to previous page
            </button>
          </div>
        </div>

        {/* Bottom Branding */}
        <div className="mt-8 text-center">
          <p className="text-xs sm:text-sm text-[var(--slate-gray)]">
            <span className="text-[var(--safety-orange)] font-semibold">Largo Can Cleaning</span>
            {' '}&mdash;{' '}Professional Trash Can Cleaning in Largo, Florida
          </p>
        </div>
      </div>
    </main>
  )
}
