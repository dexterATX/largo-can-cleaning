'use client'

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  Menu,
  X,
  Phone,
  Home,
  Wrench,
  DollarSign,
  Users,
  HelpCircle,
  Mail,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
  BookOpen,
  Image as ImageIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { BUSINESS_INFO } from '@/lib/schema'

const navLinks = [
  { href: '/', label: 'Home', icon: Home, desc: 'Back to homepage' },
  { href: '/services', label: 'Services', icon: Wrench, desc: 'What we offer' },
  { href: '/pricing', label: 'Pricing', icon: DollarSign, desc: 'Transparent rates' },
  { href: '/about', label: 'About', icon: Users, desc: 'Our story' },
  { href: '/gallery', label: 'Gallery', icon: ImageIcon, desc: 'Our work' },
  { href: '/blog', label: 'Blog', icon: BookOpen, desc: 'Tips & insights' },
  { href: '/faq', label: 'FAQ', icon: HelpCircle, desc: 'Common questions' },
  { href: '/contact', label: 'Contact', icon: Mail, desc: 'Get in touch' },
]

const quickFeatures = [
  { icon: Zap, label: 'Same-Day Service' },
  { icon: Shield, label: '100% Guaranteed' },
  { icon: Sparkles, label: 'Eco-Friendly' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // useLayoutEffect runs synchronously before paint - prevents scrollbar flash
  useLayoutEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Scroll detection with throttling for mobile performance
  useEffect(() => {
    let ticking = false
    let lastScrollY = 0

    const handleScroll = () => {
      lastScrollY = window.scrollY

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(lastScrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Focus trap and keyboard navigation for mobile menu
  useEffect(() => {
    if (!isMenuOpen) return

    const menuElement = document.getElementById('mobile-menu')
    if (!menuElement) return

    // Get all focusable elements within the menu
    const getFocusableElements = () => {
      return menuElement.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    }

    // Focus first element when menu opens
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
        // Return focus to menu button for accessibility
        menuButtonRef.current?.focus()
        return
      }

      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements()
        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          // Shift + Tab: wrap from first to last
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab: wrap from last to first
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  // Close menu handler with focus management - memoized for performance
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    menuButtonRef.current?.focus()
  }, [])

  return (
    <>
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-300',
        isScrolled
          ? 'bg-[var(--asphalt-dark)]/98 md:bg-[var(--asphalt-dark)]/95 md:backdrop-blur-md shadow-lg border-b border-[var(--steel-gray)]/20'
          : 'bg-transparent'
      )}
    >
      <Container>
        <nav
          className="flex items-center justify-between h-16 sm:h-20"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1 group"
            aria-label={`${BUSINESS_INFO.name} - Home`}
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="CleanCan Pro Mascot"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                CleanCan
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-[var(--safety-orange)] uppercase tracking-widest -mt-1">
                Pro
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium',
                  'text-[var(--light-gray)] hover:text-white',
                  'transition-colors duration-200',
                  'relative group'
                )}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--safety-orange)] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="flex items-center gap-2 text-sm text-[var(--light-gray)] hover:text-[var(--safety-orange)] transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">{BUSINESS_INFO.phone}</span>
            </a>
            <Button size="sm">Get Quote</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMenuOpen(prev => !prev)}
            onTouchEnd={(e) => {
              e.preventDefault()
              setIsMenuOpen(prev => !prev)
            }}
            className="lg:hidden relative z-10 p-3 -mr-1 text-white hover:text-[var(--safety-orange)] transition-colors pointer-events-auto touch-manipulation"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </Container>
    </header>

      {/* Mobile Menu - Full Screen Overlay - OUTSIDE header to avoid backdrop-filter stacking context issues */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] lg:hidden bg-[#0D0D0D] overflow-hidden"
          >
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-col h-full overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
              {/* Menu Header with Logo */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--steel-gray)]/30">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center gap-1"
                >
                  <div className="relative w-12 h-12">
                    <Image
                      src="/logo.png"
                      alt="CleanCan Pro Mascot"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white">CleanCan</span>
                    <span className="text-[9px] font-semibold text-[var(--safety-orange)] uppercase tracking-widest -mt-0.5">
                      Pro
                    </span>
                  </div>
                </Link>
                <button
                  onClick={closeMenu}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--concrete-gray)] text-[var(--light-gray)]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Bar */}
              <div className="flex items-center justify-center gap-6 px-4 py-2.5 bg-gradient-to-r from-[var(--safety-orange)]/5 via-[var(--safety-orange)]/10 to-[var(--safety-orange)]/5 border-b border-[var(--steel-gray)]/20">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-[var(--safety-orange)] fill-[var(--safety-orange)]" />
                    ))}
                  </div>
                  <span className="text-xs text-white font-medium">5.0</span>
                </div>
                <div className="w-px h-4 bg-[var(--steel-gray)]/30" />
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[var(--success)]" />
                  <span className="text-xs text-[var(--light-gray)]">Licensed</span>
                </div>
                <div className="w-px h-4 bg-[var(--steel-gray)]/30" />
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                  <span className="text-xs text-[var(--light-gray)]">Same Day</span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-3">
                <div className="space-y-2">
                  {navLinks.map((link, index) => {
                    const isActive = pathname === link.href
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.02 + index * 0.03 }}
                      >
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                            "border",
                            isActive
                              ? "bg-[var(--safety-orange)]/10 border-[var(--safety-orange)]/30"
                              : "bg-[var(--concrete-gray)] border-[var(--steel-gray)]/20"
                          )}
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                              isActive
                                ? "bg-[var(--safety-orange)]"
                                : "bg-[var(--steel-gray)]/30"
                            )}
                          >
                            <link.icon
                              className={cn(
                                "w-5 h-5 transition-colors",
                                isActive
                                  ? "text-white"
                                  : "text-[var(--light-gray)] group-hover:text-[var(--safety-orange)]"
                              )}
                            />
                          </div>
                          <div className="flex-1">
                            <span
                              className={cn(
                                "block text-sm font-semibold",
                                isActive ? "text-[var(--safety-orange)]" : "text-white"
                              )}
                            >
                              {link.label}
                            </span>
                            <span className="block text-[11px] text-[var(--slate-gray)]">
                              {link.desc}
                            </span>
                          </div>
                          <ChevronRight
                            className={cn(
                              "w-4 h-4 transition-colors",
                              isActive
                                ? "text-[var(--safety-orange)]"
                                : "text-[var(--steel-gray)] group-hover:text-[var(--safety-orange)]"
                            )}
                          />
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </nav>

              {/* Contact & CTA Section */}
              <div className="px-4 pb-4 pt-2 border-t border-[var(--steel-gray)]/20 bg-gradient-to-t from-[var(--asphalt-black)] to-transparent">
                {/* Contact Info Row */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <a href={`tel:${BUSINESS_INFO.phone}`} className="flex items-center gap-2 text-[var(--light-gray)]">
                    <Phone className="w-4 h-4 text-[var(--safety-orange)]" />
                    <span className="text-sm font-medium">{BUSINESS_INFO.phone}</span>
                  </a>
                  <div className="flex items-center gap-1.5 text-[var(--slate-gray)]">
                    <MapPin className="w-4 h-4 text-[var(--safety-orange)]" />
                    <span className="text-xs">Pinellas County</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${BUSINESS_INFO.phone}`}
                    className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-[var(--concrete-gray)] rounded-xl border border-[var(--steel-gray)]/30"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                  <Button
                    className="w-full"
                    size="md"
                    onClick={closeMenu}
                  >
                    Get Quote
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
