import type { Metadata } from 'next'
import { BUSINESS_INFO, generateContactPageSchema, generateLocalBusinessSchema } from '@/lib/schema'
import ContactPageContent from '@/components/pages/ContactPageContent'

export const metadata: Metadata = {
  title: 'Get a Free Quote | Largo FL',
  description: `Contact ${BUSINESS_INFO.name} for professional trash can cleaning in ${BUSINESS_INFO.address.city}, FL. Call ${BUSINESS_INFO.phone} or request a free quote online.`,
  keywords: [
    'contact Largo Can Cleaning',
    'trash can cleaning quote',
    'bin cleaning Largo FL',
    'schedule bin cleaning',
    'trash can cleaning Pinellas County',
    'garbage can cleaning near me',
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
  const contactPageSchema = generateContactPageSchema()
  const localBusinessSchema = generateLocalBusinessSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <ContactPageContent />
    </>
  )
}
