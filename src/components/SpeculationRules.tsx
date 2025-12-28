'use client'

import Script from 'next/script'

const speculationRules = {
  prefetch: [
    {
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: '/admin/*' } },
          { not: { href_matches: '/api/*' } },
        ],
      },
      eagerness: 'moderate',
    },
  ],
  prerender: [
    {
      where: {
        or: [
          { href_matches: '/services' },
          { href_matches: '/pricing' },
          { href_matches: '/contact' },
        ],
      },
      eagerness: 'conservative',
    },
  ],
}

export default function SpeculationRules() {
  return (
    <Script
      id="speculation-rules"
      type="speculationrules"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(speculationRules) }}
    />
  )
}
