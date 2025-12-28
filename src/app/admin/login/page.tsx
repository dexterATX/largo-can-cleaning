'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Lock, Loader2, AlertCircle, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
        credentials: 'include',
      })

      // Validate JSON response before parsing
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        setError('Invalid server response. Please try again.')
        return
      }

      const text = await res.text()
      if (!text || text.trim() === '') {
        setError('Empty server response. Please try again.')
        return
      }

      let data: { error?: string }
      try {
        data = JSON.parse(text)
      } catch {
        setError('Invalid server response format. Please try again.')
        return
      }

      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error instanceof Error ? error.message : error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--asphalt-dark)] flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--safety-orange)]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[var(--safety-orange)]/5 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-[var(--concrete-gray)]/50 backdrop-blur-sm border border-[var(--steel-gray)]/20 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20 mb-4">
              <Shield className="w-8 h-8 text-[var(--safety-orange)]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-[var(--slate-gray)] text-sm">
              Enter your password to access the admin panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--light-gray)] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--steel-gray)]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/30 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 focus:ring-2 focus:ring-[var(--safety-orange)]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full flex items-center justify-center gap-2 h-12 bg-[var(--safety-orange)] text-white font-semibold rounded-xl hover:bg-[var(--safety-orange-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Access Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-[var(--slate-gray)] hover:text-[var(--safety-orange)] transition-colors"
            >
              &larr; Back to website
            </Link>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-[var(--steel-gray)] mt-4">
          Protected by secure session authentication
        </p>
      </motion.div>
    </div>
  )
}
