'use client'

import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Shield,
  User,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { BUSINESS_INFO } from '@/lib/schema'

// ============================================
// DATA
// ============================================

const serviceOptions = [
  { value: '', label: 'Select a service' },
  { value: 'residential-monthly', label: 'Monthly Service' },
  { value: 'residential-biweekly', label: 'Bi-Weekly Service' },
  { value: 'residential-onetime', label: 'One-Time Clean' },
  { value: 'commercial', label: 'Commercial Service' },
  { value: 'deep-clean', label: 'Deep Clean' },
]

// ============================================
// HERO SECTION - Simple & Direct
// ============================================

function HeroSection() {
  return (
    <section className="pt-28 pb-10 sm:pt-36 sm:pb-14 lg:pt-32 lg:pb-8 bg-[var(--asphalt-black)] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--safety-orange)]/10 rounded-full blur-[150px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl lg:max-w-3xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-3">
            Get Your <span className="text-[var(--safety-orange)]">Free Quote</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[var(--slate-gray)] mb-6 lg:mb-0">
            Ready for clean bins? Fill out the form or give us a call.
          </p>

          {/* Quick Contact - Mobile only */}
          <div className="flex flex-wrap items-center justify-center gap-4 lg:hidden">
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--safety-orange)] text-white font-semibold rounded-xl hover:bg-[var(--safety-orange-dark)] transition-colors"
            >
              <Phone className="w-4 h-4" />
              {BUSINESS_INFO.phone}
            </a>
            <a
              href={`mailto:${BUSINESS_INFO.email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[var(--light-gray)] font-medium hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              {BUSINESS_INFO.email}
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

// ============================================
// FORM INPUT WITH ICON
// ============================================

function FormInput({
  icon: Icon,
  label,
  id,
  type = 'text',
  required = false,
  placeholder,
  value,
  onChange,
  error,
}: {
  icon: React.ElementType
  label: string
  id: string
  type?: string
  required?: boolean
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}) {
  const errorId = `${id}-error`
  return (
    <div className="group">
      <label htmlFor={id} className="block text-[11px] lg:text-xs font-medium text-[var(--slate-gray)] uppercase tracking-wider mb-2 lg:mb-3">
        {label} {required && <span className="text-[var(--safety-orange)]">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className={`w-3.5 h-3.5 lg:w-[18px] lg:h-[18px] ${error ? 'text-red-400' : 'text-[var(--steel-gray)]'} group-focus-within:text-[var(--safety-orange)] transition-colors`} />
        </div>
        <input
          type={type}
          id={id}
          name={id}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full pl-9 lg:pl-12 pr-3 lg:pr-5 py-2.5 lg:py-4 text-sm lg:text-base bg-[var(--asphalt-black)]/50 lg:bg-[var(--asphalt-black)] border ${error ? 'border-red-400/50' : 'border-[var(--steel-gray)]/20 lg:border-[var(--steel-gray)]/30'} rounded-lg lg:rounded-xl text-white placeholder-[var(--steel-gray)]/60 focus:outline-none focus:border-[var(--safety-orange)]/50 focus:ring-2 lg:focus:ring-4 focus:ring-[var(--safety-orange)]/10 focus:bg-[var(--asphalt-black)] transition-all`}
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// ============================================
// CONTACT FORM SECTION
// ============================================

