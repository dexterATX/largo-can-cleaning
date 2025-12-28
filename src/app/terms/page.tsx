import type { Metadata } from 'next'
import { BUSINESS_INFO } from '@/lib/schema'
import TermsPageContent from '@/components/pages/TermsPageContent'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `${BUSINESS_INFO.name} terms of service. Read our service agreement, scheduling policies, payment terms, and satisfaction guarantee for bin cleaning.`,
  alternates: {
    canonical: `${BUSINESS_INFO.url}/terms`,
  },
  openGraph: {
    title: `Terms of Service | ${BUSINESS_INFO.name}`,
    description: `Terms and conditions for ${BUSINESS_INFO.name} trash can cleaning services.`,
    url: `${BUSINESS_INFO.url}/terms`,
  },
}

export default function TermsPage() {
  return <TermsPageContent />
}
