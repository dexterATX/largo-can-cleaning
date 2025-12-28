/**
 * JSON-LD Schema generators for SEO
 * Largo Can Cleaning - Largo, Florida 33770
 * Pinellas County Service Area
 */

// Type definitions for schema.org structured data
export interface OpeningHoursSpec {
  '@type': 'OpeningHoursSpecification'
  dayOfWeek: string | string[]
  opens: string
  closes: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ServiceInput {
  name: string
  description: string
  price: string
  duration?: string
}

export interface ArticleInput {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified: string
  author?: string
  category?: string
}

export interface WebPageInput {
  title: string
  description: string
  url: string
}

export const BUSINESS_INFO = {
  name: 'Largo Can Cleaning',
  description:
    'Professional trash can cleaning and sanitization service in Largo, Florida. We eliminate 99.9% of bacteria, odors, and pests from your trash cans.',
  slogan: 'Professional-grade sanitation for your bins',
  phone: '(352) 843-3425',
  phoneRaw: '+13528433425',
  email: 'support@largocancleaning.com',
  address: {
    street: '123 Main Street',
    city: 'Largo',
    state: 'FL',
    stateFull: 'Florida',
    county: 'Pinellas County',
    zip: '33770',
    country: 'US',
  },
  geo: {
    latitude: 27.9095,
    longitude: -82.7873,
  },
  url: 'https://largocancleaning.com',
  priceRange: '$$',
  paymentAccepted: 'Cash, Credit Card',
  googleMapsUrl: 'https://www.google.com/maps/place/Largo,+FL+33770',
  serviceType: 'Trash Can Cleaning and Sanitization',
  // Service areas in Pinellas County, Florida
  areaServed: [
    'Largo',
    'Seminole',
    'Clearwater',
    'Pinellas Park',
    'Safety Harbor',
    'Dunedin',
    'Palm Harbor',
    'Belleair',
  ],
  // Business hours: Monday-Saturday 6AM-8PM, Sunday Closed
  openingHours: {
    weekdays: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '06:00',
      closes: '20:00',
    },
    sunday: {
      closed: true,
    },
  },
} as const

/**
 * Opening hours specification - pre-generated at module level
 * Monday-Saturday: 06:00-20:00
 * Sunday: Closed
 */
const OPENING_HOURS_SPEC: OpeningHoursSpec[] = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '06:00',
    closes: '20:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: 'Sunday',
    opens: '00:00',
    closes: '00:00',
  },
]

/**
 * Pre-generated LocalBusiness Schema - computed once at module load
 * Enhanced for local SEO optimization in Largo, FL and Pinellas County
 */
const LOCAL_BUSINESS_SCHEMA = {
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
  paymentAccepted: BUSINESS_INFO.paymentAccepted,
  currenciesAccepted: 'USD',
  hasMap: BUSINESS_INFO.googleMapsUrl,
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
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: BUSINESS_INFO.address.county,
      containedInPlace: {
        '@type': 'State',
        name: BUSINESS_INFO.address.stateFull,
      },
    },
  })),
  openingHoursSpecification: OPENING_HOURS_SPEC,
  sameAs: [] as string[],
  image: `${BUSINESS_INFO.url}/images/og-image.jpg`,
  logo: `${BUSINESS_INFO.url}/images/logo.png`,
} as const

/**
 * Get the pre-generated LocalBusiness Schema
 */
export function generateLocalBusinessSchema() {
  return LOCAL_BUSINESS_SCHEMA
}

/**
 * Service Schema - Use on Services page
 * Enhanced with proper area served for local SEO
 */
export function generateServiceSchema(service: ServiceInput) {
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
      telephone: BUSINESS_INFO.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: BUSINESS_INFO.address.city,
        addressRegion: BUSINESS_INFO.address.state,
        postalCode: BUSINESS_INFO.address.zip,
        addressCountry: BUSINESS_INFO.address.country,
      },
    },
    areaServed: BUSINESS_INFO.areaServed.map((area) => ({
      '@type': 'City',
      name: area,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: BUSINESS_INFO.address.county,
      },
    })),
    offers: {
      '@type': 'Offer',
      price: service.price.replace(/[$,]/g, ''),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31)
        .toISOString()
        .split('T')[0],
    },
    ...(service.duration && {
      estimatedDuration: service.duration,
    }),
  }
}

/**
 * FAQ Schema - Use on FAQ page
 * Generates FAQPage structured data for rich snippets
 */
export function generateFAQSchema(faqs: FAQItem[]) {
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
export function generateWebPageSchema(page: WebPageInput) {
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
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.speakable'],
    },
  }
}

