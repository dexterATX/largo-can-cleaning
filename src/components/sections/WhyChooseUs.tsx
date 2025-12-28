'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ThermometerSun, Leaf, ShieldCheck, Users, Award, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import Container from '@/components/ui/Container'

const reasons = [
  {
    icon: ThermometerSun,
    title: '190°F Pressure Wash',
    description: 'Our truck-mounted system uses 190-degree water that kills bacteria, dissolves grease, and eliminates odors that cold water simply cannot remove.',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Process',
    description: 'We use biodegradable, plant-based cleaning solutions safe for your family, pets, and landscaping. All wastewater is captured and disposed of properly.',
  },
  {
    icon: ShieldCheck,
    title: 'Licensed & Insured',
    description: 'Fully licensed business with comprehensive liability coverage. Our uniformed technicians are background-checked for your peace of mind.',
  },
  {
    icon: Users,
    title: 'Locally Owned',
    description: 'We are Pinellas County residents serving our neighbors. When you call, you speak directly with the owner who cares about your satisfaction.',
  },
  {
    icon: Award,
    title: 'Satisfaction Guaranteed',
    description: 'Not completely happy with our service? We will re-clean your bins for free or provide a full refund. Your satisfaction is our top priority.',
  },
  {
    icon: Clock,
    title: 'Convenient Scheduling',
    description: 'We clean right after your scheduled trash pickup so you never have to move your bins. Same-day and next-day appointments available.',
  },
]

// Mobile Slider Component
function MobileSlider() {
  const [activeIndex, setActiveIndex] = useState(0)

  const goTo = (index: number) => {
    if (index >= 0 && index < reasons.length) {
      setActiveIndex(index)
    }
  }

  const reason = reasons[activeIndex]

  return (
    <div className="sm:hidden">
      {/* Card */}
      <div className="relative overflow-hidden">
        <article className="p-5 rounded-2xl bg-gradient-to-br from-[var(--concrete-gray)] to-[var(--asphalt-dark)] border border-[var(--steel-gray)]/30 min-h-[160px]">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--safety-orange)]/10 flex items-center justify-center flex-shrink-0">
              <reason.icon className="w-6 h-6 text-[var(--safety-orange)]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {reason.title}
            </h3>
          </div>
          <p className="text-sm text-[var(--slate-gray)] leading-relaxed">
            {reason.description}
          </p>
        </article>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="w-10 h-10 rounded-full bg-[var(--concrete-gray)] border border-[var(--steel-gray)]/30 flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {reasons.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => goTo(idx)}
              className={`h-2 rounded-full transition-all duration-200 ${
                activeIndex === idx
                  ? 'bg-[var(--safety-orange)] w-6'
                  : 'bg-[var(--steel-gray)] w-2'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === reasons.length - 1}
          className="w-10 h-10 rounded-full bg-[var(--concrete-gray)] border border-[var(--steel-gray)]/30 flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Counter */}
      <p className="text-center text-xs text-[var(--slate-gray)] mt-3">
        {activeIndex + 1} of {reasons.length}
      </p>
    </div>
  )
}

export default function WhyChooseUs() {
  return (
    <section
      className="pt-16 sm:pt-24 bg-[var(--asphalt-black)] relative overflow-hidden"
      aria-labelledby="why-choose-heading"
    >
      {/* Background Elements - pointer-events-none so they don't block clicks */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--safety-orange)]/20 to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--safety-orange)]/20 to-transparent pointer-events-none" aria-hidden="true" />

      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--safety-orange)] bg-[var(--safety-orange)]/10 rounded-full">
            Why Choose Us
          </span>
          <h2
            id="why-choose-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Largo&apos;s Trusted Bin Cleaning Experts
          </h2>
          <p className="text-[var(--slate-gray)] max-w-2xl mx-auto text-sm sm:text-base">
            We combine industrial-grade equipment with eco-friendly practices to deliver the cleanest, most hygienic results for homes and businesses across Pinellas County.
          </p>
        </motion.div>

        {/* Mobile: Slider */}
        <MobileSlider />

        {/* Desktop: 2 Column Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-[var(--concrete-gray)] to-[var(--asphalt-dark)] border border-[var(--steel-gray)]/30 hover:border-[var(--safety-orange)]/30 transition-colors"
            >
              <div className="w-12 h-12 mb-4 rounded-xl bg-[var(--safety-orange)]/10 flex items-center justify-center">
                <reason.icon className="w-6 h-6 text-[var(--safety-orange)]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {reason.title}
              </h3>
              <p className="text-sm text-[var(--slate-gray)] leading-relaxed">
                {reason.description}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Service Area Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 p-6 sm:p-8 rounded-2xl bg-[var(--safety-orange)]/5 border border-[var(--safety-orange)]/20 text-center"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
            Proudly Serving All of Pinellas County
          </h3>
          <p className="text-[var(--slate-gray)] max-w-3xl mx-auto">
            Our mobile cleaning trucks service Largo, Seminole, Clearwater, Pinellas Park, Safety Harbor, Dunedin, Palm Harbor, Belleair, and surrounding areas. Whether you are a homeowner dealing with smelly garage bins or a property manager overseeing multiple units, we bring professional sanitization directly to your curb.
          </p>
        </motion.div>
      </Container>

      {/* Bottom Divider - Centered between sections */}
      <div className="w-full py-10 sm:py-12 flex items-center justify-center" aria-hidden="true">
        <div className="w-64 sm:w-80 h-px bg-gradient-to-r from-transparent via-[var(--safety-orange)]/60 to-transparent" />
      </div>
    </section>
  )
}
