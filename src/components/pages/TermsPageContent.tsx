'use client'

import { motion } from 'motion/react'
import Container from '@/components/ui/Container'
import { BUSINESS_INFO } from '@/lib/schema'

const lastUpdated = 'December 1, 2024'

export default function TermsPageContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 pb-8 sm:pt-32 sm:pb-12 bg-[var(--asphalt-black)] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-[var(--slate-gray)]">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 bg-[var(--asphalt-dark)]">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="space-y-8 text-[var(--slate-gray)]">
              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Agreement to Terms
                </h2>
                <p>
                  By accessing or using {BUSINESS_INFO.name}&apos;s services,
                  you agree to be bound by these Terms of Service. If you do not
                  agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Services Description
                </h2>
                <p className="mb-3">
                  {BUSINESS_INFO.name} provides professional trash can and
                  recycling bin cleaning services including:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Residential trash can cleaning</li>
                  <li>Commercial bin and dumpster cleaning</li>
                  <li>Recurring cleaning subscriptions</li>
                  <li>Deep cleaning and sanitization services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Service Requirements
                </h2>
                <p className="mb-3">To receive our services, you agree to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Ensure bins are empty and accessible at the curb or
                    designated location on your scheduled service day
                  </li>
                  <li>
                    Provide accurate contact and service address information
                  </li>
                  <li>
                    Notify us at least 24 hours in advance if you need to
                    reschedule
                  </li>
                  <li>
                    Ensure bins do not contain hazardous materials, medical
                    waste, or illegal substances
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Pricing and Payment
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    All prices are listed in US dollars and are subject to
                    change with notice
                  </li>
                  <li>Payment is due at the time of service unless otherwise arranged</li>
                  <li>
                    Recurring service customers are billed automatically after
                    each service
                  </li>
                  <li>
                    We accept major credit cards, debit cards, and approved
                    digital payment methods
                  </li>
                  <li>
                    Commercial accounts may request invoice billing with
                    approved credit
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Cancellation Policy
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-white">No Contracts:</strong> You
                    may cancel recurring service at any time without penalty
                  </li>
                  <li>
                    <strong className="text-white">Rescheduling:</strong> Please
                    provide 24 hours notice to reschedule without charge
                  </li>
                  <li>
                    <strong className="text-white">Missed Service:</strong> If
                    bins are not accessible on your scheduled day, a
                    rescheduling fee may apply
                  </li>
                  <li>
                    <strong className="text-white">Refunds:</strong> If you are
                    unsatisfied with our service, contact us within 24 hours for
                    a re-clean or refund
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Satisfaction Guarantee
                </h2>
                <p>
                  We stand behind our work. If you are not completely satisfied
                  with your cleaning, contact us within 24 hours and we will
                  re-clean your bins at no additional charge or provide a full
                  refund.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Limitation of Liability
                </h2>
                <p className="mb-3">
                  {BUSINESS_INFO.name} shall not be liable for:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Damage to bins that were already in poor condition or
                    structurally compromised
                  </li>
                  <li>
                    Delays or inability to perform services due to weather,
                    natural disasters, or circumstances beyond our control
                  </li>
                  <li>
                    Any indirect, incidental, or consequential damages arising
                    from our services
                  </li>
                </ul>
                <p className="mt-3">
                  Our total liability shall not exceed the amount paid for the
                  specific service in question.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Property Access
                </h2>
                <p>
                  By scheduling service, you grant {BUSINESS_INFO.name}
                  permission to access your property to retrieve and return bins
                  from the designated location. We will treat your property with
                  respect and care.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Environmental Responsibility
                </h2>
                <p>
                  We are committed to environmentally responsible practices. All
                  wastewater from our cleaning process is captured and disposed
                  of properly in accordance with local regulations. We use
                  eco-friendly, biodegradable cleaning products.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Intellectual Property
                </h2>
                <p>
                  All content on our website, including text, graphics, logos,
                  and images, is the property of {BUSINESS_INFO.name} and
                  protected by copyright laws. You may not reproduce,
                  distribute, or create derivative works without our express
                  written permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Governing Law
                </h2>
                <p>
                  These Terms of Service shall be governed by and construed in
                  accordance with the laws of the State of Florida, without
                  regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Changes to Terms
                </h2>
                <p>
                  We reserve the right to modify these terms at any time.
                  Changes will be effective immediately upon posting to our
                  website. Your continued use of our services after changes
                  constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Contact Information
                </h2>
                <p>
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="mt-3 p-4 rounded-lg bg-[var(--asphalt-black)] border border-[var(--steel-gray)]/20">
                  <p className="text-white font-semibold">
                    {BUSINESS_INFO.name}
                  </p>
                  <p>Email: {BUSINESS_INFO.email}</p>
                  <p>Phone: {BUSINESS_INFO.phone}</p>
                  <p>
                    Address: {BUSINESS_INFO.address.city},{' '}
                    {BUSINESS_INFO.address.state} {BUSINESS_INFO.address.zip}
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
