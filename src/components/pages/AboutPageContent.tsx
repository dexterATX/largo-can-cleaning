'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import {
  Users,
  Target,
  Heart,
  Leaf,
  Shield,
  Award,
  MapPin,
  Phone,
  ArrowRight,
  Sparkles,
  Truck,
  ThermometerSun,
  CircleDot,
  Clock,
  CheckCircle2,
  Star,
  Droplets,
  Zap,
  BadgeCheck,
  Quote,
  Home,
  Building2,
  Mail,
  ChevronRight,
  Play,
} from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { BUSINESS_INFO } from '@/lib/schema'
import { cn } from '@/lib/utils'

// ============================================
// DATA - SEO Optimized Content
// ============================================

const stats = [
  { value: '500', suffix: '+', label: 'Happy Customers', icon: Users, color: '#3B82F6' },
  { value: '10', suffix: 'K+', label: 'Bins Cleaned', icon: Sparkles, color: 'var(--safety-orange)' },
  { value: '99.9', suffix: '%', label: 'Bacteria Killed', icon: Shield, color: '#10B981' },
  { value: '5.0', suffix: '', label: 'Google Rating', icon: Star, color: '#FBBF24' },
]

const values = [
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Your satisfaction drives everything we do. We treat every bin like it\'s our own.',
    color: '#EC4899',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'Biodegradable, EPA-approved products safe for your family, pets, and the environment.',
    color: '#10B981',
  },
  {
    icon: Shield,
    title: 'Reliable Service',
    description: 'On time, every time. Consistent quality you can count on week after week.',
    color: '#3B82F6',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Professional-grade equipment and hospital-level sanitization standards.',
    color: '#F59E0B',
  },
]

const milestones = [
  {
    year: '2023',
    title: 'Founded in Seminole',
    desc: 'Started with one truck and a mission to make Pinellas County cleaner.',
    icon: Sparkles,
  },
  {
    year: '2023',
    title: 'Rapid Growth',
    desc: 'Word spread fast—added second cleaning unit within 6 months.',
    icon: Truck,
  },
  {
    year: '2024',
    title: 'County-Wide Service',
    desc: 'Expanded to serve all of Pinellas County and surrounding areas.',
    icon: MapPin,
  },
  {
    year: '2024',
    title: '500+ Customers',
    desc: 'Reached our biggest milestone—500+ families trust us.',
    icon: BadgeCheck,
  },
]

const whyChooseUs = [
  { icon: ThermometerSun, title: '190°F Sanitization', desc: 'Hospital-grade water temperature' },
  { icon: Zap, title: 'Same-Day Service', desc: 'Available when you need us' },
  { icon: Shield, title: 'Licensed & Insured', desc: 'Fully covered for your peace of mind' },
  { icon: Leaf, title: '100% Eco-Safe', desc: 'Green products, zero harsh chemicals' },
  { icon: BadgeCheck, title: 'Satisfaction Guaranteed', desc: 'Not happy? We\'ll re-clean free' },
  { icon: Clock, title: 'Flexible Scheduling', desc: 'Weekly, bi-weekly, or monthly plans' },
]

const testimonials = [
  {
    quote: "CleanCan Pro transformed my disgusting trash cans into sparkling clean bins. The smell is completely gone! I can finally open my garage without holding my breath.",
    author: 'Sarah M.',
    location: 'Seminole, FL',
    rating: 5,
    service: 'Monthly Service',
  },
  {
    quote: "Best service decision I've made for my home. Professional, on-time, and the results speak for themselves. My neighbors have all signed up too!",
    author: 'Michael R.',
    location: 'Largo, FL',
    rating: 5,
    service: 'Bi-Weekly Service',
  },
  {
    quote: "I can't believe I waited so long to try this. As a realtor, curb appeal matters—and clean bins make a difference. Highly recommend!",
    author: 'Jennifer K.',
    location: 'Clearwater, FL',
    rating: 5,
    service: 'One-Time Deep Clean',
  },
]

// ============================================
// ANIMATED COMPONENTS
// ============================================

function AnimatedCounter({ value, suffix }: { value: string; suffix: string }) {
  const [count, setCount] = useState(() => parseFloat(value)) // Start with final value to prevent flash
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const numericValue = parseFloat(value)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true
      setCount(0) // Reset to 0 only after in view
      const duration = 1200 // Faster animation
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = numericValue * eased

        setCount(current)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(numericValue)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [isInView, numericValue])

  return (
    <span ref={ref} className="tabular-nums">
      {value.includes('.') ? count.toFixed(1) : Math.floor(count)}{suffix}
    </span>
  )
}

