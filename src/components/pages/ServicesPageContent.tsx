'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import {
  Home,
  Building2,
  CalendarClock,
  Sparkles,
  Check,
  ArrowRight,
  ArrowDown,
  Phone,
  Shield,
  Zap,
  Leaf,
  ThermometerSun,
  Droplets,
  BadgeCheck,
  MapPin,
  Clock,
  CircleDot,
  Play,
  ChevronRight,
  X,
  Info,
  Star,
  Timer,
  Truck,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { BUSINESS_INFO } from '@/lib/schema'
import { cn } from '@/lib/utils'

// ============================================
// DATA
// ============================================

const services = [
  {
    id: 'residential',
    icon: Home,
    title: 'Residential',
    shortDesc: 'For families & homeowners',
    fullDesc: 'Keep your home bins sanitized and odor-free. Perfect for families who want a healthier outdoor environment.',
    features: ['Single or multiple cans', 'Trash & recycling', 'Eco-friendly products', 'Same-day available'],
    price: '$25',
    unit: '/can',
    color: '#3B82F6',
    // Extended details for overlay
    detailedDesc: 'Our residential service is designed for homeowners who want to maintain a clean, healthy environment around their home. We use 190°F high-pressure water and eco-friendly sanitizing solutions to eliminate bacteria, mold, and odors from your trash and recycling bins.',
    whatsIncluded: [
      'High-pressure hot water wash (190°F)',
      'Interior & exterior cleaning',
      'Eco-friendly sanitizing treatment',
      'Deodorizing spray application',
      'Bin repositioned at curb',
    ],
    perfectFor: ['Single-family homes', 'Townhouses', 'Condos', 'Apartments with bins'],
    duration: '3-5 min per can',
    guarantee: '100% satisfaction guaranteed',
  },
  {
    id: 'recurring',
    icon: CalendarClock,
    title: 'Recurring',
    shortDesc: 'Set it & forget it',
    fullDesc: 'Automatic scheduled cleaning on your preferred frequency. Never worry about dirty bins again.',
    features: ['Weekly/Bi-weekly/Monthly', '10% recurring discount', 'Priority scheduling', 'Cancel anytime'],
    price: '$22',
    unit: '/can/mo',
    color: '#F97316',
    popular: true,
    // Extended details for overlay
    detailedDesc: 'Set up automatic cleaning and never think about dirty bins again. Our recurring service customers enjoy priority scheduling, exclusive discounts, and the peace of mind knowing their bins are always fresh. Choose weekly, bi-weekly, or monthly—change anytime.',
    whatsIncluded: [
      'Everything in Residential service',
      '10% automatic discount applied',
      'Priority scheduling slots',
      'SMS/Email reminders',
      'Flexible rescheduling',
      'No contracts—cancel anytime',
    ],
    perfectFor: ['Busy families', 'HOA communities', 'Anyone who wants hassle-free service'],
    duration: '3-5 min per can',
    guarantee: 'Skip or cancel anytime, no fees',
    frequencies: ['Weekly', 'Bi-weekly', 'Monthly'],
  },
  {
    id: 'commercial',
    icon: Building2,
    title: 'Commercial',
    shortDesc: 'For businesses & HOAs',
    fullDesc: 'Professional-grade cleaning for businesses, restaurants, and property managers with volume discounts.',
    features: ['Bulk pricing', 'Dumpster cleaning', 'Invoice billing', 'Multiple locations'],
    price: 'Custom',
    unit: 'quote',
    color: '#8B5CF6',
    // Extended details for overlay
    detailedDesc: 'Keep your business premises clean and compliant with health standards. We service restaurants, retail stores, office buildings, apartment complexes, and HOA communities. Volume discounts available for 10+ bins.',
    whatsIncluded: [
      'All residential service features',
      'Dumpster & compactor cleaning',
      'Volume-based pricing',
      'Flexible invoicing (NET 30)',
      'Multi-location management',
      'Dedicated account manager',
    ],
    perfectFor: ['Restaurants & food service', 'Property managers', 'HOA communities', 'Retail stores', 'Office buildings'],
    duration: 'Varies by scope',
    guarantee: 'Customized service agreements',
  },
  {
    id: 'deep-clean',
    icon: Sparkles,
    title: 'Deep Clean',
    shortDesc: 'Maximum sanitization',
    fullDesc: 'Our most thorough service with industrial degreasing, sanitization, and protective coating.',
    features: ['Interior & exterior', 'Industrial degreasing', 'Protective coating', 'Before/after photos'],
    price: '$45',
    unit: '/can',
    color: '#10B981',
    // Extended details for overlay
    detailedDesc: 'The ultimate bin cleaning experience. Perfect for bins that haven\'t been cleaned in a while or after particularly messy situations. Includes industrial-strength degreasing, extended sanitization, and a protective coating that makes future cleaning easier.',
    whatsIncluded: [
      'Extended high-pressure wash cycle',
      'Industrial degreaser pre-treatment',
      'Hospital-grade sanitization',
      'Protective anti-microbial coating',
      'Before & after photos sent to you',
      'Wheels & lid deep cleaned',
    ],
    perfectFor: ['First-time customers', 'Post-renovation cleanup', 'Bins with heavy buildup', 'Moving into new home'],
    duration: '8-12 min per can',
    guarantee: 'Cleanest bins or we re-clean free',
  },
]

const timelineSteps = [
  {
    title: 'Book Online',
    desc: 'Schedule in 60 seconds. Pick your date and service.',
    icon: Clock,
  },
  {
    title: 'We Arrive',
    desc: 'Our truck comes to you. No prep needed on your end.',
    icon: MapPin,
  },
  {
    title: 'Power Wash',
    desc: '190°F high-pressure wash blasts away everything.',
    icon: ThermometerSun,
  },
  {
    title: 'Sanitize',
    desc: 'Hospital-grade treatment kills 99.9% of bacteria.',
    icon: Droplets,
  },
  {
    title: 'Done!',
    desc: 'Sparkling clean bins returned to your curb.',
    icon: BadgeCheck,
  },
]

