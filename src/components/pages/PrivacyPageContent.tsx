'use client'

import { motion } from 'motion/react'
import Container from '@/components/ui/Container'
import { BUSINESS_INFO } from '@/lib/schema'

const lastUpdated = 'December 1, 2024'

export default function PrivacyPageContent() {
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
              Privacy Policy
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
            className="max-w-3xl mx-auto prose prose-invert prose-sm sm:prose-base"
          >
            <div className="space-y-8 text-[var(--slate-gray)]">
              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Introduction
                </h2>
                <p>
                  {BUSINESS_INFO.name} (&quot;we,&quot; &quot;our,&quot; or
                  &quot;us&quot;) respects your privacy and is committed to
                  protecting your personal data. This privacy policy explains
                  how we collect, use, disclose, and safeguard your information
                  when you visit our website or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Information We Collect
                </h2>
                <p className="mb-3">
                  We collect information that you provide directly to us,
                  including:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-white">Contact Information:</strong>{' '}
                    Name, email address, phone number, and service address
                  </li>
                  <li>
                    <strong className="text-white">Service Information:</strong>{' '}
                    Details about the services you request, scheduling
                    preferences, and service history
                  </li>
                  <li>
                    <strong className="text-white">Payment Information:</strong>{' '}
                    Credit card numbers and billing information (processed
                    securely through our payment processor)
                  </li>
                  <li>
                    <strong className="text-white">Communications:</strong>{' '}
                    Messages you send us through our contact form, email, or
                    phone
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Automatically Collected Information
                </h2>
                <p className="mb-3">
                  When you visit our website, we may automatically collect:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and approximate location</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website or search terms</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  How We Use Your Information
                </h2>
                <p className="mb-3">We use the information we collect to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send service reminders and scheduling confirmations</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>
                    Send promotional communications (with your consent)
                  </li>
                  <li>Monitor and analyze usage trends</li>
                  <li>Detect, prevent, and address technical issues</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Information Sharing
                </h2>
                <p className="mb-3">
                  We do not sell, trade, or rent your personal information. We
                  may share your information only in the following situations:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-white">Service Providers:</strong>{' '}
                    With third-party vendors who assist us in operating our
                    business (payment processors, email services)
                  </li>
                  <li>
                    <strong className="text-white">Legal Requirements:</strong>{' '}
                    When required by law or to respond to legal process
                  </li>
                  <li>
                    <strong className="text-white">Business Transfers:</strong>{' '}
                    In connection with a merger, acquisition, or sale of assets
                  </li>
                  <li>
                    <strong className="text-white">With Your Consent:</strong>{' '}
                    When you have given us permission to share your information
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. However, no
                  method of transmission over the Internet is 100% secure, and
                  we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Cookies and Tracking
                </h2>
                <p>
                  Our website may use cookies and similar tracking technologies
                  to enhance your browsing experience. You can set your browser
                  to refuse cookies or alert you when cookies are being sent.
                  Note that some parts of our website may not function properly
                  without cookies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Your Rights
                </h2>
                <p className="mb-3">You have the right to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt out of marketing communications</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, please contact us using the
                  information below.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Children&apos;s Privacy
                </h2>
                <p>
                  Our services are not directed to individuals under 18. We do
                  not knowingly collect personal information from children. If
                  you believe we have collected information from a child, please
                  contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Changes to This Policy
                </h2>
                <p>
                  We may update this privacy policy from time to time. We will
                  notify you of any changes by posting the new policy on this
                  page and updating the &quot;Last updated&quot; date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  Contact Us
                </h2>
                <p>
                  If you have questions about this privacy policy or our privacy
                  practices, please contact us at:
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
