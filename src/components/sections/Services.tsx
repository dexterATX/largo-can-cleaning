'use client'

import { useEffect, useRef, useState, memo, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'motion/react'
import { Home, Building2, CalendarClock, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

const services = [
  {
    icon: Home,
    title: 'Residential Cleaning',
    description:
      'Keep your home bins sanitized and odor-free. Perfect for families who want a healthier outdoor environment.',
    features: ['Single or multiple cans', 'Driveway-safe cleaning', 'Eco-friendly products'],
    price: 'From $25',
    popular: false,
  },
  {
    icon: Building2,
    title: 'Commercial Service',
    description:
      'Professional-grade cleaning for businesses, restaurants, and property managers. Volume discounts available.',
    features: ['Bulk pricing', 'Scheduled pickups', 'Invoice billing'],
    price: 'Custom Quote',
    popular: false,
  },
  {
    icon: CalendarClock,
    title: 'Recurring Service',
    description:
      'Set it and forget it. We automatically clean your bins on a schedule that works for you.',
    features: ['Weekly, Bi-weekly, Monthly', 'Priority scheduling', '10% discount'],
    price: 'From $22',
    popular: true,
  },
  {
    icon: Sparkles,
    title: 'Deep Clean',
    description:
      'Our most thorough service. Industrial degreasing, sanitization, and protective coating application.',
    features: ['Interior & exterior', 'Deodorizer treatment', 'Protective coating'],
    price: '$77',
    popular: false,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

// Memoized ServiceCard to prevent unnecessary re-renders when parent re-renders
const ServiceCard = memo(function ServiceCard({ service }: { service: typeof services[0] }) {
  return (
    <article
      className={`relative group p-6 rounded-2xl bg-gradient-card border transition-[transform,border-color] duration-300 hover:-translate-y-1 h-full ${
        service.popular
          ? 'border-[var(--safety-orange)]/50 hover:border-[var(--safety-orange)]'
          : 'border-[var(--steel-gray)]/30 hover:border-[var(--steel-gray)]'
      }`}
    >
      {/* Popular Badge */}
      {service.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--safety-orange)] rounded-full whitespace-nowrap">
            Most Popular
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="w-12 h-12 mb-4 rounded-xl bg-[var(--safety-orange)]/10 flex items-center justify-center group-hover:bg-[var(--safety-orange)]/20 transition-colors">
        <service.icon className="w-6 h-6 text-[var(--safety-orange)]" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-white mb-2">
        {service.title}
      </h3>
      <p className="text-sm text-[var(--slate-gray)] mb-4 line-clamp-3">
        {service.description}
      </p>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        {service.features.map((feature, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-xs text-[var(--light-gray)]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--safety-orange)]" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Price & CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--steel-gray)]/20">
        <span className="text-lg font-bold text-[var(--safety-orange)]">
          {service.price}
        </span>
        <button
          className="flex items-center gap-1 text-sm font-medium text-[var(--light-gray)] hover:text-[var(--safety-orange)] transition-colors"
          aria-label={`Learn more about ${service.title}`}
        >
          Learn more
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  )
})

// Memoized MobileCarousel with smooth spring physics
const MobileCarousel = memo(function MobileCarousel() {
  const [maxDrag, setMaxDrag] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)

  // Use motion value for smooth position tracking
  const x = useMotionValue(0)

  // Responsive spring - tighter control
  const smoothX = useSpring(x, {
    stiffness: 300,   // Higher = snappier response
    damping: 35,      // Higher = stops faster
    mass: 0.8,        // Slightly heavier = less floaty
  })

  // Calculate max drag distance
  const calculateWidth = useCallback(() => {
    if (carousel.current) {
      setMaxDrag(carousel.current.scrollWidth - carousel.current.offsetWidth)
    }
  }, [])

  useEffect(() => {
    calculateWidth()

    let timeoutId: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(calculateWidth, 150)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [calculateWidth])

  // Handle drag end with minimal momentum
  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const currentX = x.get()
    const velocity = info.velocity.x

    // Minimal momentum - stops quickly
    const momentum = velocity * 0.08
    let targetX = currentX + momentum

    // Clamp to boundaries
    targetX = Math.max(-maxDrag, Math.min(0, targetX))

    x.set(targetX)
  }, [x, maxDrag])

  return (
    <div className="w-full overflow-hidden sm:hidden touch-pan-y">
      <motion.div
        ref={carousel}
        style={{ x: smoothX }}
        drag="x"
        dragDirectionLock
        dragElastic={0.05}
        dragConstraints={{ right: 0, left: -maxDrag }}
        dragTransition={{
          power: 0.1,           // Low power = stops quickly
          timeConstant: 100,    // Short = fast stop
          bounceDamping: 40,    // High = minimal bounce
          bounceStiffness: 200, // Firm edges
        }}
        onDragEnd={handleDragEnd}
        className="flex cursor-grab active:cursor-grabbing"
      >
        {services.map((service, index) => (
          <div key={index} className="min-w-[85vw] max-w-[85vw] p-2 flex-shrink-0">
            <ServiceCard service={service} />
          </div>
        ))}
      </motion.div>
      <div className="flex items-center justify-center gap-2 mt-4">
        <motion.div
          animate={{ x: [0, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronLeft className="w-4 h-4 text-[var(--slate-gray)]" />
        </motion.div>
        <span className="text-xs text-[var(--slate-gray)]">
          Swipe to see more services
        </span>
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronRight className="w-4 h-4 text-[var(--slate-gray)]" />
        </motion.div>
      </div>
    </div>
  )
})

export default function Services() {
  return (
    <section
      className="py-16 sm:py-24 bg-[var(--asphalt-dark)] relative overflow-hidden"
      aria-labelledby="services-heading"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--safety-orange)]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--safety-orange)]/20 to-transparent" />

      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--safety-orange)] bg-[var(--safety-orange)]/10 rounded-full">
            Our Services
          </span>
          <h2
            id="services-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Professional Cleaning Solutions
          </h2>
          <p className="text-[var(--slate-gray)] max-w-2xl mx-auto">
            From one-time deep cleans to recurring maintenance plans, we have
            the right service for your needs.
          </p>
        </motion.div>

        {/* Mobile: Drag Carousel */}
        <MobileCarousel />

        {/* Desktop: Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-[var(--slate-gray)] mb-4">
            Not sure which service is right for you?
          </p>
          <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Compare All Services
          </Button>
        </motion.div>
      </Container>
    </section>
  )
}
