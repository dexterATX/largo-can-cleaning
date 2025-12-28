import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { BUSINESS_INFO } from '@/lib/schema'

// Dynamic import with loading optimization
const PricingPageContent = dynamic(
  () => import('@/components/pages/PricingPageContent'),
  {
    loading: () => (
      <div className="min-h-screen bg-[var(--asphalt-dark)] animate-pulse" />
    )
  }
)

export const metadata: Metadata = {
  title: 'Trash Can Cleaning Cost & Pricing - Starting at $25',
  description: `Transparent trash can cleaning prices starting at $25. Monthly, bi-weekly, and one-time cleaning options in ${BUSINESS_INFO.address.city}, FL. No contracts, no hidden fees.`,
  keywords: [
    // Cost/price keywords (Pricing page owns these)
    'trash can cleaning cost',
    'how much does bin cleaning cost',
    'bin cleaning price per can',
    'affordable garbage can cleaning',
    'monthly trash cleaning rates',
    'cheap bin sanitization near me',
    'trash can service pricing',
    'bin cleaning subscription cost',
  ],
  alternates: {
    canonical: `${BUSINESS_INFO.url}/pricing`,
  },
  openGraph: {
    title: 'Trash Can Cleaning Cost & Pricing - Starting at $25',
    description: `Simple, transparent pricing for professional trash can cleaning. Starting at $25 per cleaning.`,
    url: `${BUSINESS_INFO.url}/pricing`,
  },
}

export default function PricingPage() {
  return <PricingPageContent />
}
