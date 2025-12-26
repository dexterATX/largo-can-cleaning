'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { CalendarCheck, Truck, Droplets, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import { useIsMobile } from '@/hooks/useReducedMotion'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/motion-primitives/carousel'

const steps = [
  {
    icon: CalendarCheck,
    step: '01',
    title: 'Schedule Service',
    description:
      'Pick a date and time that works for you. Same-day and next-day appointments available.',
    img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=90&w=800&auto=format&fit=crop',
  },
  {
    icon: Truck,
    step: '02',
    title: 'We Arrive',
    description:
      'Our team arrives at your location with our mobile cleaning unit. No water or power hookup needed.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=90&w=800&auto=format&fit=crop',
  },
  {
    icon: Droplets,
    step: '03',
    title: 'Deep Clean',
    description:
      '190°F high-pressure wash eliminates 99.9% of bacteria, grease, and odors in minutes.',
    img: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?q=90&w=800&auto=format&fit=crop',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Sparkling Results',
    description:
      'Your bins are returned clean, sanitized, and deodorized. We dispose of all wastewater...',
    img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=90&w=800&auto=format&fit=crop',
  },
]

const stats = [
  { value: '3-5', label: 'Minutes per can' },
  { value: '190°F', label: 'Water temperature' },
  { value: '99.9%', label: 'Bacteria eliminated' },
  { value: '100%', label: 'Eco-friendly' },
]

function ProcessCarousel() {
  const [index, setIndex] = useState(0)
  const isMobile = useIsMobile()

  return (
    <div className="relative">
      <Carousel index={index} onIndexChange={setIndex}>
        <CarouselContent className="-ml-4">
          {steps.map((step, idx) => (
            <CarouselItem
              key={idx}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4"
            >
              <ProcessCard step={step} index={idx} isMobile={isMobile} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Mobile Navigation - Below Cards */}
      <div className="flex items-center justify-center gap-4 mt-6 sm:hidden">
        <button
          type="button"
          aria-label="Previous step"
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="w-12 h-12 rounded-full bg-[var(--concrete-gray)] border border-[var(--steel-gray)]/30 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--steel-gray)] active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="flex items-center gap-2">
          {steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to step ${idx + 1}`}
              onClick={() => setIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--asphalt-black)] ${
                index === idx
                  ? 'bg-[var(--safety-orange)] w-6'
                  : 'bg-[var(--steel-gray)]'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next step"
          onClick={() => setIndex(Math.min(steps.length - 1, index + 1))}
          disabled={index === steps.length - 1}
          className="w-12 h-12 rounded-full bg-[var(--concrete-gray)] border border-[var(--steel-gray)]/30 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--steel-gray)] active:scale-95"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  )
}

function ProcessCard({ step, index, isMobile }: { step: typeof steps[0]; index: number; isMobile: boolean }) {
  return (
    <motion.article
      initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: isMobile ? 0.3 : 0.5, delay: isMobile ? 0 : index * 0.1 }}
      className="relative h-[400px] sm:h-[420px] rounded-2xl overflow-hidden group will-change-transform"
    >
      {/* Background Image */}
      <div className="absolute inset-0 sm:transition-transform sm:duration-500 sm:group-hover:scale-105">
        <Image
          src={step.img}
          alt={step.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
        />
      </div>

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

      {/* Step Number - Top Right - No backdrop-blur on mobile */}
      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[var(--steel-gray)]/90 md:bg-[var(--steel-gray)]/80 md:backdrop-blur-sm flex items-center justify-center">
        <span className="text-lg font-bold text-white">{step.step}</span>
      </div>

      {/* Content - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-[var(--safety-orange)] flex items-center justify-center mb-3">
          <step.icon className="w-6 h-6 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>

        {/* Description Box - No backdrop-blur on mobile */}
        <div className="bg-[var(--steel-gray)]/80 md:bg-[var(--steel-gray)]/60 md:backdrop-blur-sm rounded-xl p-3">
          <p className="text-sm text-gray-300 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

export default function Process() {
  return (
    <section
      className="py-16 sm:py-24 bg-[var(--asphalt-black)] relative overflow-hidden"
      aria-labelledby="process-heading"
    >
      {/* Decorative Elements - Hidden on mobile, reduced blur for performance */}
      <div className="hidden md:block absolute top-1/2 left-0 w-1/3 h-1/2 bg-[var(--safety-orange)]/5 blur-[60px] -translate-y-1/2" />
      <div className="hidden md:block absolute top-1/2 right-0 w-1/3 h-1/2 bg-[var(--safety-orange)]/5 blur-[60px] -translate-y-1/2" />

      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--safety-orange)] bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20 rounded-full">
            How It Works
          </span>
          <h2
            id="process-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Simple 4-Step Process
          </h2>
          <p className="text-[var(--slate-gray)] max-w-2xl mx-auto">
            We handle everything from start to finish. You never have to touch
            your dirty bins.
          </p>
        </motion.div>

        {/* Carousel */}
        <ProcessCarousel />

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[var(--concrete-gray)] to-[var(--asphalt-dark)] border border-[var(--steel-gray)]/30"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--safety-orange)] mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-[var(--slate-gray)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
