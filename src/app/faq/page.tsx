import type { Metadata } from 'next'
import { BUSINESS_INFO } from '@/lib/schema'
import FAQPageContent from '@/components/pages/FAQPageContent'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: `Get answers to common questions about ${BUSINESS_INFO.name} trash can cleaning services. Learn about our process, pricing, scheduling, and more.`,
  keywords: [
    'trash can cleaning FAQ',
    'bin cleaning questions',
    'garbage can sanitization process',
    'how bin cleaning works',
  ],
  alternates: {
    canonical: `${BUSINESS_INFO.url}/faq`,
  },
  openGraph: {
    title: `FAQ | ${BUSINESS_INFO.name}`,
    description: `Answers to frequently asked questions about our professional trash can cleaning service.`,
    url: `${BUSINESS_INFO.url}/faq`,
  },
}

export default function FAQPage() {
  return <FAQPageContent />
}
