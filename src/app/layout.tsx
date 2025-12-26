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
  metadataBase: new URL(BUSINESS_INFO.url),
  title: {
    default: `${BUSINESS_INFO.name} | Professional Trash Can Cleaning in Seminole, FL`,
    template: `%s | ${BUSINESS_INFO.name}`,
  },
  description: BUSINESS_INFO.description,
  keywords: [
    'trash can cleaning',
    'bin cleaning service',
    'garbage can sanitization',
    'pressure washing',
    'Seminole Florida',
    'Pinellas County',
    'residential cleaning',
    'commercial cleaning',
    'odor removal',
    'bacteria elimination',
  ],
  authors: [{ name: BUSINESS_INFO.name }],
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
    title: `${BUSINESS_INFO.name} | Professional Trash Can Cleaning`,
    description: BUSINESS_INFO.description,
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${BUSINESS_INFO.name} - Professional Trash Can Cleaning Service`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BUSINESS_INFO.name} | Professional Trash Can Cleaning`,
    description: BUSINESS_INFO.description,
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BUSINESS_INFO.url,
  },
  category: 'business',
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
