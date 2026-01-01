import dynamic from 'next/dynamic'

// Lazy load Hero with priority loading - it's above the fold but still benefits from code splitting
const Hero = dynamic(() => import('@/components/sections/Hero'), {
  loading: () => (
    <section className="min-h-[100svh] flex items-center bg-gradient-dark">
      <div className="w-full max-w-4xl mx-auto text-center px-4 animate-pulse">
        <div className="h-8 w-64 bg-[var(--concrete-gray)]/50 rounded-full mx-auto mb-6" />
        <div className="h-16 w-full bg-[var(--concrete-gray)]/30 rounded-lg mb-4" />
        <div className="h-12 w-3/4 bg-[var(--concrete-gray)]/30 rounded-lg mx-auto mb-8" />
        <div className="flex justify-center gap-4">
          <div className="h-12 w-40 bg-[var(--safety-orange)]/50 rounded-lg" />
          <div className="h-12 w-40 bg-[var(--concrete-gray)]/50 rounded-lg" />
        </div>
      </div>
    </section>
  ),
})

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
  return (
    <div className="relative">
      <Hero />
      <Services />
      <WhyChooseUs />
      <Process />
      <Testimonials />
      <HomeFAQ />
      <CTA />
    </div>
  )
}
