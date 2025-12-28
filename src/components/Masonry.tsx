'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState, memo, useCallback } from 'react'
import { gsap } from 'gsap'
import { useIsMobile } from '@/hooks/useReducedMotion'
import './Masonry.css'

interface MasonryItem {
  id: string | number
  img: string
  height: number
  title?: string
  category?: string
  alt?: string
}

interface MasonryProps {
  items: MasonryItem[]
  ease?: string
  duration?: number
  stagger?: number
  animateFrom?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'random'
  scaleOnHover?: boolean
  hoverScale?: number
  blurToFocus?: boolean
  colorShiftOnHover?: boolean
  onItemClick?: (item: MasonryItem) => void
}

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue
    return values[queries.findIndex(q => window.matchMedia(q).matches)] ?? defaultValue
  }

  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    // Set initial value on mount
    setValue(get())

    const handler = () => setValue(get())
    queries.forEach(q => window.matchMedia(q).addEventListener('change', handler))
    return () => queries.forEach(q => window.matchMedia(q).removeEventListener('change', handler))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries])

  return value
}

const useMeasure = (): [React.RefObject<HTMLDivElement | null>, { width: number; height: number }] => {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return [ref, size]
}

const preloadImages = async (urls: string[]) => {
  await Promise.all(
    urls.map(
      src =>
        new Promise(resolve => {
          const img = new Image()
          img.src = src
          img.onload = img.onerror = () => resolve(undefined)
        })
    )
  )
}

interface GridItem extends MasonryItem {
  x: number
  y: number
  w: number
  h: number
}

const Masonry = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  onItemClick
}: MasonryProps) => {
  const isMobile = useIsMobile()

  // Disable blur on mobile for better performance
  const shouldBlur = blurToFocus && !isMobile
  // Reduce stagger on mobile for faster perceived loading
  const mobileStagger = isMobile ? stagger * 0.5 : stagger

  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [4, 3, 2, 2],
    1
  )

  const [containerRef, { width }] = useMeasure()
  const [imagesReady, setImagesReady] = useState(false)

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return { x: item.x, y: item.y }

    let direction = animateFrom

    if (animateFrom === 'random') {
      const directions: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right']
      direction = directions[Math.floor(Math.random() * directions.length)]
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 }
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 }
      case 'left':
        return { x: -200, y: item.y }
      case 'right':
        return { x: window.innerWidth + 200, y: item.y }
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2
        }
      default:
        return { x: item.x, y: item.y + 100 }
    }
  }

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true))
  }, [items])

  const { grid, containerHeight } = useMemo((): { grid: GridItem[], containerHeight: number } => {
    if (!width) return { grid: [], containerHeight: 400 }

    const colHeights = new Array(columns).fill(0)
    const columnWidth = width / columns

    const gridItems = items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const x = columnWidth * col
      const height = child.height / 2
      const y = colHeights[col]

      colHeights[col] += height

      return { ...child, x, y, w: columnWidth, h: height }
    })

    // Get the tallest column height
    const maxHeight = Math.max(...colHeights)

    return { grid: gridItems, containerHeight: maxHeight }
  }, [columns, items, width])

  const hasMounted = useRef(false)

  useLayoutEffect(() => {
    if (!imagesReady) return

    const selectors: string[] = []

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`
      selectors.push(selector)
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h
      }

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item)
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(shouldBlur && { filter: 'blur(10px)' })
        }

        gsap.fromTo(selector, initialState, {
          opacity: 1,
          ...animationProps,
          ...(shouldBlur && { filter: 'blur(0px)' }),
          duration: isMobile ? 0.5 : 0.8,
          ease: 'power3.out',
          delay: index * mobileStagger
        })
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration: duration,
          ease: ease,
          overwrite: 'auto'
        })
      }
    })

    hasMounted.current = true

    // Cleanup: kill all tweens for the animated elements on unmount
    return () => {
      selectors.forEach((selector) => {
        gsap.killTweensOf(selector)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady, mobileStagger, animateFrom, shouldBlur, duration, ease, isMobile])

  // Memoized event handlers to prevent recreation on each render
  const handleMouseEnter = useCallback((e: React.MouseEvent, item: GridItem) => {
    const element = e.currentTarget
    const selector = `[data-key="${item.id}"]`

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay')
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.3,
          duration: 0.3
        })
      }
    }
  }, [scaleOnHover, hoverScale, colorShiftOnHover])

  const handleMouseLeave = useCallback((e: React.MouseEvent, item: GridItem) => {
    const element = e.currentTarget
    const selector = `[data-key="${item.id}"]`

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay')
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3
        })
      }
    }
  }, [scaleOnHover, colorShiftOnHover])

  const handleClick = useCallback((item: GridItem) => {
    if (onItemClick) {
      onItemClick(item)
    }
  }, [onItemClick])

  return (
    <div
      ref={containerRef}
      className="masonry-list"
      style={{ height: containerHeight > 0 ? containerHeight + 20 : 400 }}
    >
      {grid.map((item, index) => {
        return (
          <div
            key={item.id}
            data-key={item.id}
            className="masonry-item-wrapper"
            onClick={() => handleClick(item)}
            onMouseEnter={e => handleMouseEnter(e, item)}
            onMouseLeave={e => handleMouseLeave(e, item)}
            role="img"
            aria-label={item.alt || item.title || 'Gallery image'}
          >
            <div className="masonry-item-img" style={{ backgroundImage: `url(${item.img})` }}>
              {colorShiftOnHover && (
                <div
                  className="color-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, rgba(255,107,0,0.5), rgba(255,150,50,0.5))',
                    opacity: 0,
                    pointerEvents: 'none',
                    borderRadius: '12px'
                  }}
                />
              )}
              {/* Number Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.9)',
                  zIndex: 10,
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </div>
              {/* Overlay with title */}
              {item.title && (
                <div className="masonry-item-overlay">
                  {item.category && (
                    <span className="masonry-item-category">{item.category}</span>
                  )}
                  <h3 className="masonry-item-title">{item.title}</h3>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Wrap Masonry with React.memo to prevent unnecessary re-renders from parent
export default memo(Masonry)
