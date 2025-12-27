'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Marquee } from '@/components/ui/marquee'

const reviews = [
  {
    name: 'Maria G.',
    location: 'Seminole, FL',
    body: "Can't believe I waited so long! My trash cans look brand new.",
    img: 'https://i.pravatar.cc/150?img=32',
  },
  {
    name: 'James W.',
    location: 'Largo, FL',
    body: "Signed up all 12 of my properties. The tenants love it!",
    img: 'https://i.pravatar.cc/150?img=11',
  },
  {
    name: 'Patricia C.',
    location: 'Clearwater, FL',
    body: 'Had a maggot problem. One cleaning and it was gone!',
    img: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'Marcus J.',
    location: 'St. Petersburg, FL',
    body: "They show up, do their thing, and my cans are spotless.",
    img: 'https://i.pravatar.cc/150?img=53',
  },
  {
    name: 'Emily R.',
    location: 'Pinellas Park, FL',
    body: 'HOA was complaining about dirty bins. Problem solved!',
    img: 'https://i.pravatar.cc/150?img=23',
  },
  {
    name: 'Thomas A.',
    location: 'Dunedin, FL',
    body: "Best investment for my home. No more garage smell.",
    img: 'https://i.pravatar.cc/150?img=12',
  },
  {
    name: 'Rachel K.',
    location: 'Palm Harbor, FL',
    body: "Professional and thorough. My bins have never been cleaner!",
    img: 'https://i.pravatar.cc/150?img=9',
  },
  {
    name: 'Brian M.',
    location: 'Safety Harbor, FL',
    body: "Worth every penny. No more raccoons at night.",
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
        <Image
          src={img}
          alt={name}
          width={20}
          height={20}
          className="rounded-full"
          loading="lazy"
        />
        <div>
          <figcaption className="text-[9px] font-medium text-white leading-tight">
            {name}
          </figcaption>
          <div className="flex items-center gap-px">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-2 h-2 text-[var(--safety-orange)] fill-[var(--safety-orange)]"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quote */}
      <blockquote className="text-[9px] leading-relaxed text-white/60 line-clamp-4">
        {body}
      </blockquote>
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

      {/* 3D Marquee */}
      <div className="relative flex h-[350px] sm:h-[450px] w-full flex-row items-center justify-center gap-3 overflow-hidden [perspective:300px]">
        <div
          className="flex flex-row items-center gap-3"
          style={{
            transform:
              'translateX(-30px) translateY(0px) translateZ(-50px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
          }}
        >
          <Marquee pauseOnHover vertical className="[--duration:25s] [--gap:0.75rem] !p-0">
            {firstRow.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover vertical className="[--duration:25s] [--gap:0.75rem] !p-0">
            {secondRow.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover vertical className="[--duration:25s] [--gap:0.75rem] !p-0">
            {thirdRow.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </Marquee>
          <Marquee pauseOnHover vertical className="[--duration:25s] [--gap:0.75rem] !p-0">
            {fourthRow.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </Marquee>
        </div>

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[var(--asphalt-dark)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[var(--asphalt-dark)]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[var(--asphalt-dark)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[var(--asphalt-dark)]" />
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
