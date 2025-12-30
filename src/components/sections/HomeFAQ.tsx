'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { ChevronDown, ArrowRight, HelpCircle, Phone, MessageCircle } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { faqs } from '@/lib/faqSchema'
import { BUSINESS_INFO } from '@/lib/schema'

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle
}: {
  faq: typeof faqs[0]
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`rounded-xl border transition-all duration-200 ${
        isOpen
          ? 'bg-[var(--safety-orange)]/5 border-[var(--safety-orange)]/30'
          : 'bg-[var(--concrete-gray)]/30 border-[var(--steel-gray)]/20 hover:border-[var(--steel-gray)]/40'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 sm:p-5 flex items-start gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety-orange)] rounded-xl"
        aria-expanded={isOpen}
      >
        {/* Number Badge */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold transition-colors ${
          isOpen
            ? 'bg-[var(--safety-orange)] text-white'
            : 'bg-[var(--steel-gray)]/30 text-[var(--slate-gray)]'
        }`}>
          {String(index + 1).padStart(2, '0')}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white pr-2">
            {faq.question}
          </h3>
          <AnimatePresence>
            {isOpen && (
              <motion.p
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm sm:text-base text-[var(--slate-gray)] leading-relaxed overflow-hidden"
              >
                {faq.answer}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-[var(--safety-orange)]' : 'text-[var(--steel-gray)]'}`} />
        </motion.div>
      </button>
    </motion.div>
  )
}

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      className="py-16 sm:py-24 bg-gradient-to-b from-[var(--asphalt-dark)] to-[var(--asphalt-black)] relative overflow-hidden"
      aria-labelledby="faq-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" aria-hidden="true" />

      {/* Decorative Orb */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[var(--safety-orange)]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">

          {/* Left Column - Header & CTA */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20">
                <HelpCircle className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--safety-orange)]">FAQs</span>
              </div>

              <h2
                id="faq-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4"
              >
                Questions? We Have Answers
              </h2>
              <p className="text-[var(--slate-gray)] mb-8">
                Everything you need to know about our trash can cleaning service. Can&apos;t find your answer? Reach out directly.
              </p>

              {/* Quick Contact Cards */}
              <div className="space-y-3">
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--concrete-gray)]/40 border border-[var(--steel-gray)]/20 hover:border-[var(--safety-orange)]/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--safety-orange)]/10 flex items-center justify-center group-hover:bg-[var(--safety-orange)]/20 transition-colors">
                    <Phone className="w-5 h-5 text-[var(--safety-orange)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--slate-gray)]">Call us anytime</p>
                    <p className="text-sm font-semibold text-white">{BUSINESS_INFO.phone}</p>
                  </div>
                </a>

                <Link
                  href="/contact"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--concrete-gray)]/40 border border-[var(--steel-gray)]/20 hover:border-[var(--safety-orange)]/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--safety-orange)]/10 flex items-center justify-center group-hover:bg-[var(--safety-orange)]/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-[var(--safety-orange)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--slate-gray)]">Send a message</p>
                    <p className="text-sm font-semibold text-white">Get a Free Quote</p>
                  </div>
                </Link>
              </div>

              {/* View All Link */}
              <div className="mt-6 hidden lg:block">
                <Link href="/faq">
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    View All FAQs
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column - FAQ Accordion */}
          <div className="lg:col-span-8">
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  index={index}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-8 text-center lg:hidden">
              <Link href="/faq">
                <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View All FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
