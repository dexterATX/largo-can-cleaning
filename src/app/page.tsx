import dynamic from 'next/dynamic'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'

// Lazy load below-fold components for better mobile performance
const Process = dynamic(() => import('@/components/sections/Process'), {
  loading: () => <div className="min-h-[400px]" />,
})

const Testimonials = dynamic(() => import('@/components/sections/Testimonials'), {
  loading: () => <div className="min-h-[400px]" />,
})

const CTA = dynamic(() => import('@/components/sections/CTA'), {
  loading: () => <div className="min-h-[200px]" />,
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