function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setFieldErrors({})
    setError('')

    // Basic validation
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // For now, simulate submission (replace with actual API when available)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', service: '', message: '' })
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const handleSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-[var(--asphalt-dark)]">
      <Container>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-5xl lg:max-w-6xl mx-auto">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="relative p-5 sm:p-6 lg:p-10 lg:px-12 rounded-xl lg:rounded-2xl bg-gradient-to-b from-[var(--concrete-gray)]/70 to-[var(--concrete-gray)]/40 border border-[var(--steel-gray)]/40 lg:border-[var(--safety-orange)]/20 shadow-xl shadow-black/30 lg:shadow-2xl lg:shadow-[var(--safety-orange)]/5 ring-1 ring-inset ring-white/5">
              {/* Orange accent line at top */}
              <div className="absolute top-0 left-4 right-4 lg:left-8 lg:right-8 h-0.5 lg:h-1 bg-gradient-to-r from-transparent via-[var(--safety-orange)] to-transparent rounded-full" />
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-[var(--success)]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Message Sent!</h3>
                  <p className="text-sm text-[var(--slate-gray)] mb-5">
                    We'll respond within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', phone: '', service: '', message: '' })
                    }}
                  >
                    Send Another
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-6">
                  {/* Form Header */}
                  <div className="mb-4 lg:mb-8">
                    <div className="flex items-center gap-3 mb-2 lg:mb-3">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-[var(--safety-orange)]/15 flex items-center justify-center">
                        <Send className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--safety-orange)]" />
                      </div>
                      <div>
                        <h2 className="text-lg lg:text-2xl font-bold text-white">Request a Free Quote</h2>
                        <p className="hidden lg:block text-sm text-[var(--slate-gray)]">We&apos;ll get back to you within 24 hours</p>
                      </div>
                    </div>
                    <p className="text-xs lg:hidden text-[var(--slate-gray)]">Fill out the form below for your free estimate.</p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg" role="alert">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Row 1: Name & Phone */}
                  <div className="grid grid-cols-2 gap-3 lg:gap-6">
                    <FormInput
                      icon={User}
                      label="Full Name"
                      id="name"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={fieldErrors.name}
                    />
                    <FormInput
                      icon={Phone}
                      label="Phone Number"
                      id="phone"
                      type="tel"
                      required
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      error={fieldErrors.phone}
                    />
                  </div>

                  {/* Row 2: Email & Service */}
                  <div className="grid grid-cols-2 gap-3 lg:gap-6">
                    <FormInput
                      icon={Mail}
                      label="Email Address"
                      id="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={fieldErrors.email}
                    />
                    <div className="group">
                      <label htmlFor="service" className="block text-[11px] lg:text-xs font-medium text-[var(--slate-gray)] uppercase tracking-wider mb-2 lg:mb-3">
                        Service Type
                      </label>
                      <div className="relative">
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleSelectChange}
                          className="w-full px-3 lg:px-4 py-2.5 lg:py-4 text-sm lg:text-base bg-[var(--asphalt-black)]/50 lg:bg-[var(--asphalt-black)] border border-[var(--steel-gray)]/20 lg:border-[var(--steel-gray)]/30 rounded-lg lg:rounded-xl text-white focus:outline-none focus:border-[var(--safety-orange)]/50 focus:ring-2 lg:focus:ring-4 focus:ring-[var(--safety-orange)]/10 focus:bg-[var(--asphalt-black)] transition-all appearance-none cursor-pointer"
                        >
                          {serviceOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-[var(--asphalt-black)]">
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-[var(--steel-gray)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Message */}
                  <div className="group">
                    <label htmlFor="message" className="block text-[11px] lg:text-xs font-medium text-[var(--slate-gray)] uppercase tracking-wider mb-2 lg:mb-3">
                      Additional Details <span className="text-[var(--steel-gray)] normal-case">(optional)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={2}
                      value={formData.message}
                      onChange={handleTextareaChange}
                      placeholder="Tell us about your needs, number of bins, special requests..."
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-4 text-sm lg:text-base bg-[var(--asphalt-black)]/50 lg:bg-[var(--asphalt-black)] border border-[var(--steel-gray)]/20 lg:border-[var(--steel-gray)]/30 rounded-lg lg:rounded-xl text-white placeholder-[var(--steel-gray)]/60 focus:outline-none focus:border-[var(--safety-orange)]/50 focus:ring-2 lg:focus:ring-4 focus:ring-[var(--safety-orange)]/10 focus:bg-[var(--asphalt-black)] transition-all resize-none lg:min-h-[120px]"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2 lg:pt-4">
                    <Button
                      type="submit"
                      className="w-full py-3 lg:py-4 text-base lg:text-lg font-semibold shadow-lg shadow-[var(--safety-orange)]/20 hover:shadow-xl hover:shadow-[var(--safety-orange)]/30 transition-shadow"
                      rightIcon={isSubmitting ? <Loader2 className="w-5 h-5 lg:w-6 lg:h-6 animate-spin" /> : <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Get Your Free Quote'}
                    </Button>
                    <p className="text-center text-xs lg:text-sm text-[var(--slate-gray)] mt-3 lg:mt-4">
                      No obligation · Response within 24 hours
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-3 lg:space-y-4"
          >
            {/* Hours */}
            <div className="p-4 lg:p-5 rounded-lg lg:rounded-xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20">
              <div className="flex items-center gap-2 mb-2 lg:mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--safety-orange)]/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[var(--safety-orange)]" />
                </div>
                <h3 className="text-xs lg:text-sm font-semibold text-white">Business Hours</h3>
              </div>
              <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--slate-gray)]">Every Day</span>
                  <span className="text-white font-medium">24/7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--slate-gray)]">Availability</span>
                  <span className="text-white font-medium">7 Days a Week</span>
                </div>
              </div>
            </div>

            {/* Service Area */}
            <div className="p-4 lg:p-5 rounded-lg lg:rounded-xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20">
              <div className="flex items-center gap-2 mb-2 lg:mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--safety-orange)]/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[var(--safety-orange)]" />
                </div>
                <h3 className="text-xs lg:text-sm font-semibold text-white">Service Area</h3>
              </div>
              <p className="text-xs lg:text-sm text-[var(--slate-gray)] leading-relaxed">
                Pinellas County, FL — Seminole, Largo, Clearwater, St. Pete & more.
              </p>
            </div>

            {/* Guarantee */}
            <div className="p-4 lg:p-5 rounded-lg lg:rounded-xl bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20">
              <div className="flex items-center gap-2 mb-2 lg:mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--safety-orange)]/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[var(--safety-orange)]" />
                </div>
                <h3 className="text-xs lg:text-sm font-semibold text-white">Our Promise</h3>
              </div>
              <ul className="text-xs lg:text-sm text-[var(--slate-gray)] space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-[var(--safety-orange)]">✓</span>
                  <span>Free estimates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--safety-orange)]">✓</span>
                  <span>No contracts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--safety-orange)]">✓</span>
                  <span>100% guaranteed</span>
                </li>
              </ul>
            </div>

            {/* Direct Call */}
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="flex items-center justify-between p-4 lg:p-5 rounded-lg lg:rounded-xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 hover:border-[var(--safety-orange)]/30 transition-colors group"
            >
              <div>
                <p className="text-[10px] lg:text-xs text-[var(--slate-gray)] uppercase tracking-wide">Call us directly</p>
                <p className="text-sm lg:text-lg font-bold text-[var(--safety-orange)]">{BUSINESS_INFO.phone}</p>
              </div>
              <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-[var(--steel-gray)] group-hover:text-[var(--safety-orange)] transition-colors" />
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ContactPageContent() {
  return (
    <div className="relative bg-[var(--asphalt-black)]">
      <HeroSection />
      <ContactFormSection />
    </div>
  )
}
