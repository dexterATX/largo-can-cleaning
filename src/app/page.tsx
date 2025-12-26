import dynamic from 'next/dynamic'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'

// Lazy load below-fold components for better mobile performance
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'), {
  loading: () => <div className="min-h-[400px] bg-[var(--asphalt-dark)]" />,
})

const CTA = dynamic(() => import('@/components/sections/CTA'), {
  loading: () => <div className="min-h-[200px] bg-[var(--asphalt-black)]" />,
})

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Process />
      <Testimonials />
      <CTA />
    </>
  )
}
