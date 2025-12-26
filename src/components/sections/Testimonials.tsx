'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Marquee } from '@/components/ui/marquee'

const reviews = [
  {
    name: 'Maria G.',
    location: 'Seminole, FL',
    body: "I can't believe I waited so long to try this service! My trash cans look and smell brand new.",
    img: 'https://i.pravatar.cc/150?img=32',
  },
  {
    name: 'James W.',
    location: 'Largo, FL',
    body: "As a property manager, I've signed up all 12 of my properties. The tenants love it!",
    img: 'https://i.pravatar.cc/150?img=11',
  },
  {
    name: 'Patricia C.',
    location: 'Clearwater, FL',
    body: 'We had a serious maggot problem in summer. One cleaning and the problem was gone!',
    img: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'Marcus J.',
    location: 'St. Petersburg, FL',
    body: "They show up, do their thing, and my cans are spotless. No more hosing them down myself.",
    img: 'https://i.pravatar.cc/150?img=53',
  },
  {
    name: 'Emily R.',
    location: 'Pinellas Park, FL',
    body: 'Our HOA was sending notices about dirty bins. After one visit, problem solved. 10/10!',
    img: 'https://i.pravatar.cc/150?img=23',
  },
  {
    name: 'Thomas A.',
    location: 'Dunedin, FL',
    body: "Best investment for my home. The smell from the garage is completely gone.",
    img: 'https://i.pravatar.cc/150?img=12',
  },
  {
    name: 'Rachel K.',
    location: 'Palm Harbor, FL',
    body: "Professional, on time, and thorough. My bins have never been this clean!",
    img: 'https://i.pravatar.cc/150?img=9',
  },
  {
    name: 'Brian M.',
    location: 'Safety Harbor, FL',
    body: "Worth every penny. No more raccoons digging through my trash at night.",
    img: 'https://i.pravatar.cc/150?img=68',
  },
]

const firstRow = reviews.slice(0, 4)
const secondRow = reviews.slice(4, 8)

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
        'relative cursor-pointer overflow-hidden rounded-xl border p-4 w-[280px] sm:w-[320px]',
        'border-[var(--steel-gray)]/30 bg-[var(--concrete-gray)]/50 hover:bg-[var(--concrete-gray)]'
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <Image
          src={img}
          alt={`${name}'s review`}
          width={40}
          height={40}
          className="rounded-full"
          loading="lazy"
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-[var(--slate-gray)]">{location}</p>
        </div>
        <div className="flex items-center gap-0.5 ml-auto" role="img" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-3 h-3 text-[var(--safety-orange)] fill-[var(--safety-orange)]"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
      <blockquote className="mt-3 text-sm text-[var(--light-gray)] leading-relaxed">{body}</blockquote>
    </figure>
  )
}

export default function Testimonials() {
  return (
    <section
      className="py-16 sm:py-24 bg-[var(--asphalt-dark)] relative overflow-hidden"
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

      {/* Horizontal Marquee - 3s duration */}
      <div className="relative flex flex-col gap-4 overflow-hidden">
        {/* First row - scrolls left */}
        <Marquee pauseOnHover className="[--duration:30s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>

        {/* Second row - scrolls right */}
        <Marquee reverse pauseOnHover className="[--duration:30s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>

        {/* Gradient overlays - left and right fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 sm:w-1/4 bg-gradient-to-r from-[var(--asphalt-dark)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 sm:w-1/4 bg-gradient-to-l from-[var(--asphalt-dark)]" />
      </div>

      {/* Google Reviews Badge */}
      <div className="flex justify-center mt-8">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[var(--concrete-gray)]/50 border border-[var(--steel-gray)]/30">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-[var(--safety-orange)] fill-[var(--safety-orange)]"
              />
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
