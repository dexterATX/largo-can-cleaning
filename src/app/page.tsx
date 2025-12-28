import dynamic from 'next/dynamic'
import Hero from '@/components/sections/Hero'
import { generateFAQSchema } from '@/lib/faqSchema'

// Lazy load all below-fold components for better initial load performance
const Services = dynamic(() => import('@/components/sections/Services'), {
  loading: () => <div className="min-h-[500px] bg-[var(--asphalt-dark)]" />,
})

const Process = dynamic(() => import('@/components/sections/Process'), {
  loading: () => <div className="min-h-[400px] bg-[var(--asphalt-dark)]" />,
})

const WhyChooseUs = dynamic(() => import('@/components/sections/WhyChooseUs'), {
  loading: () => <div className="min-h-[400px] bg-[var(--asphalt-black)]" />,
})

const Testimonials = dynamic(() => import('@/components/sections/Testimonials'), {
  loading: () => <div className="min-h-[400px] bg-[var(--asphalt-dark)]" />,
})

const HomeFAQ = dynamic(() => import('@/components/sections/HomeFAQ'), {
  loading: () => <div className="min-h-[300px] bg-[var(--asphalt-dark)]" />,
})

const CTA = dynamic(() => import('@/components/sections/CTA'), {
  loading: () => <div className="min-h-[200px] bg-[var(--asphalt-black)]" />,
})

export default function HomePage() {
  const faqSchema = generateFAQSchema()

  return (
    <>
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Hero />
      <Services />
      <WhyChooseUs />
      <Process />
      <Testimonials />
      <HomeFAQ />
      <CTA />
    </>
  )
}