// ============================================
// HERO SECTION - SEO Optimized
// ============================================

function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center bg-[var(--asphalt-black)] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--asphalt-black)] via-[var(--asphalt-black)] to-[var(--concrete-gray)]/30" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        {/* Hide expensive blur effects on mobile for performance */}
        <div className="hidden md:block absolute top-1/4 -right-20 w-[500px] h-[500px] bg-[var(--safety-orange)]/10 rounded-full blur-[100px]" />
        <div className="hidden md:block absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-[var(--safety-orange)]/5 rounded-full blur-[80px]" />
      </div>

      {/* Accent Lines - hidden on mobile, reduced delays */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-[30%] right-0 w-1/3 h-px bg-gradient-to-l from-[var(--safety-orange)]/40 to-transparent origin-right"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute top-0 right-[20%] w-px h-1/3 bg-gradient-to-b from-[var(--safety-orange)]/30 to-transparent origin-top"
        />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center pt-24 pb-16 sm:pt-32 sm:pb-20">
          {/* Eyebrow Badge - no delay for immediate visibility */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--safety-orange)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--safety-orange)]" />
            </span>
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--safety-orange)]">
              About CleanCan Pro
            </span>
          </motion.div>

          {/* H1 - SEO Optimized */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] mb-5"
          >
            Pinellas County's{' '}
            <span className="relative inline-block">
              <span className="text-[var(--safety-orange)]">Trusted</span>
              <svg
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
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
                />
              </svg>
            </span>
            <br className="hidden sm:block" />
            Trash Can Cleaning Service
          </motion.h1>

          {/* Subheading with local SEO keywords */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-base sm:text-lg text-[var(--slate-gray)] mb-8 max-w-2xl leading-relaxed"
          >
            Family-owned and operated in Seminole, FL. We provide professional trash can
            sanitization services to homes and businesses throughout{' '}
            <span className="text-white">Pinellas County</span>—eliminating 99.9% of bacteria,
            odors, and pests since 2023.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            {[
              { icon: Shield, label: 'Licensed & Insured', color: '#10B981' },
              { icon: Leaf, label: 'Eco-Friendly', color: '#22C55E' },
              { icon: Star, label: '5.0 Google Rating', color: '#FBBF24' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--concrete-gray)]/60 border border-[var(--steel-gray)]/30"
              >
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
                <span className="text-xs font-medium text-[var(--light-gray)]">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Get Free Quote
            </Button>
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-[var(--light-gray)] hover:text-white border border-[var(--steel-gray)]/30 hover:border-[var(--steel-gray)]/50 rounded-lg transition-all"
            >
              <Phone className="w-4 h-4" />
              {BUSINESS_INFO.phone}
            </a>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="w-full max-w-3xl"
          >
            {/* Mobile: 2x2 Grid */}
            <div className="sm:hidden grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="p-4 rounded-xl bg-[var(--concrete-gray)]/40 border border-[var(--steel-gray)]/20 text-center"
                >
                  <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[11px] text-[var(--slate-gray)]">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Desktop: Horizontal Row */}
            <div className="hidden sm:flex items-center justify-between p-6 rounded-2xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20">
              {stats.map((stat, index) => (
                <div key={index} className="text-center px-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    <span className="text-3xl font-bold text-white">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </span>
                  </div>
                  <span className="text-sm text-[var(--slate-gray)]">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="hidden sm:block absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-[var(--steel-gray)]/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-[var(--safety-orange)]"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ============================================
// MISSION SECTION
// ============================================

function MissionSection() {
  return (
    <section className="py-12 sm:py-20 bg-[var(--asphalt-dark)] relative overflow-hidden">
      {/* Hide expensive blur on mobile */}
      <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--safety-orange)]/5 rounded-full blur-[100px]" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Mission Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20">
            <Target className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--safety-orange)]">Our Mission</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
            Making Pinellas County{' '}
            <span className="text-[var(--safety-orange)]">Cleaner & Healthier</span>,
            One Bin at a Time
          </h2>

          <p className="text-[var(--slate-gray)] leading-relaxed mb-8">
            Trash cans are breeding grounds for harmful bacteria, pests, and odors—yet they're
            often the most neglected items at home. We're here to change that. Using
            professional-grade equipment and eco-friendly products, we eliminate 99.9% of
            germs while keeping your family and the environment safe.
          </p>

          {/* Quick Facts */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {[
              { label: 'Family-Owned', icon: Home },
              { label: 'Locally Operated', icon: MapPin },
              { label: 'Since 2023', icon: Clock },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[var(--light-gray)]">
                <item.icon className="w-4 h-4 text-[var(--safety-orange)]" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

// ============================================
// STORY SECTION - SEO Rich Content
// ============================================

function StorySection() {
  return (
    <section className="py-12 sm:py-20 bg-[var(--asphalt-black)] relative overflow-hidden">
      {/* Hide expensive blur on mobile */}
      <div className="hidden md:block absolute top-1/2 -left-[200px] w-[400px] h-[400px] bg-[var(--safety-orange)]/5 rounded-full blur-[80px] -translate-y-1/2" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Story Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20">
              <CircleDot className="w-3 h-3 text-[var(--safety-orange)]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--safety-orange)]">Our Story</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
              From a Simple Idea to{' '}
              <span className="text-[var(--safety-orange)]">500+ Happy Customers</span>
            </h2>

            <div className="space-y-4 text-[var(--slate-gray)] leading-relaxed">
              <p>
                It started with a simple observation: <span className="text-white">trash cans are
                one of the dirtiest, most neglected items at every home</span>. The smell, the
                bacteria, the pests—nobody was talking about it.
              </p>
              <p>
                After researching the health hazards that breed in uncleaned bins, we knew
                there had to be a better way. So we invested in professional-grade equipment
                delivering <span className="text-[var(--safety-orange)]">190°F high-pressure
                sanitization</span>—the same technology used by hospitals.
              </p>
              <p>
                Today, we proudly serve over 500 families across Pinellas County. But we're
                still the same local, family-owned business—your neighbors committed to
                keeping our community clean and healthy.
              </p>
            </div>

            <div className="mt-8">
              <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Our Services
              </Button>
            </div>
          </motion.div>

          {/* Right: Quote Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              {/* Reduce blur-xl to blur-lg for better performance */}
              <div className="hidden md:block absolute -inset-3 bg-gradient-to-br from-[var(--safety-orange)]/20 to-transparent rounded-3xl blur-lg opacity-50" />
              <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[var(--concrete-gray)]/50 to-[var(--concrete-gray)]/20 border border-[var(--steel-gray)]/20">
                <Quote className="w-10 h-10 text-[var(--safety-orange)]/30 mb-4" />
                <blockquote className="text-lg sm:text-xl text-white font-medium leading-relaxed mb-6">
                  "We believe every family deserves a cleaner, healthier outdoor environment.
                  That's not just our mission—it's our promise to Pinellas County."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--safety-orange)] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">CP</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">CleanCan Pro Team</p>
                    <p className="text-sm text-[var(--slate-gray)]">Founders, Seminole FL</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

// ============================================
// WHY CHOOSE US SECTION
// ============================================

function WhyChooseUsSection() {
  return (
    <section className="py-12 sm:py-20 bg-[var(--asphalt-dark)]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20">
            <BadgeCheck className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--safety-orange)]">Why Choose Us</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
            The CleanCan Pro Difference
          </h2>
          <p className="text-[var(--slate-gray)] max-w-lg mx-auto">
            Professional service, local care, guaranteed results.
          </p>
        </motion.div>

        {/* Mobile: 2 Column Grid */}
        <div className="sm:hidden grid grid-cols-2 gap-3">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--safety-orange)]/10 flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-[var(--safety-orange)]" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-[11px] text-[var(--slate-gray)]">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Desktop: 3 Column Grid */}
        <div className="hidden sm:grid grid-cols-3 gap-4">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group p-5 rounded-xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 hover:border-[var(--safety-orange)]/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--safety-orange)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-[var(--safety-orange)]" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1 group-hover:text-[var(--safety-orange)] transition-colors">{item.title}</h3>
              <p className="text-sm text-[var(--slate-gray)]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

// ============================================
// VALUES SECTION
// ============================================

function ValuesSection() {
  return (
    <section className="py-12 sm:py-20 bg-[var(--asphalt-black)]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20">
            <Heart className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--safety-orange)]">Our Values</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
            What Drives Us Every Day
          </h2>
          <p className="text-[var(--slate-gray)] max-w-lg mx-auto">
            These principles guide everything we do.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-4 sm:p-5 rounded-xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 hover:border-[var(--steel-gray)]/40 transition-all"
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${value.color}15` }}
              >
                <value.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: value.color }} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white mb-1 sm:mb-2">{value.title}</h3>
              <p className="text-[11px] sm:text-sm text-[var(--slate-gray)] leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

// ============================================
// TIMELINE SECTION
// ============================================

function TimelineSection() {
  return (
    <section className="py-12 sm:py-20 bg-[var(--asphalt-dark)] relative overflow-hidden">
      {/* Hide expensive blur on mobile */}
      <div className="hidden md:block absolute top-1/2 -right-[200px] w-[400px] h-[400px] bg-[var(--safety-orange)]/5 rounded-full blur-[80px] -translate-y-1/2" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
            Our Journey
          </h2>
          <p className="text-[var(--slate-gray)]">
            From one truck to county-wide service.
          </p>
        </motion.div>

        {/* Mobile Timeline */}
        <div className="sm:hidden relative">
          <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-gradient-to-b from-[var(--safety-orange)] via-[var(--safety-orange)]/50 to-transparent" />

          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-4 pl-2"
              >
                <div className="relative z-10 w-7 h-7 rounded-full bg-[var(--safety-orange)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[var(--safety-orange)]/30">
                  <milestone.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 pb-2">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-[var(--safety-orange)] bg-[var(--safety-orange)]/10 rounded mb-1">
                    {milestone.year}
                  </span>
                  <h3 className="text-base font-semibold text-white">{milestone.title}</h3>
                  <p className="text-sm text-[var(--slate-gray)]">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden sm:block relative max-w-4xl mx-auto">
          <div className="absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--safety-orange)]/40 to-transparent" />

          <div className="grid grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pt-16 text-center"
              >
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--asphalt-dark)] border-2 border-[var(--safety-orange)] flex items-center justify-center z-10">
                  <milestone.icon className="w-4 h-4 text-[var(--safety-orange)]" />
                </div>
                <span className="inline-block px-2 py-1 text-[10px] font-bold text-[var(--safety-orange)] bg-[var(--safety-orange)]/10 rounded-md mb-2">
                  {milestone.year}
                </span>
                <h3 className="text-base font-semibold text-white mb-1">{milestone.title}</h3>
                <p className="text-sm text-[var(--slate-gray)]">{milestone.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

// ============================================
// TESTIMONIALS SECTION
// ============================================

function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-20 bg-[var(--asphalt-black)]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20">
            <Star className="w-3.5 h-3.5 text-[var(--safety-orange)] fill-[var(--safety-orange)]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--safety-orange)]">Testimonials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
            What Pinellas County Says
          </h2>
          <p className="text-[var(--slate-gray)]">
            Real reviews from real customers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[var(--safety-orange)] fill-[var(--safety-orange)]" />
                ))}
              </div>

              <p className="text-sm text-[var(--light-gray)] leading-relaxed mb-4">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[var(--safety-orange)]/10 flex items-center justify-center">
                    <span className="text-[var(--safety-orange)] font-semibold text-xs">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{testimonial.author}</p>
                    <p className="text-[11px] text-[var(--slate-gray)]">{testimonial.location}</p>
                  </div>
                </div>
                <span className="text-[10px] text-[var(--slate-gray)] bg-[var(--steel-gray)]/20 px-2 py-1 rounded">
                  {testimonial.service}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

// ============================================
// SERVICE AREAS SECTION - Local SEO
// ============================================

function ServiceAreasSection() {
  return (
    <section className="py-12 sm:py-16 bg-[var(--asphalt-dark)]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20">
            <MapPin className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--safety-orange)]">Service Areas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Proudly Serving Pinellas County, Florida
          </h2>
          <p className="text-[var(--slate-gray)] max-w-lg mx-auto">
            Professional trash can cleaning services for residential and commercial customers.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-2xl mx-auto">
          {BUSINESS_INFO.areaServed.map((area, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 text-sm font-medium text-[var(--light-gray)] hover:border-[var(--safety-orange)]/30 hover:text-white transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
              {area}, FL
            </motion.span>
          ))}
        </div>

        {/* Contact Info - NAP for SEO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 p-5 rounded-xl bg-[var(--concrete-gray)]/20 border border-[var(--steel-gray)]/20 max-w-md mx-auto"
        >
          <h3 className="text-sm font-semibold text-white mb-3 text-center">Contact Information</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm text-[var(--slate-gray)]">
              <MapPin className="w-4 h-4 text-[var(--safety-orange)]" />
              <span>{BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.state} {BUSINESS_INFO.address.zip}</span>
            </div>
            <a href={`tel:${BUSINESS_INFO.phone}`} className="flex items-center gap-3 text-sm text-[var(--slate-gray)] hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-[var(--safety-orange)]" />
              <span>{BUSINESS_INFO.phone}</span>
            </a>
            <a href={`mailto:${BUSINESS_INFO.email}`} className="flex items-center gap-3 text-sm text-[var(--slate-gray)] hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-[var(--safety-orange)]" />
              <span>{BUSINESS_INFO.email}</span>
            </a>
            <div className="flex items-center gap-3 text-sm text-[var(--slate-gray)]">
              <Clock className="w-4 h-4 text-[var(--safety-orange)]" />
              <span>Mon-Fri 8AM-6PM, Sat 9AM-2PM</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

// ============================================
// CTA SECTION
// ============================================

function CTASection() {
  return (
    <section className="py-12 sm:py-20 bg-[var(--asphalt-black)] relative overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--safety-orange)]/40 to-transparent" />

      {/* Hide expensive blurs on mobile */}
      <div className="hidden md:block absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--safety-orange)]/5 rounded-full blur-[100px]" />
      <div className="hidden md:block absolute bottom-0 left-0 w-[300px] h-[300px] bg-[var(--safety-orange)]/5 rounded-full blur-[80px]" />

      <Container className="relative z-10">
        {/* Mobile CTA */}
        <div className="sm:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden border border-[var(--safety-orange)]/30 shadow-lg shadow-[var(--safety-orange)]/10"
          >
            {/* Top glow bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--safety-orange)] to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--safety-orange)]/10 via-transparent to-[var(--safety-orange)]/5 rounded-2xl" />
            <div className="relative p-6 bg-[var(--asphalt-black)]/95">
              <div className="w-14 h-14 rounded-xl bg-[var(--safety-orange)] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[var(--safety-orange)]/30">
                <Sparkles className="w-7 h-7 text-white" />
              </div>

              <h2 className="text-xl font-bold text-white text-center mb-2">
                Ready for Clean Bins?
              </h2>
              <p className="text-sm text-[var(--slate-gray)] text-center mb-6">
                Join 500+ happy families in Pinellas County
              </p>

              <div className="space-y-3">
                <Button className="w-full" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Get Free Quote
                </Button>
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white bg-[var(--concrete-gray)] rounded-xl"
                >
                  <Phone className="w-4 h-4" />
                  Call {BUSINESS_INFO.phone}
                </a>
              </div>

              <p className="text-center text-[10px] text-[var(--slate-gray)] mt-4">
                Free estimates · No contracts · Same-day available
              </p>
            </div>
          </motion.div>
        </div>

        {/* Desktop CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hidden sm:block"
        >
          <div className="relative rounded-3xl overflow-hidden border border-[var(--safety-orange)]/30 shadow-xl shadow-[var(--safety-orange)]/10">
            {/* Top glow bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--safety-orange)] to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--safety-orange)]/10 via-transparent to-[var(--safety-orange)]/10 rounded-3xl" />
            <div className="relative p-10 bg-gradient-to-br from-[var(--asphalt-black)] to-[var(--concrete-gray)]/20">
              <div className="flex items-center justify-between gap-10">
                <div className="flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--safety-orange)] flex items-center justify-center mb-5 shadow-lg shadow-[var(--safety-orange)]/30">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                    Ready to Experience the CleanCan Pro Difference?
                  </h2>
                  <p className="text-base text-[var(--slate-gray)] mb-6 max-w-lg">
                    Join over 500 satisfied customers in Pinellas County. Get your free quote
                    today and see why families trust us with their bin cleaning.
                  </p>
                  <div className="flex items-center gap-4">
                    {[
                      { icon: CheckCircle2, text: 'Free Estimates' },
                      { icon: CheckCircle2, text: 'No Contracts' },
                      { icon: CheckCircle2, text: 'Same-Day Service' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-[var(--slate-gray)]">
                        <item.icon className="w-4 h-4 text-[var(--success)]" />
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="p-6 rounded-2xl bg-[var(--asphalt-black)]/50 border border-[var(--steel-gray)]/20">
                    <p className="text-xs text-[var(--slate-gray)] uppercase tracking-wide mb-1 text-center">Starting at</p>
                    <div className="flex items-baseline justify-center gap-1 mb-4">
                      <span className="text-4xl font-bold text-white">$22</span>
                      <span className="text-sm text-[var(--slate-gray)]">/can/mo</span>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                        Get Free Quote
                      </Button>
                      <a
                        href={`tel:${BUSINESS_INFO.phone}`}
                        className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-[var(--light-gray)] hover:text-white transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {BUSINESS_INFO.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function AboutPageContent() {
  return (
    <div className="relative bg-[var(--asphalt-black)]">
      <HeroSection />
      <MissionSection />
      <StorySection />
      <WhyChooseUsSection />
      <ValuesSection />
      <TimelineSection />
      <TestimonialsSection />
      <ServiceAreasSection />
      <CTASection />
    </div>
  )
}