/**
 * BreadcrumbList Schema - For navigation SEO
 * Generates breadcrumb structured data from an array of items
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
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
 * Generate breadcrumb items from a URL path
 * Helper function to create breadcrumb items from a page path
 * @param path - The URL path (e.g., '/services/residential')
 * @returns Array of breadcrumb items with name and url
 */
export function generateBreadcrumbItemsFromPath(path: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ name: 'Home', url: BUSINESS_INFO.url }]

  if (path === '/' || path === '') {
    return items
  }

  const segments = path.split('/').filter(Boolean)
  let currentPath = ''

  // Mapping for common path segments to readable names
  const segmentNames: Record<string, string> = {
    services: 'Services',
    about: 'About Us',
    contact: 'Contact',
    faq: 'FAQ',
    pricing: 'Pricing',
    blog: 'Blog',
    gallery: 'Gallery',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    residential: 'Residential',
    commercial: 'Commercial',
    admin: 'Admin',
  }

  for (const segment of segments) {
    currentPath += `/${segment}`
    const name =
      segmentNames[segment.toLowerCase()] ||
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    items.push({
      name,
      url: `${BUSINESS_INFO.url}${currentPath}`,
    })
  }

  return items
}

/**
 * Generate full breadcrumb schema from a URL path
 * Convenience function that combines path parsing and schema generation
 * @param path - The URL path (e.g., '/services/residential')
 */
export function generateBreadcrumbSchemaFromPath(path: string) {
  const items = generateBreadcrumbItemsFromPath(path)
  return generateBreadcrumbSchema(items)
}

/**
 * Article Schema - For blog posts (legacy, use generateBlogPostingSchema for blog posts)
 */
export function generateArticleSchema(article: ArticleInput) {
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

/**
 * BlogPosting Schema - Enhanced schema for individual blog posts
 * Provides better SEO for blog content with all recommended properties
 */
export function generateBlogPostingSchema(post: {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  category?: string
  readingTime?: number
  wordCount?: number
  keywords?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${post.url}#article`,
    headline: post.title,
    description: post.description,
    url: post.url,
    image: {
      '@type': 'ImageObject',
      url: post.image || `${BUSINESS_INFO.url}/images/og-image.jpg`,
      width: 1200,
      height: 630,
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      '@type': 'Organization',
      '@id': `${BUSINESS_INFO.url}/#business`,
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.url,
      logo: {
        '@type': 'ImageObject',
        url: `${BUSINESS_INFO.url}/logo.png`,
      },
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${BUSINESS_INFO.url}/#business`,
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.url,
      logo: {
        '@type': 'ImageObject',
        url: `${BUSINESS_INFO.url}/logo.png`,
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
    isPartOf: {
      '@type': 'Blog',
      '@id': `${BUSINESS_INFO.url}/blog#blog`,
      name: `${BUSINESS_INFO.name} Blog`,
      url: `${BUSINESS_INFO.url}/blog`,
    },
    ...(post.category && {
      articleSection: post.category,
    }),
    ...(post.readingTime && {
      timeRequired: `PT${post.readingTime}M`,
    }),
    ...(post.wordCount && {
      wordCount: post.wordCount,
    }),
    ...(post.keywords && post.keywords.length > 0 && {
      keywords: post.keywords.join(', '),
    }),
    inLanguage: 'en-US',
  }
}

/**
 * Blog Schema - For the blog listing page
 * Represents the blog as a whole
 */
export function generateBlogSchema(blog: {
  name?: string
  description?: string
  url?: string
  posts?: Array<{
    title: string
    url: string
    datePublished: string
    image?: string
  }>
}) {
  const blogUrl = blog.url || `${BUSINESS_INFO.url}/blog`

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${blogUrl}#blog`,
    name: blog.name || `${BUSINESS_INFO.name} Blog`,
    description: blog.description || `Expert tips and insights on trash can cleaning, home hygiene, and pest prevention from ${BUSINESS_INFO.name}.`,
    url: blogUrl,
    publisher: {
      '@type': 'Organization',
      '@id': `${BUSINESS_INFO.url}/#business`,
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.url,
      logo: {
        '@type': 'ImageObject',
        url: `${BUSINESS_INFO.url}/logo.png`,
      },
    },
    inLanguage: 'en-US',
    ...(blog.posts && blog.posts.length > 0 && {
      blogPost: blog.posts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: post.url,
        datePublished: post.datePublished,
        ...(post.image && { image: post.image }),
      })),
    }),
  }
}

/**
 * CollectionPage Schema - For blog listing pages
 * Helps search engines understand paginated content
 */
export function generateCollectionPageSchema(page: {
  title: string
  description: string
  url: string
  numberOfItems?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${page.url}#webpage`,
    name: page.title,
    description: page.description,
    url: page.url,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${BUSINESS_INFO.url}/#website`,
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.url,
    },
    about: {
      '@type': 'Blog',
      '@id': `${BUSINESS_INFO.url}/blog#blog`,
    },
    ...(page.numberOfItems && {
      numberOfItems: page.numberOfItems,
    }),
    inLanguage: 'en-US',
  }
}

