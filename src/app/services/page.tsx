import type { Metadata } from 'next'
import { BUSINESS_INFO } from '@/lib/schema'
import ServicesPageContent from '@/components/pages/ServicesPageContent'

export const metadata: Metadata = {
  title: 'Trash Can Cleaning Services',
  description: `Professional trash can cleaning and sanitization services in ${BUSINESS_INFO.address.city}, FL. Residential, commercial, recurring, and deep clean options. 99.9% bacteria elimination guaranteed.`,
  keywords: [
    'trash can cleaning services',
    'bin cleaning Seminole FL',
    'garbage can sanitization',
    'residential bin cleaning',
    'commercial trash cleaning',
    'recurring bin service',
    'deep clean trash cans',
  ],
  alternates: {
    canonical: `${BUSINESS_INFO.url}/services`,
  },
  openGraph: {
    title: `Trash Can Cleaning Services | ${BUSINESS_INFO.name}`,
    description: `Professional trash can cleaning and sanitization services in ${BUSINESS_INFO.address.city}, FL. Same-day service available.`,
    url: `${BUSINESS_INFO.url}/services`,
  },
}

export default function ServicesPage() {
  return <ServicesPageContent />
}