const impactStats = [
  { number: '99.9', suffix: '%', label: 'Bacteria Eliminated' },
  { number: '190', suffix: '°F', label: 'Water Temperature' },
  { number: '3', suffix: 'min', label: 'Per Can Average' },
  { number: '500', suffix: '+', label: 'Happy Customers' },
]

const serviceAreas = [
  'Seminole', 'Largo', 'Clearwater', 'St. Petersburg', 
  'Pinellas Park', 'Dunedin', 'Palm Harbor', 'Safety Harbor'
]

// ============================================
// ANIMATED NUMBER COMPONENT
// ============================================

function AnimatedNumber({ value, suffix }: { value: string; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(() => parseInt(value)) // Start with final value
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const targetValue = parseInt(value)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true
      setDisplayValue(0)
      const duration = 1200
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(Math.floor(targetValue * eased))
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setDisplayValue(targetValue)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, targetValue])

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}{suffix}
    </span>
  )
}

// ============================================
// HERO SECTION - Split Layout with Subtle Accents
// ============================================

function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center bg-[var(--asphalt-black)] overflow-hidden">
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--asphalt-black)] via-[var(--asphalt-black)] to-[var(--concrete-gray)]/30" />
        {/* Soft glow - smaller on mobile for performance */}
        <div className="absolute top-1/2 -right-16 md:-right-32 w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-[var(--safety-orange)]/10 md:bg-[var(--safety-orange)]/8 rounded-full blur-[40px] md:blur-[60px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-[150px] md:w-[400px] h-[150px] md:h-[400px] bg-[var(--safety-orange)]/8 md:bg-[var(--safety-orange)]/5 rounded-full blur-[30px] md:blur-[60px]" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Floating Accent Lines - Hidden on mobile */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        {/* Horizontal accent line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-[30%] right-0 w-1/3 h-px bg-gradient-to-l from-[var(--safety-orange)]/40 to-transparent origin-right"
        />
        {/* Vertical accent line */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute top-0 right-[20%] w-px h-1/3 bg-gradient-to-b from-[var(--safety-orange)]/30 to-transparent origin-top"
        />
        {/* Small accent dot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="absolute top-[30%] right-[20%] w-2 h-2 bg-[var(--safety-orange)] rounded-full"
        />
        {/* Corner bracket accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-[25%] right-[10%] w-16 h-16 border-r-2 border-b-2 border-[var(--safety-orange)]/20 rounded-br-xl"
        />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center pt-28 pb-20 sm:pt-36 sm:pb-24">
          {/* Eyebrow */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--safety-orange)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--safety-orange)]" />
            </span>
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--safety-orange)]">
              Our Services
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
          >
            Clean Bins,{' '}
            <span className="relative inline-block">
              <span className="text-[var(--safety-orange)]">Healthy</span>
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                className="absolute -bottom-1 left-0 w-full h-3"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M4 8C40 2 160 2 196 8"
                  stroke="var(--safety-orange)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                />
              </motion.svg>
            </span>
            {' '}Home.
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-lg text-[var(--slate-gray)] mb-8 max-w-xl leading-relaxed"
          >
            Professional trash can cleaning that eliminates 99.9% of bacteria, 
            odors, and pests. Choose the service that fits your needs.
          </motion.p>

          {/* CTA Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              View Services
            </Button>
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-[var(--light-gray)] hover:text-white border border-[var(--steel-gray)]/30 hover:border-[var(--steel-gray)]/50 rounded-lg transition-all"
            >
              <Phone className="w-4 h-4" />
              {BUSINESS_INFO.phone}
            </a>
          </motion.div>

          {/* Social Proof Stats - Modern Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {[
              { value: '500+', label: 'Happy Customers', icon: Star, color: 'var(--safety-orange)' },
              { value: '5.0', label: 'Google Rating', icon: Star, color: '#FBBF24' },
              { value: '24hr', label: 'Turnaround', icon: Zap, color: '#10B981' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[var(--concrete-gray)]/60 border border-[var(--steel-gray)]/30 backdrop-blur-sm"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-white leading-tight">{stat.value}</div>
                  <div className="text-[10px] text-[var(--slate-gray)] uppercase tracking-wide">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Services Quick Preview - Modern Bento Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="w-full max-w-3xl"
          >
            {/* Mobile: Stacked Feature Cards */}
            <div className="sm:hidden space-y-3">
              {/* Featured Service - Recurring */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="relative p-4 rounded-2xl bg-gradient-to-br from-[var(--safety-orange)]/15 via-[var(--concrete-gray)] to-[var(--concrete-gray)] border border-[var(--safety-orange)]/30"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-12 h-12 rounded-xl bg-[var(--safety-orange)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[var(--safety-orange)]/30">
                    <CalendarClock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-white">Recurring Service</h3>
                      <span className="px-2 py-0.5 text-[9px] font-bold text-[var(--safety-orange)] uppercase tracking-wide bg-[var(--safety-orange)]/15 border border-[var(--safety-orange)]/30 rounded-full">
                        Popular
                      </span>
                    </div>
                    <p className="text-xs text-[var(--slate-gray)] mb-2">Set it & forget it. Automatic cleaning on your schedule.</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-bold text-white">$22</span>
                        <span className="text-xs text-[var(--slate-gray)]">/can/mo</span>
                      </div>
                      <span className="text-[10px] text-[var(--success)] font-semibold">Save 10%</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Other Services - Compact Row */}
              <div className="grid grid-cols-3 gap-2">
                {[services[0], services[2], services[3]].map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="p-3 rounded-xl bg-[var(--concrete-gray)] border border-[var(--steel-gray)]/20 text-center"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                      style={{ backgroundColor: `${service.color}15` }}
                    >
                      <service.icon className="w-5 h-5" style={{ color: service.color }} />
                    </div>
                    <h4 className="text-xs font-semibold text-white mb-0.5">{service.title}</h4>
                    <div className="text-sm font-bold text-white">
                      {service.price}
                      <span className="text-[9px] text-[var(--slate-gray)] font-normal">{service.unit}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Desktop: Horizontal Scroll Cards */}
            <div className="hidden sm:grid grid-cols-4 gap-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={cn(
                    "group relative p-5 rounded-2xl transition-all cursor-pointer",
                    service.popular
                      ? "bg-gradient-to-br from-[var(--safety-orange)]/15 to-[var(--concrete-gray)] border-2 border-[var(--safety-orange)]/40"
                      : "bg-[var(--concrete-gray)]/60 hover:bg-[var(--concrete-gray)] border border-[var(--steel-gray)]/20 hover:border-[var(--steel-gray)]/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto transition-all group-hover:scale-110",
                      service.popular && "shadow-lg shadow-[var(--safety-orange)]/30"
                    )}
                    style={{
                      backgroundColor: service.popular ? service.color : `${service.color}20`,
                    }}
                  >
                    <service.icon
                      className="w-6 h-6"
                      style={{ color: service.popular ? 'white' : service.color }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-[var(--safety-orange)] transition-colors">
                      {service.title}
                    </h3>
                    {service.popular && (
                      <span className="px-1.5 py-0.5 text-[8px] font-bold text-[var(--safety-orange)] uppercase tracking-wide bg-[var(--safety-orange)]/15 border border-[var(--safety-orange)]/30 rounded">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--slate-gray)] mb-3 line-clamp-2">{service.shortDesc}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-xl font-bold text-white group-hover:text-[var(--safety-orange)] transition-colors">{service.price}</span>
                    <span className="text-[10px] text-[var(--slate-gray)]">{service.unit}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View All Services Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-center mt-6"
            >
              <a
                href="#services"
                className="inline-flex items-center gap-2 text-sm text-[var(--slate-gray)] hover:text-[var(--safety-orange)] transition-colors group"
              >
                <span>View all service details</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-[var(--steel-gray)]/50 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-[var(--safety-orange)]" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ============================================
// SERVICE DETAIL OVERLAY COMPONENT
// ============================================

interface ServiceDetailOverlayProps {
  service: typeof services[0] | null
  isOpen: boolean
  onClose: () => void
}

function ServiceDetailOverlay({ service, isOpen, onClose }: ServiceDetailOverlayProps) {
  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!service) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Overlay Panel - Fits viewport */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed inset-x-2 bottom-2 z-50 rounded-2xl overflow-hidden"
            style={{ maxHeight: 'calc(100dvh - 16px)' }}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-[var(--concrete-gray)]" />

            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: service.color }}
            />

            {/* Content - No scroll, fits screen */}
            <div className="relative h-full flex flex-col p-4 sm:p-5">
              {/* Handle Bar & Close Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-1 rounded-full bg-[var(--steel-gray)]/50" />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[var(--steel-gray)]/20 flex items-center justify-center text-[var(--slate-gray)]"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Header - Icon, Title, Price */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${service.color}15` }}
                >
                  <service.icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: service.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-white truncate">{service.title}</h2>
                    {service.popular && (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-[var(--safety-orange)] text-white rounded-full flex-shrink-0">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--slate-gray)] truncate">{service.shortDesc}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl sm:text-2xl font-bold text-white">{service.price}</div>
                  <div className="text-[10px] sm:text-xs text-[var(--slate-gray)]">{service.unit}</div>
                </div>
              </div>

              {/* Quick Stats - Horizontal compact */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 text-center py-2 px-2 rounded-lg bg-[var(--asphalt-black)]/50">
                  <Timer className="w-4 h-4 mx-auto mb-0.5" style={{ color: service.color }} />
                  <p className="text-[10px] text-[var(--slate-gray)]">Duration</p>
                  <p className="text-xs font-semibold text-white truncate">{service.duration}</p>
                </div>
                <div className="flex-1 text-center py-2 px-2 rounded-lg bg-[var(--asphalt-black)]/50">
                  <ShieldCheck className="w-4 h-4 mx-auto mb-0.5" style={{ color: service.color }} />
                  <p className="text-[10px] text-[var(--slate-gray)]">Guarantee</p>
                  <p className="text-xs font-semibold text-white">100%</p>
                </div>
                <div className="flex-1 text-center py-2 px-2 rounded-lg bg-[var(--asphalt-black)]/50">
                  <Star className="w-4 h-4 mx-auto mb-0.5" style={{ color: service.color }} />
                  <p className="text-[10px] text-[var(--slate-gray)]">Rating</p>
                  <p className="text-xs font-semibold text-white">5.0 ★</p>
                </div>
              </div>

              {/* What's Included - Compact grid */}
              <div className="flex-1 min-h-0 mb-4">
                <p className="text-xs font-semibold text-[var(--slate-gray)] uppercase tracking-wider mb-2">
                  What's Included
                </p>
                <div className="grid grid-cols-2 gap-1.5 overflow-y-auto max-h-[120px] sm:max-h-[140px]">
                  {service.whatsIncluded?.slice(0, 6).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-[var(--asphalt-black)]/30"
                    >
                      <Check className="w-3 h-3 flex-shrink-0" style={{ color: service.color }} />
                      <span className="text-[11px] sm:text-xs text-[var(--light-gray)] truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Perfect For - Tags row */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-[var(--slate-gray)] uppercase tracking-wider mb-2">
                  Perfect For
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {service.perfectFor?.slice(0, 4).map((item, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium"
                      style={{
                        backgroundColor: `${service.color}15`,
                        color: service.color
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Buttons - Fixed at bottom */}
              <div className="flex gap-2 pt-2 border-t border-[var(--steel-gray)]/10">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 sm:py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: service.color }}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.a
                  whileTap={{ scale: 0.98 }}
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="py-3 sm:py-3.5 px-4 rounded-xl font-semibold text-[var(--light-gray)] text-sm flex items-center justify-center gap-2 border border-[var(--steel-gray)]/30"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Call</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ============================================
// SERVICE CARD COMPONENT - Reusable for both mobile and desktop
// ============================================

interface ServiceCardProps {
  service: typeof services[0]
  index: number
  isActive?: boolean
  isMobile?: boolean
  onTap?: () => void
}

function ServiceCard({ service, index, isActive = false, isMobile = false, onTap }: ServiceCardProps) {
  return (
    <div
      onClick={onTap}
      className={cn(
        "group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer",
        "bg-gradient-to-br from-[var(--concrete-gray)] to-[var(--asphalt-black)]",
        "border border-[var(--steel-gray)]/20",
        isActive && isMobile && "border-[var(--safety-orange)]/50 shadow-lg shadow-[var(--safety-orange)]/10",
        !isMobile && "hover:border-[var(--steel-gray)]/40 hover:shadow-xl hover:shadow-black/20",
        "active:scale-[0.98]"
      )}
    >

      {/* Popular Badge - Floating */}
      {service.popular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[var(--safety-orange)] to-[var(--safety-orange-light)] text-white rounded-full shadow-lg shadow-[var(--safety-orange)]/30">
            Most Popular
          </span>
        </div>
      )}

      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${service.color}00, ${service.color}, ${service.color}00)`,
          opacity: service.popular ? 1 : 0.5
        }}
      />

      <div className="p-5 sm:p-6">
        {/* Icon + Title Row */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${service.color}15` }}
            >
              <service.icon className="w-7 h-7" style={{ color: service.color }} />
            </div>
            {/* Glow effect - hidden on mobile */}
            <div
              className="hidden md:block absolute inset-0 rounded-2xl blur-xl opacity-30 -z-10"
              style={{ backgroundColor: service.color }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-[var(--safety-orange)] transition-colors">
              {service.title}
            </h3>
            <p className="text-sm text-[var(--slate-gray)]">{service.shortDesc}</p>
          </div>
        </div>

        {/* Price - Large & Prominent */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-4xl font-bold text-white">{service.price}</span>
          <span className="text-sm text-[var(--slate-gray)]">{service.unit}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--slate-gray)] mb-5 leading-relaxed line-clamp-2">
          {service.fullDesc}
        </p>

        {/* Features - Vertical List */}
        <div className="space-y-2.5 mb-6">
          {service.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${service.color}20` }}
              >
                <Check className="w-3 h-3" style={{ color: service.color }} />
              </div>
              <span className="text-sm text-[var(--light-gray)]">{feature}</span>
            </div>
          ))}
        </div>

        {/* View Details Button */}
        <div
          className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 group/btn hover:brightness-110 active:scale-[0.98]"
          style={{
            backgroundColor: service.popular ? service.color : `${service.color}15`,
            color: service.popular ? 'white' : service.color
          }}
        >
          <span>View Details</span>
          <ChevronDown className="w-4 h-4 transition-transform group-hover/btn:translate-y-0.5" />
        </div>
      </div>

      {/* Hover/Active Overlay Hint */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  )
}

