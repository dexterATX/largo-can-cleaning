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
  title: 'Trash Can Cleaning Prices | Largo FL',
  description: `Transparent trash can cleaning prices starting at $25. Monthly, bi-weekly, and one-time cleaning options in ${BUSINESS_INFO.address.city}, FL. No contracts, no hidden fees.`,
  keywords: [
    'trash can cleaning prices',
    'bin cleaning cost',
    'garbage can cleaning rates',
    'affordable bin cleaning',
    'Seminole FL cleaning prices',
  ],
  alternates: {
    canonical: `${BUSINESS_INFO.url}/pricing`,
  },
  openGraph: {
    title: `Pricing | ${BUSINESS_INFO.name}`,
    description: `Simple, transparent pricing for professional trash can cleaning. Starting at $25 per cleaning.`,
    url: `${BUSINESS_INFO.url}/pricing`,
  },
}

export default function PricingPage() {
  return <PricingPageContent />
}
