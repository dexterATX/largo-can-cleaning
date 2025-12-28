'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import {
  Save,
  Loader2,
  AlertCircle,
  Building2,
  Globe,
  Mail,
  Phone,
  Search,
  Share2,
  Check,
} from 'lucide-react'

interface Settings {
  business_name: string
  business_tagline: string
  business_phone: string
  business_email: string
  default_meta_title: string
  default_meta_description: string
  social_facebook: string
  social_instagram: string
  social_twitter: string
}

const defaultSettings: Settings = {
  business_name: 'Largo Can Cleaning',
  business_tagline: 'Professional Trash Can Cleaning',
  business_phone: '(352) 843-3425',
  business_email: 'support@largocancleaning.com',
  default_meta_title: 'Largo Can Cleaning | Professional Trash Can Cleaning in Largo, FL',
  default_meta_description: 'Professional trash can cleaning and sanitization services in Pinellas County.',
  social_facebook: '',
  social_instagram: '',
  social_twitter: '',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch settings
  useEffect(() => {
    const controller = new AbortController()

    async function fetchSettings() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/admin/settings', { signal: controller.signal })
        const data = await res.json()
        if (res.ok && data.data && !controller.signal.aborted) {
          // Merge with defaults
          setSettings({
            ...defaultSettings,
            ...Object.fromEntries(
              Object.entries(data.data).map(([key, value]) => [
                key,
                typeof value === 'string' ? value : JSON.stringify(value),
              ])
            ),
          })
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return // Component unmounted, ignore
        }
        console.error('Failed to fetch settings:', err)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }
    fetchSettings()

    return () => controller.abort()
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Validation helpers
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  const isValidUrl = (url: string): boolean => {
    if (!url) return true // Empty URLs are allowed
    try {
      const parsed = new URL(url)
      return ['http:', 'https:'].includes(parsed.protocol)
    } catch {
      return false
    }
  }

  const isValidPhone = (phone: string): boolean => {
    if (!phone) return true // Empty phone is allowed
    // Accepts formats: (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890, etc.
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  // Save settings
  const handleSave = async () => {
    // Email validation
    if (settings.business_email && !isValidEmail(settings.business_email)) {
      setError('Please enter a valid email address (e.g., name@example.com)')
      return
    }

    // Phone validation
    if (settings.business_phone && !isValidPhone(settings.business_phone)) {
      setError('Please enter a valid phone number')
      return
    }

    // Social media URL validation
    if (settings.social_facebook && !isValidUrl(settings.social_facebook)) {
      setError('Please enter a valid Facebook URL (must start with http:// or https://)')
      return
    }

    if (settings.social_instagram && !isValidUrl(settings.social_instagram)) {
      setError('Please enter a valid Instagram URL (must start with http:// or https://)')
      return
    }

    if (settings.social_twitter && !isValidUrl(settings.social_twitter)) {
      setError('Please enter a valid Twitter/X URL (must start with http:// or https://)')
      return
    }

    // Abort any existing save request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsSaving(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
        signal: controller.signal,
      })

      if (controller.signal.aborted) return

      if (res.ok) {
        setSuccess(true)
        // Clear any existing timeout before setting a new one
        if (successTimeoutRef.current) {
          clearTimeout(successTimeoutRef.current)
        }
        successTimeoutRef.current = setTimeout(() => setSuccess(false), 4000)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save settings')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return // Request was aborted, ignore
      }
      setError('Failed to save settings')
    } finally {
      if (!controller.signal.aborted) {
        setIsSaving(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[var(--safety-orange)] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-[var(--slate-gray)] mt-1">
            Configure your website settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--safety-orange)] text-white font-medium rounded-xl hover:bg-[var(--safety-orange-dark)] transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : success ? (
            <Check className="w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {success ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400"
        >
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>Settings saved successfully!</span>
        </motion.div>
      )}

      {/* Business Information */}
      <div className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--safety-orange)]/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[var(--safety-orange)]" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Business Information</h2>
            <p className="text-xs text-[var(--slate-gray)]">Your company details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={settings.business_name}
              onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={settings.business_tagline}
              onChange={(e) => setSettings({ ...settings, business_tagline: e.target.value })}
              className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              value={settings.business_phone}
              onChange={(e) => setSettings({ ...settings, business_phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              value={settings.business_email}
              onChange={(e) => setSettings({ ...settings, business_email: e.target.value })}
              className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">SEO Settings</h2>
            <p className="text-xs text-[var(--slate-gray)]">Default meta tags for search engines</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
              Default Meta Title
              <span className="text-[var(--slate-gray)] text-xs ml-2">
                ({settings.default_meta_title.length}/60)
              </span>
            </label>
            <input
              type="text"
              maxLength={60}
              value={settings.default_meta_title}
              onChange={(e) => setSettings({ ...settings, default_meta_title: e.target.value })}
              className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
              Default Meta Description
              <span className="text-[var(--slate-gray)] text-xs ml-2">
                ({settings.default_meta_description.length}/160)
              </span>
            </label>
            <textarea
              maxLength={160}
              value={settings.default_meta_description}
              onChange={(e) => setSettings({ ...settings, default_meta_description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Social Media</h2>
            <p className="text-xs text-[var(--slate-gray)]">Your social media profile links</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              value={settings.social_facebook}
              onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
              placeholder="https://facebook.com/..."
              className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              value={settings.social_instagram}
              onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
              placeholder="https://instagram.com/..."
              className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
              Twitter/X URL
            </label>
            <input
              type="url"
              value={settings.social_twitter}
              onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
              placeholder="https://twitter.com/..."
              className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Password Hash Generator */}
      <div className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Admin Password</h2>
            <p className="text-xs text-[var(--slate-gray)]">Change in environment variables</p>
          </div>
        </div>
        <p className="text-sm text-[var(--slate-gray)]">
          To change the admin password, generate a new bcrypt hash and update the{' '}
          <code className="px-1.5 py-0.5 bg-[var(--asphalt-dark)] rounded text-xs">ADMIN_PASSWORD_HASH</code>{' '}
          environment variable. You can use online bcrypt generators or run:
        </p>
        <pre className="mt-3 p-3 bg-[var(--asphalt-dark)] rounded-lg text-xs text-[var(--slate-gray)] overflow-x-auto">
          npx bcryptjs-cli hash &quot;your-new-password&quot; 12
        </pre>
      </div>
    </div>
  )
}
