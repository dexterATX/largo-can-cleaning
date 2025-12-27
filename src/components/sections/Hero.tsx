'use client'

import { useRef, useEffect, useState, memo, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Sparkles, Shield, Droplets, CheckCircle2 } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

// Animated water droplet particle component - memoized to prevent unnecessary re-renders
const WaterParticle = memo(function WaterParticle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-[var(--safety-orange)]/20 will-change-transform"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: '-10%',
      }}
      initial={{ y: '-10vh', opacity: 0 }}
      animate={{
        y: '110vh',
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        delay: delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
})

// Generate particles arrays - full for desktop, reduced for mobile
const desktopParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  delay: Math.random() * 3,
  x: Math.random() * 100,
  size: 4 + Math.random() * 8,
}))

const mobileParticles = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  delay: Math.random() * 2,
  x: Math.random() * 100,
  size: 4 + Math.random() * 6,
}))

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile on client side only to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Select particles based on device - fewer particles on mobile for performance
  const particles = useMemo(() => {
    return isMobile ? mobileParticles : desktopParticles
  }, [isMobile])

  // Memoize heroFeatures to prevent recreation on each render
  const heroFeatures = useMemo(() => [
    { icon: Shield, text: '99.9% Bacteria Eliminated' },
    { icon: Droplets, text: 'Eco-Friendly Solutions' },
    { icon: Sparkles, text: 'Same-Day Service Available' },
  ], [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax effect - content moves up and fades as you scroll
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-gradient-dark"
      aria-labelledby="hero-heading"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" aria-hidden="true" />

      {/* Animated Particles - Only render on client */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {particles.map((particle) => (
            <WaterParticle
              key={particle.id}
              delay={particle.delay}
              x={particle.x}
              size={particle.size}
            />
          ))}
        </div>
      )}

      {/* Gradient Orbs - Hidden on mobile, reduced blur for performance */}
      <div className="hidden md:block absolute top-1/4 -left-32 w-96 h-96 bg-[var(--safety-orange)]/10 rounded-full blur-[60px]" aria-hidden="true" />
      <div className="hidden md:block absolute bottom-1/4 -right-32 w-96 h-96 bg-[var(--safety-orange)]/5 rounded-full blur-[60px]" aria-hidden="true" />

      {/* Content */}
      <Container className="relative z-10 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <motion.div
          style={{ y, opacity }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--safety-orange)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--safety-orange)]" />
            </span>
            <span className="text-xs sm:text-sm font-medium text-[var(--safety-orange)]">
              Serving Seminole, FL & Pinellas County
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">Professional </span>
            <span className="text-gradient-orange">Trash Can</span>
            <br />
            <span className="text-white">Cleaning Service</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[var(--light-gray)] max-w-2xl mx-auto mb-8"
          >
            Eliminate bacteria, odors, and pests with our industrial-grade
            pressure washing system. Never touch a dirty bin again.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {heroFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[var(--concrete-gray)]/50 border border-[var(--steel-gray)]/30"
              >
                <feature.icon className="w-4 h-4 text-[var(--safety-orange)]" />
                <span className="text-xs sm:text-sm text-[var(--light-gray)]">
                  {feature.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Get Free Quote
            </Button>
            <Button variant="outline" size="lg">
              View Pricing
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-[var(--steel-gray)]/20"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2 text-sm text-[var(--slate-gray)]">
                <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--slate-gray)]">
                <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                <span>100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--slate-gray)]">
                <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                <span>500+ Happy Customers</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--asphalt-dark)] to-transparent" />

      {/* Scroll Indicator - Hidden on mobile for performance */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.5 }}
        className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-[var(--steel-gray)] flex items-start justify-center p-2 animate-bounce">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--safety-orange)]" />
        </div>
      </motion.div>
    </section>
  )
}

// Wrap Hero with React.memo to prevent unnecessary re-renders
export default memo(Hero)
