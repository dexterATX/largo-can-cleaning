import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Marquee } from '@/components/ui/marquee'

// CSS-only star component - saves ~80KB vs SVG icons
function StarIcon({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return <span className={`star-icon star-icon-${size}`} aria-hidden="true" />
}

const reviews = [
  {
    name: 'Maria G.',
    location: 'Seminole, FL',
    body: "Can't believe I waited so long to try this service! My trash cans look brand new and smell fresh. Highly recommend to everyone.",
    img: 'https://i.pravatar.cc/150?img=32',
  },
  {
    name: 'James W.',
    location: 'Largo, FL',
    body: "Signed up all 12 of my rental properties. The tenants love it and I don't get complaints about smelly bins anymore!",
    img: 'https://i.pravatar.cc/150?img=11',
  },
  {
    name: 'Patricia C.',
    location: 'Clearwater, FL',
    body: "Had a horrible maggot problem in my bins. One cleaning and it was completely gone. These guys are lifesavers!",
    img: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'Marcus J.',
    location: 'Belleair, FL',
    body: "Super easy service. They show up right after trash pickup, do their thing, and my cans are spotless every time.",
    img: 'https://i.pravatar.cc/150?img=53',
  },
  {
    name: 'Emily R.',
    location: 'Pinellas Park, FL',
    body: "My HOA was complaining about dirty bins on the street. Problem solved! Now my bins are the cleanest in the neighborhood.",
    img: 'https://i.pravatar.cc/150?img=23',
  },
  {
    name: 'Thomas A.',
    location: 'Dunedin, FL',
    body: "Best investment for my home. No more awful garage smell when I store the bins inside. Worth every single penny.",
    img: 'https://i.pravatar.cc/150?img=12',
  },
  {
    name: 'Rachel K.',
    location: 'Palm Harbor, FL',
    body: "Professional, thorough, and on time every month. My bins have never been cleaner. Five stars all the way!",
    img: 'https://i.pravatar.cc/150?img=9',
  },
  {
    name: 'Brian M.',
    location: 'Safety Harbor, FL',
    body: "Worth every penny! No more raccoons digging through my trash at night. The sanitizing really makes a difference.",
    img: 'https://i.pravatar.cc/150?img=68',
  },
]

const firstRow = reviews.slice(0, 2)
const secondRow = reviews.slice(2, 4)
const thirdRow = reviews.slice(4, 6)
const fourthRow = reviews.slice(6, 8)

function ReviewCard({
  img,
  name,
  location,
  body,
}: {
  img: string
  name: string
  location: string
  body: string
}) {
  return (
    <figure
      className={cn(
        'relative cursor-pointer overflow-hidden rounded-xl p-2.5',
        'w-28 backdrop-blur-sm',
        'bg-white/5 hover:bg-white/10 transition-colors'
      )}
    >
      {/* Author at top */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-full bg-[var(--safety-orange)]/20 flex-shrink-0 overflow-hidden">
          <Image
            src={img}
            alt={`${name} from ${location} - satisfied Largo Can Cleaning customer`}
            width={20}
            height={20}
            className="rounded-full w-full h-full object-cover"
            loading="lazy"
            unoptimized
          />
        </div>
        <div>
          <figcaption className="text-[9px] font-medium text-white leading-tight">
            {name}
          </figcaption>
          <div className="flex items-center gap-px" role="img" aria-label="5 star rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} size="sm" />
            ))}
          </div>
        </div>
      </div>

      {/* Quote */}
      <blockquote className="text-[9px] leading-relaxed text-white/60 line-clamp-6">
        {body}
      </blockquote>
    </figure>
  )
}

export default function Testimonials() {
  return (
    <section
      className="py-5 sm:py-24 bg-[var(--asphalt-dark)] relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--safety-orange)]/20 to-transparent" />

      {/* Section Header */}
      <div className="text-center mb-12 px-4">
        <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--safety-orange)] bg-[var(--safety-orange)]/10 rounded-full">
          Testimonials
        </span>
        <h2
          id="testimonials-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
        >
          What Our Customers Say
        </h2>
        <p className="text-[var(--slate-gray)] max-w-2xl mx-auto">
          Join hundreds of satisfied customers across Pinellas County.
        </p>
      </div>

      {/* 3D Marquee */}
      <div className="relative flex h-[350px] sm:h-[450px] w-full flex-row items-center justify-center gap-3 overflow-hidden [perspective:300px]">
        <div
          className="flex flex-row items-center gap-3"
          style={{
            transform:
              'translateX(-30px) translateY(0px) translateZ(-50px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
          }}
        >
          <Marquee vertical repeat={2} className="[--duration:25s] [--gap:0.75rem] !p-0">
            {firstRow.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </Marquee>
          <Marquee vertical repeat={2} className="[--duration:25s] [--gap:0.75rem] !p-0 [&>div]:![animation-direction:reverse] [&>div]:![animation-delay:-5s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </Marquee>
          <Marquee vertical repeat={2} className="[--duration:25s] [--gap:0.75rem] !p-0 [&>div]:![animation-delay:-10s]">
            {thirdRow.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </Marquee>
          <Marquee vertical repeat={2} className="[--duration:25s] [--gap:0.75rem] !p-0 [&>div]:![animation-direction:reverse] [&>div]:![animation-delay:-3s]">
            {fourthRow.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </Marquee>
        </div>

        {/* Gradient overlays - larger fade zones for smooth card transitions */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[var(--asphalt-dark)] via-[var(--asphalt-dark)]/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--asphalt-dark)] via-[var(--asphalt-dark)]/50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[var(--asphalt-dark)] via-[var(--asphalt-dark)]/50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[var(--asphalt-dark)] via-[var(--asphalt-dark)]/50 to-transparent" />
      </div>

      {/* Google Reviews Badge */}
      <div className="flex justify-center mt-8">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[var(--concrete-gray)]/50 border border-[var(--steel-gray)]/30">
          <div className="flex items-center gap-1" role="img" aria-label="5 out of 5 stars rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} size="md" />
            ))}
          </div>
          <span className="text-sm text-[var(--light-gray)]">
            <strong className="text-white">5.0</strong> rating on Google
          </span>
        </div>
      </div>
    </section>
  )
}
