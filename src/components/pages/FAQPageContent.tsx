'use client'

import { useState, useRef, memo } from 'react'
import { motion, AnimatePresence, useInView } from 'motion/react'
import Link from 'next/link'
import {
  Phone,
  Plus,
  Minus,
  HelpCircle,
  MessageCircle,
  Clock,
  Shield,
  ArrowRight,
} from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { BUSINESS_INFO } from '@/lib/schema'
import { cn } from '@/lib/utils'

const faqFeatures = [
  { icon: MessageCircle, text: 'Quick Answers' },
  { icon: Clock, text: '24hr Response Time' },
  { icon: Shield, text: 'No Contracts Ever' },
]

// ============================================
// FAQ DATA
// ============================================

const faqs = [
  // Service & Pricing
  {
    question: 'Why should I pay for professional bin cleaning?',
    answer: 'Trash bins breed harmful bacteria like E. coli, Salmonella, and Listeria. Rinsing with a hose doesn\'t sanitize—it just spreads contaminated water. Our 190°F high-pressure system kills 99.9% of bacteria, eliminates odors that attract pests, and captures all wastewater for proper disposal.',
  },
  {
    question: 'How much does it cost?',
    answer: 'Standard cleaning starts at $25/bin for one-time service. Monthly subscribers save 10% at $22/bin. We also offer multi-bin discounts: 2 bins for $40, 3+ bins at $18 each. Deep cleaning with degreasing is $45/bin.',
  },
  {
    question: 'Do you offer one-time cleaning?',
    answer: 'Absolutely! One-time cleans are $25/bin. Many customers start with a one-time clean to see the difference, then sign up for monthly service. No pressure—we let our results speak for themselves.',
  },
  {
    question: 'Do you offer commercial services?',
    answer: 'Yes! We serve restaurants, offices, HOAs, apartment complexes, and property managers. Commercial plans include flexible scheduling, volume discounts, and dedicated account support.',
  },
  // Scheduling
  {
    question: 'Do I need to be home during cleaning?',
    answer: 'No! Just leave your empty bins at the curb on your scheduled day. We\'ll clean them and return them to the same spot. You\'ll receive a text when we\'re on our way and another when complete.',
  },
  {
    question: 'When do you come—same day as trash pickup?',
    answer: 'We typically service bins the day after your regular trash collection to ensure they\'re empty. You\'ll receive a text the night before as a reminder to leave bins accessible.',
  },
  {
    question: 'What if I forget to leave my bins out?',
    answer: 'No worries—give us 24 hours notice and we\'ll reschedule at no charge. If bins aren\'t out on service day without notice, we\'ll attempt to reschedule once at our discretion.',
  },
  {
    question: 'What areas do you serve?',
    answer: `We proudly serve ${BUSINESS_INFO.areaServed.join(', ')}, and surrounding areas throughout Pinellas County, FL.`,
  },
  // Process
  {
    question: 'How does the cleaning process work?',
    answer: 'Our truck-mounted system uses 190°F water at 3,000+ PSI to blast away grime inside and out. We apply EPA-approved sanitizing solution, scrub stubborn residue, then rinse and deodorize. Takes 3-5 minutes per bin.',
  },
  {
    question: 'Is it eco-friendly and safe?',
    answer: 'Yes! We use biodegradable, EPA-approved cleaning products safe for children, pets, and plants. Our system captures 100% of wastewater—nothing goes into storm drains. Bins are safe to use immediately.',
  },
  {
    question: 'Will my bin look brand new?',
    answer: 'We\'ll remove all grime, bacteria, and odors. However, years of use may have caused scratches or sun fading that can\'t be reversed. Your bin will be thoroughly sanitized and smell fresh.',
  },
  // Billing
  {
    question: 'Are there any contracts?',
    answer: 'Never! All subscriptions are month-to-month. Cancel, pause, or change your service anytime with no fees or penalties. We earn your business every single cleaning.',
  },
  {
    question: 'How does billing work?',
    answer: 'For subscriptions, you\'re billed monthly on the same date you signed up. One-time cleans are charged at booking. We accept all major credit cards.',
  },
  {
    question: 'Do you offer any discounts?',
    answer: 'Yes! We offer 10% off for monthly subscribers, multi-bin discounts, senior/military discounts (10%), and a referral program—earn a free cleaning for each friend who signs up.',
  },
]

// ============================================
// FAQ SCHEMA FOR SEO
// ============================================

function FAQSchema() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}

// ============================================
// FAQ ITEM - Memoized for performance
// ============================================

const FAQItem = memo(function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.15) }}
      className={cn(
        'rounded-xl transition-all duration-200',
        isOpen
          ? 'bg-[var(--concrete-gray)]/50 border border-[var(--steel-gray)]/30'
          : 'bg-[var(--concrete-gray)]/20 border border-transparent hover:bg-[var(--concrete-gray)]/30'
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-4 text-left"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            'text-sm sm:text-[15px] font-medium transition-colors leading-snug',
            isOpen ? 'text-white' : 'text-[var(--light-gray)]'
          )}
        >
          {question}
        </span>
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all',
            isOpen
              ? 'bg-[var(--safety-orange)] text-white'
              : 'bg-[var(--steel-gray)]/20 text-[var(--slate-gray)]'
          )}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <p className="text-sm text-[var(--slate-gray)] leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

// ============================================
// MAIN COMPONENT
// ============================================

