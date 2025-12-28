'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'

type CarouselItem = {
  id: string
  url: string
  title?: string
  description?: string
  alt?: string
}

interface DragCarouselProps {
  items: CarouselItem[]
  className?: string
}

export function DragCarousel({ items, className }: DragCarouselProps) {
  const [width, setWidth] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
    }
  }, [items])

  return (
    <div className={`w-full overflow-hidden ${className || ''}`}>
      <motion.div
        ref={carousel}
        drag="x"
        whileDrag={{ scale: 0.95 }}
        dragElastic={0.2}
        dragConstraints={{ right: 0, left: -width }}
        dragTransition={{ bounceDamping: 30 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex will-change-transform cursor-grab active:cursor-grabbing"
      >
        {items.map((item, index) => (
          <motion.div key={item.id || index} className="min-w-[20rem] min-h-[100px] p-2">
            <Image
              src={item.url}
              width={400}
              height={400}
              alt={item.alt || item.title || 'Largo Can Cleaning service image'}
              className="w-full h-full object-cover pointer-events-none rounded-md"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default DragCarousel
