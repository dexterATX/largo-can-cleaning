// FAQ Schema for homepage - separate from client component for SSR compatibility
// Pre-generated at module level for optimal SSR performance

const faqs = [
  {
    question: 'How often should trash cans be cleaned?',
    answer: 'For most Florida households, monthly cleaning is ideal due to our heat and humidity which accelerate bacteria growth. If you dispose of diapers, pet waste, or food scraps regularly, bi-weekly service helps prevent odors and pest problems between cleanings.',
  },
  {
    question: 'Do I need to be home during the cleaning?',
    answer: 'No, you do not need to be home. We clean right after your scheduled trash pickup when bins are empty at the curb. Simply leave your bins out, and we will return them sanitized to your driveway. You will receive a text notification when the job is complete.',
  },
  {
    question: 'Is professional trash can cleaning worth the cost?',
    answer: 'Most customers find it pays for itself quickly. Regular sanitization eliminates disease-causing bacteria like E. coli and Salmonella, prevents maggot infestations, removes foul odors from your garage, and reduces pest attraction. Many customers report lower pest control costs after starting service.',
  },
  {
    question: 'What temperature water do you use?',
    answer: 'Our truck-mounted system heats water to 190 degrees Fahrenheit, which is hot enough to kill 99.9 percent of bacteria, dissolve grease and grime, and eliminate odor-causing organisms. This temperature far exceeds what any garden hose or DIY cleaning can achieve.',
  },
]

// Pre-generated FAQ schema - computed once at module load, not on each request
const FAQ_SCHEMA = {
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
} as const

export function generateFAQSchema() {
  return FAQ_SCHEMA
}

export { faqs }
