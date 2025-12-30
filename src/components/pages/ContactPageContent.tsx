'use client'

import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
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
  Zap,
  CalendarCheck,
  MessageCircle,
  ThermometerSun,
  Leaf,
  Award,
  Users,
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

const binCountOptions = [
  { value: '', label: 'How many bins?' },
  { value: '1', label: '1 Bin' },
  { value: '2', label: '2 Bins' },
  { value: '3', label: '3 Bins' },
  { value: '4+', label: '4+ Bins' },
]

const hearAboutUsOptions = [
  { value: '', label: 'How did you hear about us?' },
  { value: 'google', label: 'Google Search' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'nextdoor', label: 'Nextdoor' },
  { value: 'referral', label: 'Friend / Neighbor Referral' },
  { value: 'flyer', label: 'Flyer / Door Hanger' },
  { value: 'other', label: 'Other' },
]

// ============================================
// HERO SECTION - Simple & Direct
// ============================================

function HeroSection() {
  return (
    <section className="pt-28 pb-10 sm:pt-36 sm:pb-14 lg:pt-32 lg:pb-8 bg-gradient-dark relative overflow-hidden">
      {/* CONTACT PAGE: Connection & Communication Theme */}

      {/* Visible dot matrix pattern - communication signals */}
      <div className="absolute inset-0 opacity-40 lg:opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--safety-orange) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-[var(--safety-orange)]/20 rounded-full blur-[80px]" />
      <div className="absolute -top-20 right-0 w-72 h-72 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px] bg-amber-500/15 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-[var(--safety-orange)]/15 rounded-full blur-[60px]" />

      {/* Frosty dark overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center max-w-2xl lg:max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-5 sm:mb-6 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--safety-orange)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--safety-orange)]" />
            </span>
            <span className="text-xs sm:text-sm font-medium text-[var(--safety-orange)]">
              Free Estimates • No Obligation
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-3"
          >
            Get Your Free <span className="text-gradient-orange">Trash Can Cleaning Quote</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="text-base sm:text-lg lg:text-xl text-[var(--slate-gray)] mb-3"
          >
            Ready for clean bins? Fill out the form or give us a call.
          </motion.p>

          {/* Additional descriptive text for SEO */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.17 }}
            className="text-sm text-[var(--slate-gray)]/80 max-w-lg mx-auto mb-6"
          >
            Our professional trash can cleaning service eliminates 99.9% of bacteria, removes stubborn odors, and prevents pest infestations. Serving residential and commercial customers throughout Pinellas County with eco-friendly sanitization solutions.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 lg:mb-8"
          >
            {[
              { icon: Zap, text: 'Same-Day Response' },
              { icon: CalendarCheck, text: 'Flexible Scheduling' },
              { icon: MessageCircle, text: '24/7 Support' },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[var(--concrete-gray)]/50 border border-[var(--steel-gray)]/30"
              >
                <feature.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--safety-orange)]" />
                <span className="text-[11px] sm:text-xs text-[var(--light-gray)]">
                  {feature.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Quick Contact - Mobile only */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-3 lg:hidden"
          >
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--safety-orange)] text-white font-semibold rounded-xl hover:bg-[var(--safety-orange-dark)] transition-colors shadow-lg shadow-[var(--safety-orange)]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--safety-orange)]"
              aria-label={`Call us at ${BUSINESS_INFO.phone}`}
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              Call Now
            </a>
            <a
              href={`mailto:${BUSINESS_INFO.email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--concrete-gray)]/60 text-white font-semibold rounded-xl border border-[var(--steel-gray)]/40 hover:bg-[var(--concrete-gray)] hover:border-[var(--safety-orange)]/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--asphalt-dark)]"
              aria-label={`Email us at ${BUSINESS_INFO.email}`}
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              Email Us
            </a>
          </motion.div>

          {/* Trust Indicators - Desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center gap-6 mt-8 pt-6 border-t border-[var(--steel-gray)]/20"
          >
            <div className="flex items-center gap-2 text-sm text-[var(--slate-gray)]">
              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              <span>500+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--slate-gray)]">
              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--slate-gray)]">
              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              <span>100% Satisfaction Guaranteed</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--asphalt-dark)] to-transparent" />
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
      <label htmlFor={id} className="block text-[10px] lg:text-[11px] font-semibold text-[var(--light-gray)] uppercase tracking-wider mb-1.5 lg:mb-2">
        {label} {required && <span className="text-[var(--safety-orange)]">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className={`w-4 h-4 ${error ? 'text-red-400' : 'text-[var(--steel-gray)]'} group-focus-within:text-[var(--safety-orange)] transition-colors`} />
        </div>
        <input
          type={type}
          id={id}
          name={id}
          required={required}
          aria-required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full pl-10 lg:pl-11 pr-3 lg:pr-4 py-3 lg:py-3.5 text-sm bg-[var(--asphalt-black)] border-2 ${error ? 'border-red-400/50' : 'border-[var(--steel-gray)]/30'} rounded-xl text-white placeholder-[var(--steel-gray)]/50 focus:outline-none focus:border-[var(--safety-orange)] focus:ring-4 focus:ring-[var(--safety-orange)]/15 transition-all`}
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-[11px] text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function FormSelect({
  label,
  id,
  required = false,
  value,
  onChange,
  options,
}: {
  label: string
  id: string
  required?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="group">
      <label htmlFor={id} className="block text-[10px] lg:text-[11px] font-semibold text-[var(--light-gray)] uppercase tracking-wider mb-1.5 lg:mb-2">
        {label} {required && <span className="text-[var(--safety-orange)]">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          required={required}
          aria-required={required}
          value={value}
          onChange={onChange}
          className="w-full px-3 lg:px-4 py-3 lg:py-3.5 text-sm bg-[var(--asphalt-black)] border-2 border-[var(--steel-gray)]/30 rounded-xl text-white focus:outline-none focus:border-[var(--safety-orange)] focus:ring-4 focus:ring-[var(--safety-orange)]/15 transition-all appearance-none cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[var(--asphalt-black)]">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-[var(--steel-gray)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
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
    address: '',
    service: '',
    binCount: '',
    hearAboutUs: '',
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
      setFormData({ name: '', email: '', phone: '', address: '', service: '', binCount: '', hearAboutUs: '', message: '' })
    } catch {
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
    <section className="py-10 sm:py-16 lg:py-20 bg-[var(--asphalt-dark)] -mt-12 sm:-mt-16 relative z-10">
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
                    We&apos;ll respond within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', phone: '', address: '', service: '', binCount: '', hearAboutUs: '', message: '' })
                    }}
                  >
                    Send Another
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                  {/* Form Header */}
                  <div className="flex items-center gap-3 mb-2 lg:mb-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-[var(--safety-orange)]/15 flex items-center justify-center">
                      <Send className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--safety-orange)]" />
                    </div>
                    <div>
                      <h2 className="text-lg lg:text-xl font-bold text-white">Request a Free Quote</h2>
                      <p className="text-xs lg:text-sm text-[var(--slate-gray)]">We respond within 24 hours</p>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg" role="alert">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-3 lg:space-y-4">
                    <h3 className="text-xs font-semibold text-[var(--slate-gray)] uppercase tracking-wide">Contact Info</h3>
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                      <FormInput
                        icon={User}
                        label="Name"
                        id="name"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={fieldErrors.name}
                      />
                      <FormInput
                        icon={Phone}
                        label="Phone"
                        id="phone"
                        type="tel"
                        required
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        error={fieldErrors.phone}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                      <FormInput
                        icon={Mail}
                        label="Email"
                        id="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={fieldErrors.email}
                      />
                      <FormInput
                        icon={MapPin}
                        label="Address"
                        id="address"
                        placeholder="123 Main St, Largo"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="space-y-3 lg:space-y-4">
                    <h3 className="text-xs font-semibold text-[var(--slate-gray)] uppercase tracking-wide">Service Details</h3>
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                      <FormSelect
                        label="Service"
                        id="service"
                        value={formData.service}
                        onChange={handleSelectChange}
                        options={serviceOptions}
                      />
                      <FormSelect
                        label="Bins"
                        id="binCount"
                        value={formData.binCount}
                        onChange={handleSelectChange}
                        options={binCountOptions}
                      />
                    </div>
                    <FormSelect
                      label="How did you find us?"
                      id="hearAboutUs"
                      value={formData.hearAboutUs}
                      onChange={handleSelectChange}
                      options={hearAboutUsOptions}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-3 lg:space-y-4">
                    <h3 className="text-xs font-semibold text-[var(--slate-gray)] uppercase tracking-wide">Additional Info</h3>
                    <div className="group">
                      <label htmlFor="message" className="block text-[11px] lg:text-xs font-semibold text-[var(--light-gray)] uppercase tracking-wider mb-2">
                        Message <span className="text-[var(--steel-gray)] normal-case font-normal">(optional)</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleTextareaChange}
                        placeholder="Gate codes, bin location, special requests..."
                        className="w-full px-4 py-3 lg:py-4 text-sm bg-[var(--asphalt-black)] border-2 border-[var(--steel-gray)]/30 rounded-xl text-white placeholder-[var(--steel-gray)]/50 focus:outline-none focus:border-[var(--safety-orange)] focus:ring-4 focus:ring-[var(--safety-orange)]/15 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* What Happens Next */}
                  <div className="p-3 lg:p-4 rounded-lg bg-[var(--safety-orange)]/5 border border-[var(--safety-orange)]/15">
                    <h4 className="text-xs font-semibold text-white mb-1.5">What happens next?</h4>
                    <p className="text-xs text-[var(--slate-gray)] leading-relaxed">
                      We&apos;ll review your request, prepare a custom quote, and contact you within 24 hours to schedule your first cleaning.
                    </p>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full py-3.5 lg:py-4 text-base font-semibold shadow-lg shadow-[var(--safety-orange)]/20"
                    rightIcon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Get Free Quote'}
                  </Button>
                  <p className="text-center text-[11px] lg:text-xs text-[var(--slate-gray)]">
                    No obligation · Free estimate · 24hr response
                  </p>
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
                Pinellas County, FL — Largo, Seminole, Clearwater, Pinellas Park, Safety Harbor, Dunedin, Palm Harbor & Belleair.
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

            {/* Direct Call - Click to Call */}
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="flex items-center justify-between p-4 lg:p-5 rounded-lg lg:rounded-xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 hover:border-[var(--safety-orange)]/30 transition-colors group"
            >
              <div>
                <p className="text-[10px] lg:text-xs text-[var(--slate-gray)] uppercase tracking-wide">Call us directly</p>
                <p className="text-sm lg:text-lg font-bold text-[var(--safety-orange)]">{BUSINESS_INFO.phone}</p>
              </div>
              <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-[var(--steel-gray)] group-hover:text-[var(--safety-orange)] transition-colors" />
            </a>

            {/* NAP Section */}
            <div className="p-4 lg:p-5 rounded-lg lg:rounded-xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20">
              <div className="flex items-center gap-2 mb-2 lg:mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--safety-orange)]/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[var(--safety-orange)]" />
                </div>
                <h3 className="text-xs lg:text-sm font-semibold text-white">Contact Information</h3>
              </div>
              <div className="space-y-2 text-xs lg:text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[var(--safety-orange)] mt-0.5 flex-shrink-0" />
                  <div className="text-[var(--slate-gray)]">
                    {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.state} {BUSINESS_INFO.address.zip}
                  </div>
                </div>
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="flex items-center gap-2 text-[var(--light-gray)] hover:text-[var(--safety-orange)] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                  <span>{BUSINESS_INFO.phone}</span>
                </a>
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="flex items-center gap-2 text-[var(--light-gray)] hover:text-[var(--safety-orange)] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                  <span>{BUSINESS_INFO.email}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

