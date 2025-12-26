/**
 * JSON-LD Schema generators for SEO
 * CleanCan Pro - Seminole, Florida 33776
 */

export const BUSINESS_INFO = {
  name: 'CleanCan Pro',
  description: 'Professional trash can cleaning and sanitization service in Seminole, Florida. We eliminate 99.9% of bacteria, odors, and pests from your trash cans.',
  slogan: 'Professional-grade sanitation for your bins',
  phone: '727-555-0123', // Placeholder - update with real number
  email: 'info@cleancanpro.com',
  address: {
    street: '123 Main Street', // Placeholder
    city: 'Seminole',
    state: 'FL',
    zip: '33776',
    country: 'US',
  },
  geo: {
    latitude: 27.8397,
    longitude: -82.7918,
  },
  url: 'https://cleancanpro.com',
  priceRange: '$25 - $77',
  openingHours: 'Mo-Fr 08:00-18:00, Sa 09:00-14:00',
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
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00',
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
