'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Trash2, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import Container from '@/components/ui/Container'
import { BUSINESS_INFO } from '@/lib/schema'

const footerLinks = {
  services: [
    { href: '/services#residential', label: 'Residential' },
    { href: '/services#commercial', label: 'Commercial' },
    { href: '/services#recurring', label: 'Recurring' },
    { href: '/services#one-time', label: 'Deep Clean' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
}

// Dropdown Component for Mobile
function FooterDropdown({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-[var(--steel-gray)]/10 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3.5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--safety-orange)]/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-[var(--safety-orange)]" />
          </div>
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6 rounded-full bg-[var(--steel-gray)]/10 flex items-center justify-center"
        >
          <ChevronDown className="w-3.5 h-3.5 text-[var(--slate-gray)]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-11">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="bg-[var(--asphalt-black)] border-t border-[var(--steel-gray)]/20"
      role="contentinfo"
    >
      <Container>
        {/* Main Footer Content */}
        <div className="py-6 lg:py-10">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Brand + CTA Header */}
            <div className="flex items-center justify-between pb-4 mb-2 border-b border-[var(--steel-gray)]/10">
              <Link href="/" className="inline-flex items-center gap-1">
                <div className="relative w-11 h-11">
                  <Image
                    src="/logo.png"
                    alt="CleanCan Pro Mascot"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-white leading-none">CleanCan</span>
                  <span className="text-[8px] font-semibold text-[var(--safety-orange)] uppercase tracking-widest">Pro</span>
                </div>
              </Link>
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--safety-orange)] text-white text-sm font-semibold rounded-xl"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>

            {/* Dropdown Sections */}
            <div className="mb-4">
              <FooterDropdown title="Our Services" icon={Trash2}>
                <ul className="space-y-2.5">
                  {footerLinks.services.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-[var(--slate-gray)] hover:text-[var(--safety-orange)] transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterDropdown>

              <FooterDropdown title="Company" icon={MapPin}>
                <ul className="space-y-2.5">
                  {footerLinks.company.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-[var(--slate-gray)] hover:text-[var(--safety-orange)] transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterDropdown>

              <FooterDropdown title="Contact & Hours" icon={Clock}>
                <div className="space-y-3">
                  <a href={`tel:${BUSINESS_INFO.phone}`} className="flex items-center gap-2 text-sm text-[var(--light-gray)]">
                    <Phone className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                    {BUSINESS_INFO.phone}
                  </a>
                  <a href={`mailto:${BUSINESS_INFO.email}`} className="flex items-center gap-2 text-sm text-[var(--light-gray)]">
                    <Mail className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                    {BUSINESS_INFO.email}
                  </a>
                  <div className="pt-2 border-t border-[var(--steel-gray)]/10">
                    <p className="text-xs text-[var(--slate-gray)] mb-1">Business Hours</p>
                    <p className="text-sm text-[var(--light-gray)]">Mon - Fri: 8am - 6pm</p>
                    <p className="text-sm text-[var(--light-gray)]">Saturday: 9am - 2pm</p>
                  </div>
                </div>
              </FooterDropdown>

              <FooterDropdown title="Service Areas" icon={MapPin}>
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_INFO.areaServed.map((area) => (
                    <span key={area} className="px-2.5 py-1 text-xs text-[var(--light-gray)] bg-[var(--steel-gray)]/10 rounded-lg">
                      {area}
                    </span>
                  ))}
                </div>
              </FooterDropdown>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-4">
              <Link href="/" className="inline-flex items-center gap-1 mb-4">
                <div className="relative w-14 h-14">
                  <Image
                    src="/logo.png"
                    alt="CleanCan Pro Mascot"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white leading-none">CleanCan</span>
                  <span className="text-[9px] font-semibold text-[var(--safety-orange)] uppercase tracking-widest">Pro</span>
                </div>
              </Link>
              <p className="text-sm text-[var(--slate-gray)] mb-5 max-w-xs">
                Professional trash can cleaning & sanitization. Eliminating 99.9% of bacteria, odors, and pests.
              </p>
              {/* Contact Info */}
              <div className="space-y-2">
                <a href={`tel:${BUSINESS_INFO.phone}`} className="flex items-center gap-2.5 text-sm text-[var(--light-gray)] hover:text-[var(--safety-orange)] transition-colors">
                  <Phone className="w-4 h-4 text-[var(--safety-orange)]" />
                  {BUSINESS_INFO.phone}
                </a>
                <a href={`mailto:${BUSINESS_INFO.email}`} className="flex items-center gap-2.5 text-sm text-[var(--light-gray)] hover:text-[var(--safety-orange)] transition-colors">
                  <Mail className="w-4 h-4 text-[var(--safety-orange)]" />
                  {BUSINESS_INFO.email}
                </a>
              </div>
            </div>

            {/* Services Column */}
            <div className="col-span-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Services</h4>
              <ul className="space-y-2.5">
                {footerLinks.services.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[var(--slate-gray)] hover:text-[var(--safety-orange)] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="col-span-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[var(--slate-gray)] hover:text-[var(--safety-orange)] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hours & Location Column */}
            <div className="col-span-4">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Hours & Location</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-sm">
                  <Clock className="w-4 h-4 text-[var(--safety-orange)] mt-0.5 shrink-0" />
                  <div className="text-[var(--slate-gray)]">
                    <p>Mon - Fri: 8am - 6pm</p>
                    <p>Saturday: 9am - 2pm</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-[var(--safety-orange)] mt-0.5 shrink-0" />
                  <div className="text-[var(--slate-gray)]">
                    <p>Serving Pinellas County, FL</p>
                    <p className="text-xs text-[var(--steel-gray)] mt-1">
                      {BUSINESS_INFO.areaServed.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-[var(--steel-gray)]/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-[var(--slate-gray)]/60">
              © {currentYear} {BUSINESS_INFO.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {/* Service Areas - Desktop Only */}
              <div className="hidden lg:flex items-center gap-1.5">
                {BUSINESS_INFO.areaServed.slice(0, 4).map((area, i) => (
                  <span key={area} className="text-[10px] text-[var(--slate-gray)]/50">
                    {area}{i < 3 ? ' ·' : ''}
                  </span>
                ))}
                <span className="text-[10px] text-[var(--slate-gray)]/50">& more</span>
              </div>
              <span className="hidden lg:block w-px h-3 bg-[var(--steel-gray)]/20" />
              {footerLinks.legal.map((link, i) => (
                <span key={link.href} className="flex items-center gap-4">
                  <Link href={link.href} className="text-[11px] text-[var(--slate-gray)]/60 hover:text-[var(--safety-orange)] transition-colors">
                    {link.label}
                  </Link>
                  {i < footerLinks.legal.length - 1 && (
                    <span className="w-0.5 h-0.5 rounded-full bg-[var(--steel-gray)]/30" />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
