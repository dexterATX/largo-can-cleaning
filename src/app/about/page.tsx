import type { Metadata } from 'next'
import { BUSINESS_INFO } from '@/lib/schema'
import AboutPageContent from '@/components/pages/AboutPageContent'

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${BUSINESS_INFO.name} - your trusted trash can cleaning service in ${BUSINESS_INFO.address.city}, FL. Family-owned, eco-friendly, and committed to healthier communities.`,
  keywords: [
    'about Largo Can Cleaning',
    'trash can cleaning company',
    'Largo FL cleaning service',
    'eco-friendly bin cleaning',
    'local cleaning business',
  ],
  alternates: {
    canonical: `${BUSINESS_INFO.url}/about`,
  },
  openGraph: {
    title: `About Us | ${BUSINESS_INFO.name}`,
    description: `Meet the team behind ${BUSINESS_INFO.name}. Family-owned trash can cleaning service serving ${BUSINESS_INFO.address.city} and surrounding areas.`,
    url: `${BUSINESS_INFO.url}/about`,
  },
}

export default function AboutPage() {
  return <AboutPageContent />
}
