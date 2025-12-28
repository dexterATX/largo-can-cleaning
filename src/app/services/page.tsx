import type { Metadata } from 'next'
import { BUSINESS_INFO, generateServicesPageSchema, generateLocalBusinessSchema } from '@/lib/schema'
import ServicesPageContent from '@/components/pages/ServicesPageContent'

export const metadata: Metadata = {
  title: 'Trash Can Cleaning Services',
  description: `Professional trash can cleaning and sanitization services in ${BUSINESS_INFO.address.city}, FL. Residential, commercial, recurring, and deep clean options. 99.9% bacteria elimination guaranteed.`,
  keywords: [
    'trash can cleaning services',
    'bin cleaning Largo FL',
    'garbage can sanitization',
    'residential bin cleaning',
    'commercial trash cleaning',
    'recurring bin service',
    'deep clean trash cans',
    'Pinellas County trash cleaning',
    'wheelie bin cleaning service',
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

// Service data for schema
const serviceSchemaData = [
  {
    name: 'Residential Trash Can Cleaning',
    description: 'Professional trash can cleaning service for homeowners. We sanitize your residential bins using 190 degree high-pressure water and eco-friendly products, eliminating 99.9% of bacteria, odors, and pests.',
    price: '25',
    duration: 'PT5M',
  },
  {
    name: 'Recurring Bin Cleaning Service',
    description: 'Set-it-and-forget-it automatic scheduled trash can cleaning on your preferred frequency. Weekly, bi-weekly, or monthly options with 10% discount.',
    price: '22',
    duration: 'PT5M',
  },
  {
    name: 'Commercial Trash Can Cleaning',
    description: 'Professional-grade cleaning for businesses, restaurants, and property managers. Volume discounts available for HOAs and multi-unit properties.',
    price: 'Custom',
  },
  {
    name: 'Deep Clean Trash Can Service',
    description: 'Our most thorough service with industrial degreasing, extended sanitization, and protective anti-microbial coating. Perfect for bins that have not been cleaned in a while.',
    price: '45',
    duration: 'PT12M',
  },
]

export default function ServicesPage() {
  const servicesPageSchema = generateServicesPageSchema(serviceSchemaData)
  const localBusinessSchema = generateLocalBusinessSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <ServicesPageContent />
    </>
  )
}