// ============================================
// AREAS WE SERVE SECTION - BENTO GRID
// ============================================

function AreasWeServeSection() {
  return (
    <section className="py-10 sm:py-16 bg-[var(--asphalt-black)] border-t border-[var(--steel-gray)]/10">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20">
            <MapPin className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--safety-orange)]">Areas We Serve</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Proudly Serving Pinellas County
          </h2>
          <p className="text-[var(--slate-gray)] max-w-lg mx-auto">
            Professional trash can cleaning for residential and commercial customers throughout {BUSINESS_INFO.address.county}.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 max-w-6xl mx-auto">

          {/* Service Areas Card - Large */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sm:col-span-2 lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[var(--concrete-gray)] to-[var(--asphalt-dark)] border border-[var(--steel-gray)]/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--safety-orange)]/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[var(--safety-orange)]" />
              </div>
              <h3 className="text-lg font-bold text-white">Cities We Serve</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {BUSINESS_INFO.areaServed.map((area, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--asphalt-black)]/50 border border-[var(--steel-gray)]/20 text-sm font-medium text-[var(--light-gray)]"
                >
                  <MapPin className="w-3 h-3 text-[var(--safety-orange)]" />
                  {area}
                </span>
              ))}
            </div>
            <p className="text-sm text-[var(--slate-gray)] leading-relaxed">
              Don&apos;t see your area? Give us a call—we&apos;re continuously expanding our coverage and may still be able to serve you with special arrangements.
            </p>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--safety-orange)]/20 flex items-center justify-center">
                <ThermometerSun className="w-5 h-5 text-[var(--safety-orange)]" />
              </div>
              <h3 className="text-lg font-bold text-white">Our Process</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-[var(--asphalt-black)]/30">
                <div className="text-2xl font-bold text-[var(--safety-orange)]">190°F</div>
                <div className="text-xs text-[var(--slate-gray)]">Hot Water</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-[var(--asphalt-black)]/30">
                <div className="text-2xl font-bold text-[var(--safety-orange)]">99.9%</div>
                <div className="text-xs text-[var(--slate-gray)]">Bacteria Killed</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-[var(--asphalt-black)]/30">
                <div className="text-2xl font-bold text-[var(--safety-orange)]">3-5</div>
                <div className="text-xs text-[var(--slate-gray)]">Min Per Bin</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-[var(--asphalt-black)]/30">
                <div className="text-2xl font-bold text-[var(--safety-orange)]">100%</div>
                <div className="text-xs text-[var(--slate-gray)]">Eco-Friendly</div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Us Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[var(--concrete-gray)] to-[var(--asphalt-dark)] border border-[var(--steel-gray)]/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--safety-orange)]/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-[var(--safety-orange)]" />
              </div>
              <h3 className="text-lg font-bold text-white">Why Choose Us</h3>
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[var(--success)] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--slate-gray)]">Locally owned & operated in Seminole, FL</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[var(--success)] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--slate-gray)]">Professional-grade truck-mounted equipment</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[var(--success)] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--slate-gray)]">EPA-approved sanitizing solutions</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[var(--success)] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--slate-gray)]">Flexible scheduling, no long-term contracts</span>
              </li>
            </ul>
          </motion.div>

          {/* Eco-Friendly Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Eco-Friendly</h3>
            </div>
            <p className="text-sm text-[var(--slate-gray)] leading-relaxed">
              Biodegradable cleaning solutions safe for children, pets, and landscaping. All wastewater is captured and properly disposed—nothing enters storm drains.
            </p>
          </motion.div>

          {/* Local Business Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[var(--concrete-gray)] to-[var(--asphalt-dark)] border border-[var(--steel-gray)]/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--safety-orange)]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--safety-orange)]" />
              </div>
              <h3 className="text-lg font-bold text-white">Local Team</h3>
            </div>
            <p className="text-sm text-[var(--slate-gray)] leading-relaxed">
              Pinellas County residents serving our neighbors. When you call, you speak directly with the owner.
            </p>
          </motion.div>

        </div>

        {/* Bottom CTA Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[var(--safety-orange)]/20 via-[var(--safety-orange)]/10 to-[var(--safety-orange)]/20 border border-[var(--safety-orange)]/30 max-w-6xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-white mb-1">Ready for Cleaner, Healthier Bins?</h3>
              <p className="text-sm text-[var(--slate-gray)]">
                Join hundreds of satisfied customers across Pinellas County. We respond within 24 hours.
              </p>
            </div>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--safety-orange)] text-white font-semibold rounded-xl hover:bg-[var(--safety-orange-dark)] transition-colors shadow-lg shadow-[var(--safety-orange)]/20 whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              Call {BUSINESS_INFO.phone}
            </a>
          </div>
        </motion.div>

        {/* SEO Content - Compact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 pt-8 border-t border-[var(--steel-gray)]/10 max-w-4xl mx-auto"
        >
          <p className="text-sm text-[var(--slate-gray)]/80 text-center leading-relaxed">
            Largo Can Cleaning provides professional trash can sanitization services throughout Pinellas County, Florida.
            Whether you need residential curbside bin cleaning, commercial dumpster sanitization, or HOA community services,
            our truck-mounted system uses 190°F pressurized water to eliminate 99.9% of bacteria, remove foul odors, and
            prevent pest infestations. Serving Largo, Seminole, Clearwater, Pinellas Park, Safety Harbor, Dunedin, Palm Harbor,
            Belleair, and surrounding communities with eco-friendly, professional-grade cleaning solutions.
          </p>
        </motion.div>
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
      <AreasWeServeSection />
    </div>
  )
}
