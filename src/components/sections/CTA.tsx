'use client'

import { motion } from 'motion/react'
import { Phone, ArrowRight, Calendar, Clock, Shield, FileCheck } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { BUSINESS_INFO } from '@/lib/schema'

export default function CTA() {
  return (
    <section
      className="py-5 sm:py-24 bg-[var(--asphalt-dark)] relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background Elements - Blur elements hidden on mobile for performance */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="hidden md:block absolute top-0 left-1/4 w-96 h-96 bg-[var(--safety-orange)]/5 rounded-full blur-[60px]" />
      <div className="hidden md:block absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--safety-orange)]/5 rounded-full blur-[60px]" />

      <Container className="relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl sm:rounded-3xl border border-[var(--steel-gray)]/30 bg-gradient-to-br from-[var(--concrete-gray)] to-[var(--asphalt-black)] p-5 sm:p-12 overflow-hidden"
          >
            {/* Accent Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--safety-orange)] to-transparent" />

            {/* Glow Effect - Hidden on mobile */}
            <div className="hidden sm:block absolute -top-20 -right-20 w-40 h-40 bg-[var(--safety-orange)]/10 rounded-full blur-2xl" />

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
              {/* Left Content */}
              <div className="text-center sm:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20">
                  <Calendar className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                  <span className="text-xs font-medium text-[var(--safety-orange)]">
                    Limited Slots This Week
                  </span>
                </div>

                {/* Heading */}
                <h2
                  id="cta-heading"
                  className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-3"
                >
                  Ready for Sparkling Clean Bins?
                </h2>

                {/* Description */}
                <p className="text-sm sm:text-base text-[var(--slate-gray)] mb-5 sm:mb-8 leading-relaxed">
                  Join over 500 happy customers in Seminole. Get your free quote today.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5 sm:mb-8">
                  <Button
                    size="lg"
                    rightIcon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                    className="text-sm sm:text-base"
                  >
                    Get Free Quote
                  </Button>
                  <a
                    href={`tel:${BUSINESS_INFO.phone}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white border border-[var(--steel-gray)]/50 rounded-xl hover:bg-[var(--steel-gray)]/20 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
              </div>

              {/* Right Content - Trust Features */}
              {/* Mobile Version - Modern minimal pills */}
              <div className="flex flex-wrap justify-center gap-2 sm:hidden">
                {[
                  { icon: Clock, label: 'Same-Day' },
                  { icon: FileCheck, label: 'No Contracts' },
                  { icon: Shield, label: 'Guaranteed' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <item.icon className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                    <span className="text-xs font-medium text-white/90">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Desktop/Tablet Version */}
              <div className="hidden sm:grid sm:grid-cols-1 gap-4">
                {[
                  {
                    icon: Clock,
                    title: 'Same-Day',
                    fullDesc: 'Book today, get cleaned today. Fast turnaround when you need it most.'
                  },
                  {
                    icon: FileCheck,
                    title: 'No Contracts',
                    fullDesc: 'Pay per service or subscribe monthly. Cancel anytime, no commitments.'
                  },
                  {
                    icon: Shield,
                    title: '100% Satisfaction',
                    fullDesc: "Not happy? We'll re-clean for free or give you a full refund."
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex flex-row items-center gap-4 p-4 rounded-xl bg-[var(--asphalt-black)]/50 border border-[var(--steel-gray)]/20"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[var(--safety-orange)]/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-[var(--safety-orange)]" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="text-xs text-[var(--slate-gray)]">{item.fullDesc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