// ============================================
// MOBILE CAROUSEL COMPONENT - CSS Scroll Snap for instant response
// ============================================

interface MobileServicesCarouselProps {
  onServiceTap: (service: typeof services[0]) => void
}

function MobileServicesCarousel({ onServiceTap }: MobileServicesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(1)

  // Update active index based on scroll position
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    // Scroll to recurring (index 1) on mount
    const itemWidth = container.offsetWidth * 0.85 + 16 // 85% + gap
    container.scrollTo({ left: itemWidth, behavior: 'auto' })

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const itemWidth = container.offsetWidth * 0.85 + 16
      const newIndex = Math.round(scrollLeft / itemWidth)
      setActiveIndex(Math.min(newIndex, services.length - 1))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current
    if (!container) return
    const itemWidth = container.offsetWidth * 0.85 + 16
    container.scrollTo({ left: index * itemWidth, behavior: 'smooth' })
  }

  return (
    <div className="md:hidden">
      {/* CSS Scroll Snap Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {services.map((service, index) => (
          <div
            key={service.id}
            className="w-[85%] flex-shrink-0 snap-center"
          >
            <ServiceCard
              service={service}
              index={index}
              isActive={index === activeIndex}
              isMobile
              onTap={() => onServiceTap(service)}
            />
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className="relative p-1"
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-150",
                index === activeIndex
                  ? "bg-[var(--safety-orange)]"
                  : "bg-[var(--steel-gray)]/50"
              )}
            />
            {index === activeIndex && (
              <div className="absolute inset-0 m-auto w-4 h-4 rounded-full border-2 border-[var(--safety-orange)]/50" />
            )}
          </button>
        ))}
      </div>

      {/* Swipe Hint */}
      <p className="text-center text-xs text-[var(--slate-gray)] mt-3">
        Swipe to explore • Tap for details
      </p>
    </div>
  )
}