export default function FAQPageContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="relative bg-[var(--asphalt-black)] min-h-screen">
      <FAQSchema />

      {/* Hero */}
      <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pb-20 overflow-hidden bg-gradient-dark">
        {/* FAQ PAGE: Knowledge & Clarity Theme */}

        {/* Soft radial dots - MORE VISIBLE with orange */}
        <div className="absolute inset-0 opacity-35 lg:opacity-45">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="clarityDots" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="2" fill="var(--safety-orange)" opacity="0.5" />
                <circle cx="0" cy="0" r="1.5" fill="var(--safety-orange)" opacity="0.35" />
                <circle cx="50" cy="50" r="1.5" fill="var(--safety-orange)" opacity="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#clarityDots)" />
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-16 md:-left-32 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-amber-400/15 rounded-full blur-[60px] md:blur-[80px]" />
        <div className="absolute -top-20 right-0 w-72 h-72 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px] bg-[var(--safety-orange)]/20 rounded-full blur-[80px] md:blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 sm:w-64 sm:h-64 bg-yellow-400/12 rounded-full blur-[50px] md:blur-[60px]" />

        {/* Frosty dark overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--safety-orange)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--safety-orange)]" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-[var(--safety-orange)]">
                Got Questions? We Have Answers
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              <span className="text-white">Frequently Asked </span>
              <span className="text-gradient-orange">Questions</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-[var(--light-gray)] max-w-2xl mx-auto mb-4"
            >
              Browse our trash can cleaning FAQs—answers to common questions about Largo Can Cleaning&apos;s professional service in Largo FL
            </motion.p>

            {/* Additional descriptive content for SEO */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="text-sm text-[var(--slate-gray)] max-w-xl mx-auto mb-8 leading-relaxed"
            >
              Whether you&apos;re curious about our cleaning process, pricing options, service areas throughout Pinellas County, or scheduling details, we&apos;ve compiled comprehensive answers to help you make an informed decision about professional bin sanitization.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              {faqFeatures.map((feature, index) => (
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/contact">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Contact Us
                </Button>
              </Link>
              <a href={`tel:${BUSINESS_INFO.phoneRaw}`}>
                <Button variant="outline" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  {BUSINESS_INFO.phone}
                </Button>
              </a>
            </motion.div>
          </div>
        </Container>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--asphalt-dark)] to-transparent" />
      </section>

      {/* FAQ List */}
      <section className="py-6 sm:pb-20 bg-[var(--asphalt-dark)] sm:bg-[var(--asphalt-black)]">
        <Container>
          {/* Mobile: Card-like container */}
          <div className="sm:hidden">
            <div className="rounded-2xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 p-4">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--steel-gray)]/10">
                <HelpCircle className="w-4 h-4 text-[var(--safety-orange)]" />
                <span className="text-xs font-medium text-[var(--slate-gray)] uppercase tracking-wide">
                  {faqs.length} Questions
                </span>
              </div>
              <div className="space-y-2">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={cn(
                      'rounded-xl transition-all duration-200',
                      openIndex === index
                        ? 'bg-[var(--asphalt-black)] border border-[var(--steel-gray)]/20'
                        : 'bg-transparent'
                    )}
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full flex items-center justify-between gap-3 p-3 text-left"
                      aria-expanded={openIndex === index}
                    >
                      <span
                        className={cn(
                          'text-sm font-medium leading-snug transition-colors',
                          openIndex === index ? 'text-white' : 'text-[var(--light-gray)]'
                        )}
                      >
                        {faq.question}
                      </span>
                      <div
                        className={cn(
                          'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all',
                          openIndex === index
                            ? 'bg-[var(--safety-orange)] text-white'
                            : 'bg-[var(--steel-gray)]/20 text-[var(--slate-gray)]'
                        )}
                      >
                        {openIndex === index ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3">
                            <p className="text-xs text-[var(--slate-gray)] leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: Original layout */}
          <div className="hidden sm:block max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => toggleItem(index)}
                index={index}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Additional Content Section for SEO */}
      <section className="py-10 sm:py-16 bg-[var(--asphalt-black)] border-t border-[var(--steel-gray)]/10">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-sm sm:text-base text-[var(--slate-gray)] leading-relaxed mb-4">
              We understand that choosing a professional trash can cleaning service is an important decision for your home or business. Our team at Largo Can Cleaning is committed to providing transparent information about our sanitization process, eco-friendly cleaning solutions, and flexible scheduling options. We proudly serve residential and commercial customers throughout Pinellas County, including Largo, Seminole, Clearwater, Pinellas Park, Safety Harbor, Dunedin, Palm Harbor, and Belleair.
            </p>
            <p className="text-sm sm:text-base text-[var(--slate-gray)] leading-relaxed mb-4">
              Our professional bin cleaning service uses high-temperature, high-pressure water to eliminate 99.9% of bacteria, remove stubborn odors, and prevent pest infestations. With no contracts required and satisfaction guaranteed, there&apos;s no risk in trying our service. Our truck-mounted cleaning system heats water to 190°F and applies over 3,000 PSI of pressure to blast away years of built-up grime and bacteria that regular hosing simply cannot remove.
            </p>
            <p className="text-sm sm:text-base text-[var(--slate-gray)] leading-relaxed mb-6">
              Every cleaning includes a deodorizing treatment that leaves your bins smelling fresh for weeks. We capture all wastewater to protect your lawn and local waterways. Whether you have questions about residential service, commercial accounts, or our eco-friendly cleaning methods, we&apos;re here to help. Contact us today for a free quote or call us directly to speak with a member of our team about your specific trash can cleaning needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Get Free Quote
                </Button>
              </Link>
              <a href={`tel:${BUSINESS_INFO.phoneRaw}`}>
                <Button variant="outline" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  {BUSINESS_INFO.phone}
                </Button>
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

    </div>
  )
}
