import type { Metadata } from 'next'
import BlogPageContent from '@/components/pages/BlogPageContent'
import { BUSINESS_INFO } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Blog | Tips & Insights',
  description: 'Expert tips on trash can cleaning, home hygiene, pest prevention, and maintaining a clean outdoor space. Stay informed with Largo Can Cleaning.',
  keywords: [
    'trash can cleaning tips',
    'garbage bin hygiene',
    'pest prevention',
    'home cleaning tips',
    'outdoor hygiene',
    'bin sanitization',
  ],
  alternates: {
    canonical: `${BUSINESS_INFO.url}/blog`,
  },
  openGraph: {
    title: `Blog | ${BUSINESS_INFO.name}`,
    description: 'Expert tips on trash can cleaning, home hygiene, and pest prevention.',
    type: 'website',
    url: `${BUSINESS_INFO.url}/blog`,
  },
}

export default function BlogPage() {
  return <BlogPageContent />
}