/**
 * ContactPage Schema - For the contact page
 * Helps search engines understand this is a contact page
 */
export function generateContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${BUSINESS_INFO.url}/contact#webpage`,
    name: `Contact ${BUSINESS_INFO.name}`,
    description: `Contact ${BUSINESS_INFO.name} for professional trash can cleaning services in ${BUSINESS_INFO.address.county}, Florida. Call ${BUSINESS_INFO.phone} or request a free quote online.`,
    url: `${BUSINESS_INFO.url}/contact`,
    mainEntity: {
      '@type': 'LocalBusiness',
      '@id': `${BUSINESS_INFO.url}/#business`,
      name: BUSINESS_INFO.name,
      telephone: BUSINESS_INFO.phoneRaw,
      email: BUSINESS_INFO.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS_INFO.address.street,
        addressLocality: BUSINESS_INFO.address.city,
        addressRegion: BUSINESS_INFO.address.state,
        postalCode: BUSINESS_INFO.address.zip,
        addressCountry: BUSINESS_INFO.address.country,
      },
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${BUSINESS_INFO.url}/#website`,
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.url,
    },
    inLanguage: 'en-US',
  }
}

/**
 * AboutPage Schema - For the about page
 */
export function generateAboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${BUSINESS_INFO.url}/about#webpage`,
    name: `About ${BUSINESS_INFO.name}`,
    description: `Learn about ${BUSINESS_INFO.name} - your trusted trash can cleaning service in ${BUSINESS_INFO.address.county}, Florida. Family-owned, eco-friendly, and committed to healthier communities.`,
    url: `${BUSINESS_INFO.url}/about`,
    mainEntity: {
      '@type': 'LocalBusiness',
      '@id': `${BUSINESS_INFO.url}/#business`,
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${BUSINESS_INFO.url}/#website`,
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.url,
    },
    inLanguage: 'en-US',
  }
}

/**
 * Services Page Schema with multiple services
 * Enhanced schema for the services listing page
 */
export function generateServicesPageSchema(services: ServiceInput[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BUSINESS_INFO.url}/services#webpage`,
    name: `Trash Can Cleaning Services | ${BUSINESS_INFO.name}`,
    description: `Professional trash can cleaning and sanitization services in ${BUSINESS_INFO.address.county}, FL. Residential, commercial, recurring, and deep clean options available.`,
    url: `${BUSINESS_INFO.url}/services`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          '@id': `${BUSINESS_INFO.url}/services#${service.name.toLowerCase().replace(/\s+/g, '-')}`,
          serviceType: service.name,
          name: service.name,
          description: service.description,
          provider: {
            '@type': 'LocalBusiness',
            '@id': `${BUSINESS_INFO.url}/#business`,
            name: BUSINESS_INFO.name,
          },
          areaServed: BUSINESS_INFO.areaServed.map((area) => ({
            '@type': 'City',
            name: area,
            containedInPlace: {
              '@type': 'AdministrativeArea',
              name: BUSINESS_INFO.address.county,
            },
          })),
          ...(service.price !== 'Custom' && {
            offers: {
              '@type': 'Offer',
              price: service.price.replace(/[$,]/g, ''),
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
            },
          }),
          ...(service.duration && {
            estimatedDuration: service.duration,
          }),
        },
      })),
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${BUSINESS_INFO.url}/#website`,
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.url,
    },
    inLanguage: 'en-US',
  }
}

/**
 * Organization Schema with enhanced local business info
 * Use for site-wide presence
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BUSINESS_INFO.url}/#organization`,
    name: BUSINESS_INFO.name,
    url: BUSINESS_INFO.url,
    logo: `${BUSINESS_INFO.url}/logo.png`,
    description: BUSINESS_INFO.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address.street,
      addressLocality: BUSINESS_INFO.address.city,
      addressRegion: BUSINESS_INFO.address.state,
      postalCode: BUSINESS_INFO.address.zip,
      addressCountry: BUSINESS_INFO.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS_INFO.phoneRaw,
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: 'English',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: BUSINESS_INFO.address.county,
    },
  }
}

/**
 * WebSite Schema - For site-wide SEO
 * Helps search engines understand site structure and enables sitelinks search box
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BUSINESS_INFO.url}/#website`,
    name: BUSINESS_INFO.name,
    url: BUSINESS_INFO.url,
    description: BUSINESS_INFO.description,
    publisher: {
      '@type': 'Organization',
      '@id': `${BUSINESS_INFO.url}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BUSINESS_INFO.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-US',
  }
}
