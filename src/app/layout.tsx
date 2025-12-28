import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { generateLocalBusinessSchema, BUSINESS_INFO } from '@/lib/schema'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FF6B00',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://largocancleaning.com'),
  title: {
    default: 'Trash Can Cleaning Largo, FL - Sanitize & Deodorize Bins',
    template: `%s | ${BUSINESS_INFO.name}`,
  },
  description: BUSINESS_INFO.description,
  keywords: [
    'trash can cleaning',
    'bin cleaning service',
    'garbage can sanitization',
    'pressure washing',
    'Largo Florida',
    'Seminole Florida',
    'Clearwater Florida',
    'Pinellas Park Florida',
    'Pinellas County',
    'residential cleaning',
    'commercial cleaning',
    'odor removal',
    'bacteria elimination',
    'trash bin sanitization',
    'wheelie bin cleaning',
    'garbage can cleaning service',
    '190 degree pressure wash',
    'eco-friendly bin cleaning',
    'maggot removal',
    'pest prevention',
    'recurring trash can service',
  ],
  authors: [{ name: BUSINESS_INFO.name, url: BUSINESS_INFO.url }],
  creator: BUSINESS_INFO.name,
  publisher: BUSINESS_INFO.name,
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BUSINESS_INFO.url,
    siteName: BUSINESS_INFO.name,
    title: 'Trash Can Cleaning Largo, FL - Sanitize & Deodorize Bins',
    description: BUSINESS_INFO.description,
    countryName: 'United States',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${BUSINESS_INFO.name} - Professional Trash Can Cleaning Service in Largo, Florida`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BUSINESS_INFO.name} | Professional Trash Can Cleaning`,
    description: BUSINESS_INFO.description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${BUSINESS_INFO.name} - Professional Trash Can Cleaning Service`,
      },
    ],
    creator: '@largocancleaning',
    site: '@largocancleaning',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: 'https://largocancleaning.com',
    languages: {
      'en-US': 'https://largocancleaning.com',
    },
  },
  category: 'business',
  classification: 'Business/Cleaning Services',
  referrer: 'origin-when-cross-origin',
  other: {
    // Geo meta tags for local SEO
    'geo.region': 'US-FL',
    'geo.placename': 'Largo',
    'geo.position': '27.9092;-82.7873',
    'ICBM': '27.9092, -82.7873',
    // Additional business meta tags
    'business:contact_data:street_address': BUSINESS_INFO.address.street,
    'business:contact_data:locality': BUSINESS_INFO.address.city,
    'business:contact_data:region': BUSINESS_INFO.address.state,
    'business:contact_data:postal_code': BUSINESS_INFO.address.zip,
    'business:contact_data:country_name': 'United States',
    'business:contact_data:phone_number': BUSINESS_INFO.phone,
    'business:contact_data:email': BUSINESS_INFO.email,
    // Additional SEO meta tags
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': BUSINESS_INFO.name,
    'application-name': BUSINESS_INFO.name,
    'msapplication-TileColor': '#FF6B00',
    'msapplication-config': '/browserconfig.xml',
    // Rating and content info
    'rating': 'General',
    'distribution': 'global',
    'revisit-after': '7 days',
    'expires': 'never',
    // Local business specific
    'subject': 'Professional Trash Can Cleaning Services',
    'coverage': 'Largo, Seminole, Clearwater, Pinellas Park, Safety Harbor, Dunedin, Palm Harbor, Belleair, Pinellas County, Florida',
    'target': 'all',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const localBusinessSchema = generateLocalBusinessSchema()

  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon.svg" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased bg-asphalt-dark text-white min-h-screen flex flex-col`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--safety-orange)] focus:text-white focus:rounded-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <AnalyticsTracker />
      </body>
    </html>
  )
}
