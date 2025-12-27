import type { Metadata } from 'next'
import GalleryPageContent from '@/components/pages/GalleryPageContent'
import { BUSINESS_INFO } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Gallery | Our Work',
  description: 'See the results of our professional trash can cleaning service. Before and after photos showcasing sparkling clean bins across Pinellas County.',
  keywords: [
    'trash can cleaning results',
    'bin cleaning before after',
    'garbage can sanitization photos',
    'cleaning service gallery',
    'Largo Can Cleaning work',
  ],
  alternates: {
    canonical: `${BUSINESS_INFO.url}/gallery`,
  },
  openGraph: {
    title: `Gallery | ${BUSINESS_INFO.name}`,
    description: 'See the amazing results of our professional trash can cleaning service.',
    type: 'website',
    url: `${BUSINESS_INFO.url}/gallery`,
  },
}

export default function GalleryPage() {
  return <GalleryPageContent />
}