// ============================================
// SERVICES DETAIL SECTION
// ============================================

function BentoServicesSection() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)

  const handleServiceTap = (service: typeof services[0]) => {
    setSelectedService(service)
    setIsOverlayOpen(true)
  }

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false)
    // Delay clearing the service to allow exit animation
    setTimeout(() => setSelectedService(null), 300)
  }

  return (
    <section className="py-16 sm:py-24 bg-[var(--asphalt-dark)] relative overflow-hidden">
      {/* Background accents - smaller on mobile for performance */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--steel-gray)]/30 to-transparent" />
      <div className="absolute top-1/4 -left-16 md:-left-32 w-[150px] md:w-[400px] h-[150px] md:h-[400px] bg-[var(--safety-orange)]/8 md:bg-[var(--safety-orange)]/5 rounded-full blur-[50px] md:blur-[100px]" />
      <div className="absolute bottom-1/4 -right-16 md:-right-32 w-[150px] md:w-[400px] h-[150px] md:h-[400px] bg-[var(--safety-orange)]/8 md:bg-[var(--safety-orange)]/5 rounded-full blur-[50px] md:blur-[100px]" />

      {/* Section Header */}
      <Container className="relative mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20"
          >
            <CircleDot className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--safety-orange)]">
              Service Options
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your{' '}
            <span className="relative inline-block">
              <span className="text-[var(--safety-orange)]">Clean</span>
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                className="absolute -bottom-1 left-0 w-full h-3"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M4 8C40 2 160 2 196 8"
                  stroke="var(--safety-orange)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                />
              </motion.svg>
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[var(--slate-gray)] max-w-xl mx-auto">
            Every property is different. That's why we offer flexible plans
            to match your exact needs.
          </p>

          {/* Tap for details hint - Mobile only */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:hidden mt-6"
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[var(--safety-orange)]"
              />
              <span className="text-xs font-medium text-[var(--light-gray)]">Tap any card for details</span>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Mobile Carousel */}
      <MobileServicesCarousel onServiceTap={handleServiceTap} />

      {/* Desktop Grid */}
      <Container className="relative hidden md:block">
        <div className="grid grid-cols-2 gap-5 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              onTap={() => handleServiceTap(service)}
            />
          ))}
        </div>
      </Container>

      {/* Bottom CTA */}
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10 sm:mt-12"
        >
          <p className="text-sm text-[var(--slate-gray)] mb-4">
            Not sure which service is right for you?
          </p>
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[var(--safety-orange)] hover:text-white border border-[var(--safety-orange)]/30 hover:border-[var(--safety-orange)] hover:bg-[var(--safety-orange)]/10 rounded-full transition-all duration-300"
          >
            <Phone className="w-4 h-4" />
            Call for free consultation
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </Container>

      {/* Service Detail Overlay */}
      <ServiceDetailOverlay
        service={selectedService}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
      />
    </section>
  )
}

