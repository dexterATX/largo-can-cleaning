'use client'

import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react'
import { motion, AnimatePresence, PanInfo } from 'motion/react'
import Image from 'next/image'
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
  Grid3X3,
  AlertCircle,
} from 'lucide-react'
import Container from '@/components/ui/Container'
import Masonry from '@/components/Masonry'
import { cn } from '@/lib/utils'

// ============================================
// GALLERY DATA
// ============================================

const categories = [
  { id: 'all', label: 'All', icon: Grid3X3 },
  { id: 'before-after', label: 'Before & After' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'process', label: 'Process' },
]

// Using placeholder images for demo - replace with actual images
const galleryImages = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=900&fit=crop',
    height: 600,
    title: 'Sparkling Clean Result',
    category: 'before-after',
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=800&fit=crop',
    height: 520,
    title: 'Residential Bin Cleaning',
    category: 'residential',
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=850&fit=crop',
    height: 560,
    title: 'Deep Clean Process',
    category: 'process',
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=750&fit=crop',
    height: 480,
    title: 'Commercial Dumpster Service',
    category: 'commercial',
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=900&fit=crop',
    height: 620,
    title: 'Before & After Transformation',
    category: 'before-after',
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=800&fit=crop',
    height: 500,
    title: 'High-Pressure Wash',
    category: 'process',
  },
  {
    id: 7,
    img: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=850&fit=crop',
    height: 580,
    title: 'Neighborhood Service',
    category: 'residential',
  },
  {
    id: 8,
    img: 'https://images.unsplash.com/photo-1581578017093-cd30fce4ecd7?w=600&h=750&fit=crop',
    height: 460,
    title: 'Restaurant Bin Cleaning',
    category: 'commercial',
  },
  {
    id: 9,
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=800&fit=crop',
    height: 540,
    title: 'Sanitization Complete',
    category: 'before-after',
  },
  {
    id: 10,
    img: 'https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&h=900&fit=crop',
    height: 600,
    title: 'Eco-Friendly Cleaning',
    category: 'process',
  },
  {
    id: 11,
    img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=750&fit=crop',
    height: 480,
    title: 'Weekly Service Client',
    category: 'residential',
  },
  {
    id: 12,
    img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=850&fit=crop',
    height: 560,
    title: 'HOA Community Service',
    category: 'commercial',
  },
  {
    id: 13,
    img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&h=900&fit=crop',
    height: 620,
    title: 'Complete Sanitization',
    category: 'before-after',
  },
  {
    id: 14,
    img: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&h=800&fit=crop',
    height: 520,
    title: 'Curbside Pickup Ready',
    category: 'residential',
  },
  {
    id: 15,
    img: 'https://images.unsplash.com/photo-1580256081112-e49377338b7f?w=600&h=850&fit=crop',
    height: 580,
    title: 'Steam Cleaning Method',
    category: 'process',
  },
  {
    id: 16,
    img: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&h=750&fit=crop',
    height: 460,
    title: 'Office Complex Service',
    category: 'commercial',
  },
  {
    id: 17,
    img: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=900&fit=crop',
    height: 600,
    title: 'Dramatic Transformation',
    category: 'before-after',
  },
  {
    id: 18,
    img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=800&fit=crop',
    height: 540,
    title: 'Suburban Home Service',
    category: 'residential',
  },
  {
    id: 19,
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=850&fit=crop',
    height: 560,
    title: 'Deodorizing Treatment',
    category: 'process',
  },
  {
    id: 20,
    img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=750&fit=crop',
    height: 500,
    title: 'Shopping Center Bins',
    category: 'commercial',
  },
  {
    id: 21,
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=900&fit=crop',
    height: 620,
    title: 'Fresh & Clean Results',
    category: 'before-after',
  },
  {
    id: 22,
    img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=800&fit=crop',
    height: 520,
    title: 'Monthly Subscription',
    category: 'residential',
  },
  {
    id: 23,
    img: 'https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&h=850&fit=crop',
    height: 580,
    title: 'Equipment Setup',
    category: 'process',
  },
  {
    id: 24,
    img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=750&fit=crop',
    height: 480,
    title: 'Industrial Cleaning',
    category: 'commercial',
  },
]

