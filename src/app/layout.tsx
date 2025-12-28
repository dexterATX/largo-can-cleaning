import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { generateLocalBusinessSchema, BUSINESS_INFO } from '@/lib/schema'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import SpeculationRules from '@/components/SpeculationRules'

// Google Analytics Measurement ID - set in environment variables
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

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
    default: 'Largo Can Cleaning | Trash Can Cleaning Pinellas FL',
    template: `%s | ${BUSINESS_INFO.name}`,
  },
  description: BUSINESS_INFO.description,
  keywords: [
    // Branded keywords (Homepage owns these)
    'Largo Can Cleaning',
    'trash can cleaning Pinellas County',
    'bin cleaning service near me',
    'professional bin sanitization Florida',
    'garbage can cleaning company',
    // Location authority (Homepage owns general location)
    'Pinellas County bin cleaning',
    'Tampa Bay trash can service',
    // Broad service descriptors
    'eco-friendly bin cleaning',
    '190 degree pressure wash',
    'bacteria elimination service',
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
    title: 'Largo Can Cleaning | Trash Can Cleaning Pinellas FL',
    description: BUSINESS_INFO.description,
    countryName: 'United States',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${BUSINESS_INFO.name} - Professional Trash Can Cleaning Service in Largo, Florida`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BUSINESS_INFO.name} | Professional Trash Can Cleaning`,
    description: BUSINESS_INFO.description,
    images: [
      {
        url: '/opengraph-image',
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
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
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
    // Additional business meta tags (service-area business - no street address)
    'business:contact_data:locality': BUSINESS_INFO.address.city,
    'business:contact_data:region': BUSINESS_INFO.address.state,
    'business:contact_data:postal_code': BUSINESS_INFO.address.zip,
    'business:contact_data:country_name': 'United States',
    'business:contact_data:phone_number': BUSINESS_INFO.phoneRaw,
    'business:contact_data:email': BUSINESS_INFO.email,
    // Apple mobile web app tags
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': BUSINESS_INFO.name,
    'application-name': BUSINESS_INFO.name,
    'msapplication-TileColor': '#FF6B00',
    // Local business specific
    'subject': 'Professional Trash Can Cleaning Services',
    'coverage': 'Largo, Seminole, Clearwater, Pinellas Park, Safety Harbor, Dunedin, Palm Harbor, Belleair, Pinellas County, Florida',
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
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
        <SpeculationRules />
        {/* Google Analytics - only loaded when measurement ID is configured */}
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
      </body>
    </html>
  )
}
