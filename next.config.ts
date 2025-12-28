import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  {
    // Content Security Policy - allows inline styles for Next.js but blocks dangerous sources
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com", // Required for Next.js + GA
      "style-src 'self' 'unsafe-inline'", // Required for styled-jsx and inline styles
      "img-src 'self' data: https://images.unsplash.com https://i.pravatar.cc https://www.google-analytics.com https://www.googletagmanager.com blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://*.googletagmanager.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  }
]

const nextConfig: NextConfig = {
  // Disable X-Powered-By header for security
  poweredByHeader: false,
  output: 'standalone',
  allowedDevOrigins: ['192.168.1.24'],

  // Enable compression
  compress: true,

  // Remove console logs in production for smaller bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Optimize package imports for better tree-shaking
  experimental: {
    optimizePackageImports: [
      'motion',
      'lucide-react',
      'date-fns',
      'recharts',
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@supabase/supabase-js',
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
    // Performance: Use modern formats and longer cache
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Cache Next.js static assets (immutable)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache optimized images
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  }
};

export default nextConfig;