// ============================================
// MOBILE STEPS CAROUSEL - CSS Scroll Snap
// ============================================

function MobileStepsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const itemWidth = container.offsetWidth
      const newIndex = Math.round(scrollLeft / itemWidth)
      setActiveStep(Math.min(newIndex, timelineSteps.length - 1))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current
    if (!container) return
    container.scrollTo({ left: index * container.offsetWidth, behavior: 'smooth' })
  }

  return (
    <div className="lg:hidden">
      {/* CSS Scroll Snap Steps */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {timelineSteps.map((step, index) => (
          <div key={index} className="w-full flex-shrink-0 snap-center px-4">
            <div className="bg-[var(--concrete-gray)] rounded-2xl p-5 border border-[var(--steel-gray)]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--safety-orange)]/10 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-[var(--safety-orange)]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[var(--safety-orange)] uppercase tracking-wider">
                    Step {index + 1} of {timelineSteps.length}
                  </span>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                </div>
              </div>
              <p className="text-sm text-[var(--slate-gray)] leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar & Navigation */}
      <div className="px-4 mt-4">
        <div className="h-1 bg-[var(--steel-gray)]/20 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-[var(--safety-orange)] rounded-full transition-all duration-150"
            style={{ width: `${((activeStep + 1) / timelineSteps.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToIndex(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="flex items-center gap-1 text-xs font-medium text-[var(--slate-gray)] disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Previous
          </button>

          <div className="flex gap-1.5">
            {timelineSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className="relative p-1"
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-150",
                    index === activeStep
                      ? "bg-[var(--safety-orange)]"
                      : "bg-[var(--steel-gray)]/40"
                  )}
                />
                {index === activeStep && (
                  <div className="absolute inset-0 m-auto w-4 h-4 rounded-full border-2 border-[var(--safety-orange)]/50" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollToIndex(Math.min(timelineSteps.length - 1, activeStep + 1))}
            disabled={activeStep === timelineSteps.length - 1}
            className="flex items-center gap-1 text-xs font-medium text-[var(--slate-gray)] disabled:opacity-30"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// VERTICAL TIMELINE PROCESS
// ============================================

function TimelineProcessSection() {
  return (
    <section className="py-12 sm:py-20 bg-[var(--asphalt-black)] relative overflow-hidden">
      {/* Top border line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--steel-gray)]/30 to-transparent" />

      {/* Soft glow accents */}
      <div className="absolute top-1/2 -left-32 w-[300px] h-[300px] bg-[var(--safety-orange)]/5 rounded-full blur-[120px] -translate-y-1/2 hidden sm:block" />

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <Container>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--safety-orange)] mb-3">
              <Play className="w-3.5 h-3.5" />
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              From Dirty to <span className="text-[var(--safety-orange)]">Spotless</span>
            </h2>
            <p className="text-sm text-[var(--slate-gray)] max-w-sm mx-auto">
              Our streamlined 5-step process means you never lift a finger.
            </p>
          </motion.div>

          {/* Video Card - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative rounded-2xl overflow-hidden bg-[var(--concrete-gray)] aspect-[16/10]">
              {/* Video thumbnail gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 rounded-full bg-[var(--safety-orange)] flex items-center justify-center shadow-lg shadow-[var(--safety-orange)]/30"
                >
                  <Play className="w-6 h-6 text-white ml-0.5" />
                </motion.button>
              </div>

              {/* Video info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Watch Process</p>
                      <p className="text-[10px] text-white/60">60 seconds</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/60 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
                    HD
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>

        {/* Steps Carousel */}
        <MobileStepsCarousel />

        {/* CTA */}
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <Button className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Schedule Your Clean
            </Button>
          </motion.div>
        </Container>
      </div>

      {/* Desktop Layout */}
      <Container className="relative hidden lg:block">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Header & Video */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--safety-orange)] mb-4">
              <Play className="w-4 h-4" />
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              From Dirty to
              <br />
              <span className="text-[var(--safety-orange)]">Spotless</span> in Minutes
            </h2>
            <p className="text-lg text-[var(--slate-gray)] mb-8">
              Our streamlined process means you never have to lift a finger.
              We handle everything from start to finish.
            </p>

            {/* Video Card */}
            <div className="relative rounded-2xl overflow-hidden bg-[var(--concrete-gray)] aspect-video mb-8 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-[var(--safety-orange)] flex items-center justify-center shadow-lg shadow-[var(--safety-orange)]/30 group-hover:shadow-[var(--safety-orange)]/50 transition-shadow"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </motion.div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center justify-between">
                  <p className="text-sm text-white font-medium">Watch our 60-second process video</p>
                  <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">HD</span>
                </div>
              </div>
            </div>

            <Button rightIcon={<ArrowRight className="w-5 h-5" />}>
              Schedule Your Clean
            </Button>
          </motion.div>

          {/* Right - Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--safety-orange)] via-[var(--safety-orange)]/50 to-transparent" />

            <div className="space-y-6">
              {timelineSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex gap-5 group"
                >
                  {/* Step Circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="w-12 h-12 rounded-full bg-[var(--asphalt-black)] border-2 border-[var(--safety-orange)] flex items-center justify-center group-hover:bg-[var(--safety-orange)] transition-all duration-300"
                    >
                      <step.icon className="w-5 h-5 text-[var(--safety-orange)] group-hover:text-white transition-colors" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="p-4 rounded-xl bg-[var(--concrete-gray)]/50 border border-[var(--steel-gray)]/20 group-hover:border-[var(--safety-orange)]/30 transition-colors">
                      <span className="text-[10px] font-bold text-[var(--safety-orange)] uppercase tracking-wider">
                        Step {index + 1}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1 mb-1 group-hover:text-[var(--safety-orange)] transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-[var(--slate-gray)]">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

// ============================================
// IMPACT NUMBERS SECTION
// ============================================

// Icons for each stat
const statIcons = [ShieldCheck, ThermometerSun, Timer, Star]

function ImpactSection() {
  return (
    <section className="py-10 sm:py-16 bg-[var(--asphalt-dark)] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--safety-orange)]/5 to-transparent" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--safety-orange)]/30 to-transparent" />

      <Container className="relative z-10">
        {/* Mobile Layout - 2x2 Grid Cards */}
        <div className="lg:hidden">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="text-lg font-bold text-white">
              The Numbers <span className="text-[var(--safety-orange)]">Speak</span>
            </h2>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {impactStats.map((stat, index) => {
              const IconComponent = statIcons[index]
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="relative bg-[var(--concrete-gray)] rounded-xl p-4 border border-[var(--steel-gray)]/10 overflow-hidden"
                >
                  {/* Subtle glow */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-[var(--safety-orange)]/10 rounded-full blur-2xl" />

                  <div className="relative">
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-lg bg-[var(--safety-orange)]/10 flex items-center justify-center mb-2">
                      <IconComponent className="w-4 h-4 text-[var(--safety-orange)]" />
                    </div>

                    {/* Number */}
                    <div className="text-2xl font-bold text-white mb-0.5">
                      <AnimatedNumber value={stat.number} suffix={stat.suffix} />
                    </div>

                    {/* Label */}
                    <div className="text-[10px] text-[var(--slate-gray)] uppercase tracking-wider leading-tight">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:items-center lg:justify-between gap-8">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:max-w-xs"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              The Numbers Speak
            </h2>
            <p className="text-sm text-[var(--slate-gray)]">
              Real results from real cleaning. Here's what we deliver every single time.
            </p>
          </motion.div>

          {/* Right - Stats */}
          <div className="flex items-center gap-12">
            {impactStats.map((stat, index) => {
              const IconComponent = statIcons[index]
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--safety-orange)]/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-[var(--safety-orange)]/20 transition-colors">
                    <IconComponent className="w-5 h-5 text-[var(--safety-orange)]" />
                  </div>
                  <div className="text-3xl font-bold text-[var(--safety-orange)] mb-0.5">
                    <AnimatedNumber value={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-[var(--slate-gray)] uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}

// ============================================
// SERVICE AREAS SECTION
// ============================================

const cityMapData: Record<string, { embedUrl: string; mapsUrl: string }> = {
  'Seminole': {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56384.85898856498!2d-82.82584842167969!3d27.83972895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2e134c1ffa229%3A0x7c8ff2cd9d9c5c8b!2sSeminole%2C%20FL!5e0!3m2!1sen!2sus!4v1702500000000',
    mapsUrl: 'https://maps.google.com/?q=Seminole,+FL',
  },
  'Largo': {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56384.85898856498!2d-82.79584842167969!3d27.90972895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2e1f5c1ffaac9%3A0x7c8ff2cd9d7c5c1b!2sLargo%2C%20FL!5e0!3m2!1sen!2sus!4v1702500000001',
    mapsUrl: 'https://maps.google.com/?q=Largo,+FL',
  },
  'Clearwater': {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56284.85898856498!2d-82.80584842167969!3d27.96572895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2f15c1ffaac29%3A0x7c8ff2cd9d7c5c9b!2sClearwater%2C%20FL!5e0!3m2!1sen!2sus!4v1702500000002',
    mapsUrl: 'https://maps.google.com/?q=Clearwater,+FL',
  },
  'St. Petersburg': {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56484.85898856498!2d-82.64584842167969!3d27.77072895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2e1f5c1ffaa09%3A0x7c8ff2cd9d7c5cab!2sSt.%20Petersburg%2C%20FL!5e0!3m2!1sen!2sus!4v1702500000003',
    mapsUrl: 'https://maps.google.com/?q=St.+Petersburg,+FL',
  },
  'Pinellas Park': {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56384.85898856498!2d-82.70584842167969!3d27.84272895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2e1f5c1ff1a29%3A0x7c8ff2cd9d7c5c3b!2sPinellas%20Park%2C%20FL!5e0!3m2!1sen!2sus!4v1702500000004',
    mapsUrl: 'https://maps.google.com/?q=Pinellas+Park,+FL',
  },
  'Dunedin': {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56184.85898856498!2d-82.77584842167969!3d28.01972895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2f1f5c1ffaac9%3A0x7c8ff2cd9d7c5c5b!2sDunedin%2C%20FL!5e0!3m2!1sen!2sus!4v1702500000005',
    mapsUrl: 'https://maps.google.com/?q=Dunedin,+FL',
  },
  'Palm Harbor': {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56084.85898856498!2d-82.76584842167969!3d28.07772895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2f1f5c1ffeac9%3A0x7c8ff2cd9d7c5c7b!2sPalm%20Harbor%2C%20FL!5e0!3m2!1sen!2sus!4v1702500000006',
    mapsUrl: 'https://maps.google.com/?q=Palm+Harbor,+FL',
  },
  'Safety Harbor': {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56184.85898856498!2d-82.69584842167969!3d28.00172895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2f1f5c1ffcac9%3A0x7c8ff2cd9d7c5c6b!2sSafety%20Harbor%2C%20FL!5e0!3m2!1sen!2sus!4v1702500000007',
    mapsUrl: 'https://maps.google.com/?q=Safety+Harbor,+FL',
  },
}

const defaultMapEmbed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d225456.2438227877!2d-82.89848574564516!3d27.896989381498656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2e66a31cf5ed9%3A0x9de0c2f85a14a43e!2sPinellas%20County%2C%20FL!5e0!3m2!1sen!2sus!4v1702500000000!5m2!1sen!2sus'

function ServiceAreasSection() {
  const [selectedCity, setSelectedCity] = useState<string | null>('Seminole')
  
  const currentMapUrl = selectedCity 
    ? cityMapData[selectedCity]?.embedUrl || defaultMapEmbed
    : defaultMapEmbed
    
  const currentMapsLink = selectedCity
    ? cityMapData[selectedCity]?.mapsUrl || 'https://maps.google.com/?q=Pinellas+County,+FL'
    : 'https://maps.google.com/?q=Pinellas+County,+FL'

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[var(--asphalt-dark)]">
      <Container>
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--safety-orange)] mb-3">
              <MapPin className="w-3.5 h-3.5" />
              SERVICE AREAS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Proudly Serving{' '}
              <span className="text-[var(--safety-orange)]">Pinellas County</span>
            </h2>
            <p className="text-sm text-[var(--slate-gray)]">
              Tap a city below to view on the map
            </p>
          </motion.div>

          {/* Mobile City Pills - 4x2 Grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {serviceAreas.map((area) => {
              // Shorten names for mobile
              const shortName = area
                .replace('St. Petersburg', 'St. Pete')
                .replace('Palm Harbor', 'Palm Hbr')
                .replace('Safety Harbor', 'Safety Hbr')
                .replace('Pinellas Park', 'Pinellas Pk')
              
              return (
                <button
                  key={area}
                  onClick={() => setSelectedCity(selectedCity === area ? null : area)}
                  className={cn(
                    'py-2.5 rounded-lg text-[11px] font-medium border transition-all text-center',
                    selectedCity === area
                      ? 'bg-[var(--safety-orange)] text-white border-[var(--safety-orange)]'
                      : 'bg-[var(--concrete-gray)] text-[var(--light-gray)] border-[var(--steel-gray)]/20'
                  )}
                >
                  {shortName}
                </button>
              )
            })}
          </div>

          {/* Mobile Map - No animation to prevent white flash */}
          <div className="relative rounded-xl overflow-hidden border border-[var(--steel-gray)]/30 mb-4 bg-[var(--asphalt-black)]">
            <div className="relative w-full aspect-[4/3]">
              <iframe
                key={currentMapUrl}
                src={currentMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Service Area Map - ${selectedCity || 'Pinellas County'}, FL`}
                className="absolute inset-0"
              />
            </div>
            
            {/* Mobile Map Footer */}
            <div className="bg-[var(--asphalt-black)] px-3 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                <span className="text-[11px] text-[var(--light-gray)]">
                  {selectedCity ? (
                    <>Viewing <strong className="text-white">{selectedCity}</strong></>
                  ) : (
                    <>Servicing <strong className="text-white">8 cities</strong></>
                  )}
                </span>
              </div>
              <a
                href={currentMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium text-[var(--safety-orange)] inline-flex items-center gap-0.5"
              >
                Open
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Mobile Confirmation & CTA */}
          {selectedCity && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--safety-orange)]/10 text-xs font-medium text-[var(--safety-orange)]">
                <Check className="w-3.5 h-3.5" />
                Yes, we service {selectedCity}!
              </span>
            </motion.div>
          )}

          <div className="text-center">
            <p className="text-xs text-[var(--slate-gray)] mb-4">
              Don't see your area? Contact us — we may still be able to help!
            </p>
            <Button size="sm" variant="outline" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
              Check Availability
            </Button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-10 items-center">
          {/* Google Map - No animation to prevent white flash */}
          <div className="relative rounded-2xl overflow-hidden border border-[var(--steel-gray)]/30 bg-[var(--asphalt-black)]">
            <div className="relative w-full aspect-[4/3]">
              <iframe
                key={currentMapUrl}
                src={currentMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Service Area Map - ${selectedCity || 'Pinellas County'}, FL`}
                className="absolute inset-0"
              />
            </div>
            
            <div className="bg-[var(--asphalt-black)] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                <span className="text-xs text-[var(--light-gray)]">
                  {selectedCity ? (
                    <>Viewing <strong className="text-white">{selectedCity}</strong></>
                  ) : (
                    <>Servicing <strong className="text-white">8 cities</strong></>
                  )}
                </span>
              </div>
              <a
                href={currentMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-[var(--safety-orange)] hover:text-white transition-colors inline-flex items-center gap-1"
              >
                Open in Maps
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--safety-orange)] mb-4">
              <MapPin className="w-4 h-4" />
              SERVICE AREAS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Proudly Serving
              <br />
              <span className="text-[var(--safety-orange)]">Pinellas County</span>
            </h2>
            <p className="text-base text-[var(--slate-gray)] mb-6">
              We provide our premium trash can cleaning service throughout the greater 
              Tampa Bay area. Click a city to explore on the map.
            </p>

            {/* Area Tags - Interactive */}
            <div className="flex flex-wrap gap-2 mb-6">
              {serviceAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedCity(selectedCity === area ? null : area)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
                    selectedCity === area
                      ? 'bg-[var(--safety-orange)] text-white border-[var(--safety-orange)]'
                      : 'bg-[var(--concrete-gray)] text-[var(--light-gray)] border-[var(--steel-gray)]/20 hover:border-[var(--safety-orange)]/50 hover:text-white'
                  )}
                >
                  {area}
                </button>
              ))}
            </div>

            {selectedCity && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[var(--safety-orange)] mb-6"
              >
                ✓ Yes, we service {selectedCity}!
              </motion.p>
            )}

            <p className="text-sm text-[var(--slate-gray)] mb-6">
              Don't see your area? Contact us — we may still be able to help!
            </p>

            <Button variant="outline" rightIcon={<ChevronRight className="w-4 h-4" />}>
              Check Availability
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}


// ============================================
// FINAL CTA SECTION
// ============================================

function FinalCTASection() {
  return (
    <section className="py-12 sm:py-20 lg:py-32 bg-[var(--asphalt-dark)] relative overflow-hidden">
      {/* Background Elements - smaller on mobile */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[600px] h-[200px] md:h-[600px] bg-[var(--safety-orange)]/10 md:bg-[var(--safety-orange)]/5 rounded-full blur-[50px] md:blur-[100px]" />
      </div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--steel-gray)]/20 to-transparent" />

      <Container className="relative z-10">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              className="w-14 h-14 rounded-2xl bg-[var(--safety-orange)] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[var(--safety-orange)]/30"
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready for <span className="text-[var(--safety-orange)]">Clean Bins</span>?
            </h2>
            <p className="text-sm text-[var(--slate-gray)] mb-6 max-w-xs mx-auto">
              Join 500+ happy customers. Get your free quote in 60 seconds.
            </p>

            {/* CTA Card */}
            <div className="bg-[var(--concrete-gray)] rounded-2xl p-5 border border-[var(--steel-gray)]/10 mb-5">
              {/* Buttons */}
              <div className="space-y-3 mb-5">
                <Button className="w-full justify-center" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Get Free Quote
                </Button>
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white border border-[var(--steel-gray)]/30 rounded-xl hover:bg-[var(--steel-gray)]/10 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  {BUSINESS_INFO.phone}
                </a>
              </div>

              {/* Trust badges - horizontal */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-[var(--steel-gray)]/10">
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--slate-gray)]">
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  Free Quote
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--slate-gray)]">
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  No Obligation
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--slate-gray)]">
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  Cancel Anytime
                </div>
              </div>
            </div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-[var(--steel-gray)] border-2 border-[var(--asphalt-dark)] flex items-center justify-center text-[10px] font-bold text-white"
                  >
                    {['JD', 'MK', 'AS', 'TR'][i - 1]}
                  </div>
                ))}
              </div>
              <div className="text-xs text-[var(--slate-gray)]">
                <span className="text-white font-semibold">500+</span> happy customers
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hidden lg:block max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 rounded-3xl bg-[var(--safety-orange)] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[var(--safety-orange)]/30"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready for Clean Bins?
          </h2>
          <p className="text-lg text-[var(--slate-gray)] mb-10 max-w-xl mx-auto">
            Join 500+ happy customers who never worry about dirty, smelly
            trash cans again. Get your free quote in 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Get Free Quote
            </Button>
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white border-2 border-[var(--steel-gray)]/50 rounded-xl hover:bg-[var(--steel-gray)]/20 transition-all"
            >
              <Phone className="w-5 h-5" />
              {BUSINESS_INFO.phone}
            </a>
          </div>

          {/* Trust Row */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[var(--slate-gray)]">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Free Estimates
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              No Obligation
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Cancel Anytime
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

// ============================================
// MAIN EXPORT
// ============================================

export default function ServicesPageContent() {
  return (
    <>
      <HeroSection />
      <BentoServicesSection />
      <TimelineProcessSection />
      <ImpactSection />
      <ServiceAreasSection />
      <FinalCTASection />
    </>
  )
}