// ============================================
// MOBILE LIGHTBOX WITH SWIPE GESTURES
// ============================================

interface LightboxProps {
  images: typeof galleryImages
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  onGoToIndex: (index: number) => void
}

// Memoized Lightbox component to prevent unnecessary re-renders
const Lightbox = memo(function Lightbox({ images, currentIndex, isOpen, onClose, onNext, onPrev, onGoToIndex }: LightboxProps) {
  const currentImage = images[currentIndex]
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null)
  const [imageError, setImageError] = useState(false)
  const constraintsRef = useRef(null)

  // Reset image error when image changes
  useEffect(() => {
    setImageError(false)
  }, [currentIndex])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onNext, onPrev])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle swipe gesture
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50 // Minimum swipe distance
    const velocity = 0.5 // Minimum velocity

    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocity) {
      if (info.offset.x > 0) {
        onPrev()
      } else {
        onNext()
      }
    }
    setDragDirection(null)
  }

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 20) {
      setDragDirection('right')
    } else if (info.offset.x < -20) {
      setDragDirection('left')
    } else {
      setDragDirection(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-black"
          ref={constraintsRef}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 lg:p-6">
            {/* Image Counter */}
            <div className="flex items-center gap-2">
              <span className="text-white/90 text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </span>
            </div>

            {/* Close Button - 48x48 touch target */}
            <button
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Image Container with Swipe */}
          <div className="flex-1 relative overflow-hidden">
            {/* Swipe Direction Indicators - Mobile Only */}
            <div className="absolute inset-y-0 left-0 w-16 z-10 flex items-center justify-start pl-2 lg:hidden">
              <motion.div
                animate={{ opacity: dragDirection === 'right' ? 1 : 0, x: dragDirection === 'right' ? 0 : -10 }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </motion.div>
            </div>
            <div className="absolute inset-y-0 right-0 w-16 z-10 flex items-center justify-end pr-2 lg:hidden">
              <motion.div
                animate={{ opacity: dragDirection === 'left' ? 1 : 0, x: dragDirection === 'left' ? 0 : 10 }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </motion.div>
            </div>

            {/* Desktop Navigation Buttons */}
            <button
              onClick={onPrev}
              className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              onClick={onNext}
              className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Swipeable Image */}
            <motion.div
              key={currentImage.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              className="w-full h-full flex items-center justify-center px-4 lg:px-20 cursor-grab active:cursor-grabbing"
            >
              {imageError ? (
                <div className="flex items-center justify-center text-[var(--slate-gray)]">
                  <AlertCircle className="w-8 h-8 mr-2" />
                  Failed to load image
                </div>
              ) : (
                <Image
                  src={currentImage.img}
                  alt={currentImage.title}
                  width={800}
                  height={1000}
                  onError={() => setImageError(true)}
                  className="max-w-full max-h-full object-contain rounded-xl lg:rounded-2xl select-none pointer-events-none"
                  draggable={false}
                  loading="lazy"
                />
              )}
            </motion.div>
          </div>

          {/* Mobile Caption Footer */}
          <div className="p-4 lg:p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="max-w-xl mx-auto text-center">
              <span className="inline-block px-3 py-1 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--safety-orange)] bg-[var(--safety-orange)]/10 rounded-full">
                {categories.find(c => c.id === currentImage.category)?.label || currentImage.category}
              </span>
              <h3 className="text-white font-semibold text-lg">{currentImage.title}</h3>
            </div>

            {/* Swipe Hint - Mobile Only */}
            <div className="flex items-center justify-center gap-2 mt-4 lg:hidden">
              <ChevronLeft className="w-4 h-4 text-white/40" />
              <span className="text-xs text-white/40">Swipe to navigate</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </div>
          </div>

          {/* Image Progress Indicator - Tick Style */}
          <div className="absolute bottom-28 lg:bottom-24 left-0 right-0 flex justify-center px-6">
            <div className="flex flex-col items-center gap-3">
              {/* Tick Track */}
              <div className="flex items-center gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onGoToIndex(index)}
                    className="group relative flex items-center justify-center py-2"
                    aria-label={`Go to image ${index + 1}`}
                  >
                    {/* Tick Mark */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: currentIndex === index ? 16 : 8,
                        width: currentIndex === index ? 3 : 2,
                        backgroundColor: currentIndex === index
                          ? 'var(--safety-orange)'
                          : index < currentIndex
                            ? 'rgba(255, 107, 0, 0.5)'
                            : 'rgba(255, 255, 255, 0.2)',
                      }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="rounded-full"
                    />
                    {/* Active Glow */}
                    {currentIndex === index && (
                      <motion.div
                        layoutId="tick-glow"
                        className="absolute inset-0 -m-1 rounded-full bg-[var(--safety-orange)]/20 blur-sm"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </button>
                ))}
              </div>
              {/* Counter Text */}
              <div className="flex items-center gap-2 text-[10px] font-medium">
                <span className="text-[var(--safety-orange)]">
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-white/30">/</span>
                <span className="text-white/40">
                  {String(images.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

// ============================================
// MOBILE GALLERY GRID (2-column card layout)
// ============================================

interface MobileGalleryProps {
  images: typeof galleryImages
  onImageClick: (image: typeof galleryImages[0], index: number) => void
}

// Memoized MobileGallery component to prevent unnecessary re-renders
const MobileGallery = memo(function MobileGallery({ images, onImageClick }: MobileGalleryProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((image, index) => (
        <motion.button
          key={image.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.02, duration: 0.2 }}
          onClick={() => onImageClick(image, index)}
          className="relative overflow-hidden bg-[var(--concrete-gray)] group active:opacity-80 transition-opacity duration-150 touch-manipulation rounded-lg border border-[var(--steel-gray)]/30"
        >
          {/* Image */}
          <div className="relative aspect-[4/5]">
            <Image
              src={image.img}
              alt={image.title}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover"
              loading="lazy"
            />

            {/* Gradient for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            {/* Index - top right */}
            <span className="absolute top-2 right-2 text-[10px] font-semibold text-white/70 tabular-nums drop-shadow-sm">
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5">
              <p className="text-white text-xs font-semibold truncate leading-tight drop-shadow-sm">
                {image.title}
              </p>
              <p className="text-[10px] text-white/70 uppercase tracking-wide mt-1">
                {categories.find(c => c.id === image.category)?.label || image.category}
              </p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  )
})

// ============================================
// STICKY MOBILE CATEGORY FILTER
// ============================================

function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string
  onCategoryChange: (category: string) => void
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll active category into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeButton = scrollContainerRef.current.querySelector('[data-active="true"]')
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [activeCategory])

  const [canScrollRight, setCanScrollRight] = useState(true)

  // Check if there's more content to scroll to on the right - memoized to prevent recreation
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      // Show indicator if not scrolled to the end (with 20px buffer)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20)
    }
  }, [])

  // Check on mount
  useEffect(() => {
    handleScroll()
  }, [handleScroll])

  return (
    <div className="sticky top-16 z-20 -mx-4 py-3 bg-[var(--asphalt-dark)]/95 backdrop-blur-md border-b border-[var(--steel-gray)]/10 lg:relative lg:top-0 lg:mx-0 lg:bg-transparent lg:border-0 lg:backdrop-blur-none lg:py-0 lg:mb-2">
      {/* Mobile: Horizontal Scroll with Fade Edges */}
      <div className="relative">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[var(--asphalt-dark)] to-transparent z-10 pointer-events-none lg:hidden" />

        {/* Right Fade with Scroll Indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-[var(--asphalt-dark)] via-[var(--asphalt-dark)]/80 to-transparent z-10 pointer-events-none lg:hidden flex items-center justify-end pr-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={canScrollRight ? {
              x: [0, 4, 0],
              opacity: 1,
            } : { opacity: 0, x: 0 }}
            transition={{
              x: {
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              opacity: { duration: 0.2 }
            }}
            className="flex items-center gap-0.5"
          >
            <ChevronRight className="w-5 h-5 text-[var(--safety-orange)]" />
          </motion.div>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-2.5 overflow-x-auto scrollbar-hide px-5 pr-14 lg:px-0 lg:pr-0 lg:flex-wrap lg:justify-center lg:overflow-visible"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => {
            const isActive = activeCategory === category.id
            return (
              <button
                key={category.id}
                data-active={isActive}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  // Base - proper sizing and spacing
                  'flex-shrink-0 h-11 px-5 rounded-full text-sm font-medium transition-all duration-200',
                  'flex items-center gap-2 justify-center whitespace-nowrap',
                  // Active state
                  isActive
                    ? 'bg-[var(--safety-orange)] text-white shadow-lg shadow-[var(--safety-orange)]/25'
                    : 'bg-[var(--concrete-gray)]/50 text-[var(--light-gray)] active:bg-[var(--concrete-gray)]/70 border border-[var(--steel-gray)]/10',
                  // Desktop hover
                  !isActive && 'lg:hover:bg-[var(--concrete-gray)]/60 lg:hover:text-white lg:hover:border-[var(--steel-gray)]/20'
                )}
              >
                {category.icon && <category.icon className="w-4 h-4" />}
                <span>{category.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Swipe Hint Text - Mobile Only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: canScrollRight ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center gap-1.5 mt-2 lg:hidden"
      >
        <span className="text-[10px] text-[var(--slate-gray)]/60">Swipe for more</span>
        <ChevronRight className="w-3 h-3 text-[var(--slate-gray)]/60" />
      </motion.div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function GalleryPageContent() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Filter images by category - memoized for performance
  const filteredImages = useMemo(() => {
    return activeCategory === 'all'
      ? galleryImages
      : galleryImages.filter(img => img.category === activeCategory)
  }, [activeCategory])

  // Lightbox handlers
  const openLightbox = useCallback((item: { id: string | number }) => {
    const index = filteredImages.findIndex(img => img.id === item.id)
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }, [filteredImages])

  const openLightboxAtIndex = useCallback((item: { id: string | number }, index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length)
  }, [filteredImages.length])

  const goToPrev = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)
  }, [filteredImages.length])

  const goToIndex = useCallback((index: number) => {
    setCurrentImageIndex(index)
  }, [])

  return (
    <div className="relative bg-[var(--asphalt-dark)] min-h-screen overflow-hidden">
      {/* Hero Section - Compact on Mobile */}
      <section className="relative pt-24 pb-6 lg:pt-36 lg:pb-12 overflow-hidden bg-gradient-dark">
        {/* Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 lg:opacity-50" />
        <div className="absolute top-1/4 -left-32 w-48 h-48 lg:w-96 lg:h-96 bg-[var(--safety-orange)]/10 rounded-full blur-[80px] lg:blur-[100px]" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge - Smaller on Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-4 lg:mb-6 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20"
            >
              <Camera className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[var(--safety-orange)]" />
              <span className="text-xs lg:text-sm font-medium text-[var(--safety-orange)]">
                See Our Results
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl lg:text-5xl font-bold tracking-tight mb-3 lg:mb-4"
            >
              <span className="text-white">Our </span>
              <span className="text-gradient-orange">Gallery</span>
            </motion.h1>

            {/* Subtitle - Shorter on Mobile */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm lg:text-lg text-[var(--light-gray)] max-w-md lg:max-w-xl mx-auto"
            >
              <span className="lg:hidden">Before & after photos of our cleaning results.</span>
              <span className="hidden lg:inline">See the transformation. Before and after photos showcasing our professional cleaning results.</span>
            </motion.p>

            {/* Stats - Hidden on Mobile for Cleaner Look */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:flex items-center justify-center gap-10 mt-8"
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--safety-orange)]">500+</p>
                <p className="text-sm text-[var(--slate-gray)]">Bins Cleaned</p>
              </div>
              <div className="w-px h-10 bg-[var(--steel-gray)]/30" />
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--safety-orange)]">100%</p>
                <p className="text-sm text-[var(--slate-gray)]">Satisfaction</p>
              </div>
              <div className="w-px h-10 bg-[var(--steel-gray)]/30" />
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--safety-orange)]">99.9%</p>
                <p className="text-sm text-[var(--slate-gray)]">Bacteria Killed</p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Gallery Content */}
      <section className="pb-8 lg:py-16 bg-[var(--asphalt-dark)]">
        {/* Mobile: Use Container */}
        <div className="lg:hidden">
          <Container>
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            <div className="flex items-center justify-between py-4">
              <p className="text-xs text-[var(--slate-gray)]">
                {filteredImages.length} {filteredImages.length === 1 ? 'photo' : 'photos'}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[var(--slate-gray)]">
                <Eye className="w-3.5 h-3.5" />
                <span>Tap to view</span>
              </div>
            </div>
            <motion.div
              key={`mobile-${activeCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filteredImages.length > 0 ? (
                <MobileGallery
                  images={filteredImages}
                  onImageClick={openLightboxAtIndex}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Camera className="w-10 h-10 text-[var(--steel-gray)] mb-3" />
                  <p className="text-base font-medium text-white mb-1">No photos found</p>
                  <p className="text-xs text-[var(--slate-gray)]">
                    Try selecting a different category
                  </p>
                </div>
              )}
            </motion.div>
          </Container>
        </div>

        {/* Desktop: Expanded Width with Even Padding */}
        <div className="hidden lg:block">
          {/* Filter - centered */}
          <div className="px-12 xl:px-20 2xl:px-32 mb-6">
            <div className="flex justify-center mb-6">
              <CategoryFilter
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--slate-gray)]">
                {filteredImages.length} {filteredImages.length === 1 ? 'photo' : 'photos'}
              </p>
              <div className="flex items-center gap-1.5 text-sm text-[var(--slate-gray)]">
                <Eye className="w-4 h-4" />
                <span>Click to enlarge</span>
              </div>
            </div>
          </div>

          {/* Masonry - Full width with equal side padding */}
          <div className="px-12 xl:px-20 2xl:px-32">
            <motion.div
              key={`desktop-${activeCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ minHeight: '600px' }}
            >
              {filteredImages.length > 0 ? (
                <Masonry
                  items={filteredImages}
                  animateFrom="bottom"
                  stagger={0.04}
                  scaleOnHover={true}
                  hoverScale={0.97}
                  blurToFocus={true}
                  onItemClick={openLightbox}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <Camera className="w-12 h-12 text-[var(--steel-gray)] mb-4" />
                  <p className="text-lg font-medium text-white mb-2">No photos found</p>
                  <p className="text-sm text-[var(--slate-gray)]">
                    Try selecting a different category
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Simplified on Mobile */}
      <section className="py-8 lg:py-16 bg-[var(--asphalt-dark)]">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="p-5 lg:p-10 rounded-2xl bg-gradient-to-br from-[var(--safety-orange)]/20 to-[var(--safety-orange)]/5 border border-[var(--safety-orange)]/20">
              <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-[var(--safety-orange)] mx-auto mb-3 lg:mb-4" />
              <h3 className="text-lg lg:text-2xl font-bold text-white mb-1.5 lg:mb-2">
                Ready for Your Transformation?
              </h3>
              <p className="text-xs lg:text-base text-[var(--slate-gray)] mb-4 lg:mb-6">
                Get your bins looking brand new today.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center h-12 px-6 bg-[var(--safety-orange)] text-white font-semibold rounded-xl active:scale-[0.98] transition-transform lg:hover:bg-[var(--safety-orange-dark)]"
              >
                Get Free Quote
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Lightbox */}
      <Lightbox
        images={filteredImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={goToNext}
        onPrev={goToPrev}
        onGoToIndex={goToIndex}
      />
    </div>
  )
}
