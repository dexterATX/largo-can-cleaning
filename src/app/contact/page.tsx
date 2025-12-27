import type { Metadata } from 'next'
import { BUSINESS_INFO } from '@/lib/schema'
import ContactPageContent from '@/components/pages/ContactPageContent'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Contact ${BUSINESS_INFO.name} for professional trash can cleaning in ${BUSINESS_INFO.address.city}, FL. Call ${BUSINESS_INFO.phone} or request a free quote online.`,
  keywords: [
    'contact Largo Can Cleaning',
    'trash can cleaning quote',
    'bin cleaning Largo FL',
    'schedule bin cleaning',
  ],
  alternates: {
    canonical: `${BUSINESS_INFO.url}/contact`,
  },
  openGraph: {
    title: `Contact Us | ${BUSINESS_INFO.name}`,
    description: `Get in touch with ${BUSINESS_INFO.name}. Request a free quote or schedule your first cleaning today.`,
    url: `${BUSINESS_INFO.url}/contact`,
  },
}

export default function ContactPage() {
  return <ContactPageContent />
}
