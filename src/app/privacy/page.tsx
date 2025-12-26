import type { Metadata } from 'next'
import { BUSINESS_INFO } from '@/lib/schema'
import PrivacyPageContent from '@/components/pages/PrivacyPageContent'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `${BUSINESS_INFO.name} privacy policy. Learn how we collect, use, and protect your personal information.`,
  alternates: {
    canonical: `${BUSINESS_INFO.url}/privacy`,
  },
  openGraph: {
    title: `Privacy Policy | ${BUSINESS_INFO.name}`,
    description: `Our commitment to protecting your privacy and personal data.`,
    url: `${BUSINESS_INFO.url}/privacy`,
  },
}

export default function PrivacyPage() {
  return <PrivacyPageContent />
}
