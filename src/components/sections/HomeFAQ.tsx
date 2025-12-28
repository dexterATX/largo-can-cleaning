'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { faqs } from '@/lib/faqSchema'

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof faqs[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[var(--steel-gray)]/20 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--asphalt-dark)] rounded-lg"
        aria-expanded={isOpen}
      >
        <h3 className="text-base sm:text-lg font-semibold text-white pr-4">
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-[var(--safety-orange)]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm sm:text-base text-[var(--slate-gray)] leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      className="pt-16 sm:pt-24 bg-[var(--asphalt-dark)] relative overflow-hidden"
      aria-labelledby="faq-heading"
    >
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--safety-orange)]/20 to-transparent pointer-events-none" aria-hidden="true" />

      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-12"
          >
            <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--safety-orange)] bg-[var(--safety-orange)]/10 rounded-full">
              Common Questions
            </span>
            <h2
              id="faq-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--slate-gray)]">
              Quick answers to the questions we hear most from Pinellas County homeowners.
            </p>
          </motion.div>

          {/* FAQ List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[var(--concrete-gray)]/30 rounded-2xl border border-[var(--steel-gray)]/20 p-4 sm:p-6"
          >
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </motion.div>

          {/* More Questions CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-8"
          >
            <p className="text-[var(--slate-gray)] mb-4">
              Have more questions? Check our complete FAQ or get in touch.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/faq">
                <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Browse All Questions
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Bottom Divider - Centered between sections */}
      <div className="w-full py-10 sm:py-12 flex items-center justify-center" aria-hidden="true">
        <div className="w-64 sm:w-80 h-px bg-gradient-to-r from-transparent via-[var(--safety-orange)]/60 to-transparent" />
      </div>
    </section>
  )
}
