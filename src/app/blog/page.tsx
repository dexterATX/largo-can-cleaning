import type { Metadata } from 'next'
import BlogPageContent from '@/components/pages/BlogPageContent'
import {
  BUSINESS_INFO,
  generateBlogSchema,
  generateBreadcrumbSchema,
  generateCollectionPageSchema
} from '@/lib/schema'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://largocancleaning.com'

export const metadata: Metadata = {
  title: 'Trash Can Cleaning Tips & Guides',
  description: 'Expert tips on trash can cleaning, home hygiene, pest prevention, and maintaining a clean outdoor space. Stay informed with Largo Can Cleaning.',
  keywords: [
    // Informational/how-to keywords (Blog owns these)
    'how to clean trash cans',
    'trash can odor removal tips',
    'prevent maggots in garbage cans',
    'Florida outdoor bin hygiene',
    'when to clean wheelie bins',
    'trash can bacteria facts',
    'DIY bin cleaning vs professional',
    'summer trash can odor prevention',
  ],
  alternates: {
    canonical: `${BUSINESS_INFO.url}/blog`,
  },
  openGraph: {
    title: 'Trash Can Cleaning Tips & Guides',
    description: 'Expert tips on trash can cleaning, home hygiene, and pest prevention.',
    type: 'website',
    url: `${BUSINESS_INFO.url}/blog`,
    siteName: BUSINESS_INFO.name,
    locale: 'en_US',
    images: [
      {
        url: `${BASE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${BUSINESS_INFO.name} Blog`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trash Can Cleaning Tips & Guides',
    description: 'Expert tips on trash can cleaning, home hygiene, and pest prevention.',
  },
}

export default function BlogPage() {
  const blogUrl = `${BASE_URL}/blog`

  // Generate Blog schema
  const blogSchema = generateBlogSchema({
    name: `${BUSINESS_INFO.name} Blog`,
    description: 'Expert tips on trash can cleaning, home hygiene, pest prevention, and maintaining a clean outdoor space.',
    url: blogUrl,
  })

  // Generate Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Blog', url: blogUrl },
  ])

  // Generate CollectionPage schema
  const collectionPageSchema = generateCollectionPageSchema({
    title: `${BUSINESS_INFO.name} Blog`,
    description: 'Expert tips on trash can cleaning, home hygiene, pest prevention, and maintaining a clean outdoor space.',
    url: blogUrl,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <BlogPageContent />
    </>
  )
}
