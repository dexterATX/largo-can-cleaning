/**
 * JSON-LD Schema generators for SEO
 * Largo Can Cleaning - Largo, Florida 33770
 */

export const BUSINESS_INFO = {
  name: 'Largo Can Cleaning',
  description: 'Professional trash can cleaning and sanitization service in Largo, Florida. We eliminate 99.9% of bacteria, odors, and pests from your trash cans.',
  slogan: 'Professional-grade sanitation for your bins',
  phone: '352-843-3425',
  email: 'support@largocancleaning.com',
  address: {
    street: '123 Main Street',
    city: 'Largo',
    state: 'FL',
    zip: '33770',
    country: 'US',
  },
  geo: {
    latitude: 27.9095,
    longitude: -82.7873,
  },
  url: 'https://largocancleaning.com',
  priceRange: '$25 - $77',
  openingHours: 'Mo-Su 00:00-23:59',
  areaServed: [
    'Seminole',
    'Largo',
    'Clearwater',
    'St. Petersburg',
    'Pinellas Park',
    'Pinellas County',
  ],
} as const

/**
 * LocalBusiness Schema - Use on every page
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BUSINESS_INFO.url}/#business`,
    name: BUSINESS_INFO.name,
    description: BUSINESS_INFO.description,
    slogan: BUSINESS_INFO.slogan,
    url: BUSINESS_INFO.url,
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    priceRange: BUSINESS_INFO.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address.street,
      addressLocality: BUSINESS_INFO.address.city,
      addressRegion: BUSINESS_INFO.address.state,
      postalCode: BUSINESS_INFO.address.zip,
      addressCountry: BUSINESS_INFO.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.geo.latitude,
      longitude: BUSINESS_INFO.geo.longitude,
    },
    areaServed: BUSINESS_INFO.areaServed.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    sameAs: [
      // Add social media links when available
      // 'https://facebook.com/cleancanpro',
      // 'https://instagram.com/cleancanpro',
    ],
    image: `${BUSINESS_INFO.url}/images/og-image.jpg`,
    logo: `${BUSINESS_INFO.url}/images/logo.png`,
  }
}

/**
 * Service Schema - Use on Services page
 */
export function generateServiceSchema(service: {
  name: string
  description: string
  price: string
  duration?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${BUSINESS_INFO.url}/#business`,
      name: BUSINESS_INFO.name,
    },
    areaServed: {
      '@type': 'City',
      name: BUSINESS_INFO.address.city,
      '@id': `https://www.wikidata.org/wiki/Q975825`, // Seminole, FL Wikidata ID
    },
    offers: {
      '@type': 'Offer',
      price: service.price.replace('$', ''),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    ...(service.duration && {
      estimatedDuration: service.duration,
    }),
  }
}

/**
 * FAQ Schema - Use on FAQ page
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * WebPage Schema - Generic page schema
 */
export function generateWebPageSchema(page: {
  title: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: page.url,
    isPartOf: {
      '@type': 'WebSite',
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.url,
    },
    about: {
      '@type': 'LocalBusiness',
      '@id': `${BUSINESS_INFO.url}/#business`,
    },
  }
}

/**
 * BreadcrumbList Schema - For navigation SEO
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Article Schema - For blog posts
 */
export function generateArticleSchema(article: {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified: string
  author?: string
  category?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.image || `${BUSINESS_INFO.url}/images/og-image.jpg`,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Organization',
      name: article.author || BUSINESS_INFO.name,
      url: BUSINESS_INFO.url,
    },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.url,
      logo: {
        '@type': 'ImageObject',
        url: `${BUSINESS_INFO.url}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
    ...(article.category && {
      articleSection: article.category,
    }),
  }
}
