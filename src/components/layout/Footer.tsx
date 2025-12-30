'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Trash2, ChevronDown, Facebook, Instagram } from 'lucide-react'
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

// Dropdown Component for Mobile - CSS transitions only (no motion)
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
    <div className="border-b border-[var(--steel-gray)]/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--asphalt-black)] rounded-lg"
        aria-expanded={isOpen}
        aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title} section`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--safety-orange)]/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-[var(--safety-orange)]" />
          </div>
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
        {/* CSS-only chevron rotation */}
        <div
          className="accordion-chevron w-6 h-6 rounded-full bg-[var(--steel-gray)]/10 flex items-center justify-center"
          data-open={isOpen}
        >
          <ChevronDown className="w-3.5 h-3.5 text-[var(--slate-gray)]" />
        </div>
      </button>
      {/* CSS grid transition for smooth expand/collapse */}
      <div className="accordion-content" data-open={isOpen}>
        <div className="accordion-inner">
          <div className="pb-3 pl-11">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="bg-[var(--asphalt-black)] border-t-2 border-[var(--safety-orange)]/40"
      role="contentinfo"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      {/* Hidden structured data for SEO */}
      <meta itemProp="name" content={BUSINESS_INFO.name} />
      <meta itemProp="telephone" content={BUSINESS_INFO.phoneRaw} />
      <meta itemProp="email" content={BUSINESS_INFO.email} />
      <meta itemProp="priceRange" content={BUSINESS_INFO.priceRange} />
      <link itemProp="url" href={BUSINESS_INFO.url} />
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
                    alt="Largo Can Cleaning - Professional Trash Can Cleaning Service in Pinellas County, Florida"
                    fill
                    sizes="44px"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-white leading-none">LargoCan</span>
                  <span className="text-[8px] font-semibold text-[var(--safety-orange)] uppercase tracking-widest">Cleaning</span>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                {/* Social Icons - Mobile */}
                <a
                  href={BUSINESS_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--steel-gray)]/10 text-[var(--slate-gray)] hover:bg-[var(--safety-orange)] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety-orange)]"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5" aria-hidden="true" />
                </a>
                <a
                  href={BUSINESS_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--steel-gray)]/10 text-[var(--slate-gray)] hover:bg-[var(--safety-orange)] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety-orange)]"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                </a>
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[var(--safety-orange)] text-white text-sm font-semibold rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--safety-orange)]"
                  aria-label={`Call us at ${BUSINESS_INFO.phone}`}
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  Call Now
                </a>
              </div>
            </div>

            {/* Dropdown Sections */}
            <nav className="mb-4" aria-label="Footer navigation">
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
                <div className="space-y-3" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <div className="flex items-center gap-2 text-sm text-[var(--light-gray)]">
                    <MapPin className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                    <span>
                      <span itemProp="addressLocality">{BUSINESS_INFO.address.city}</span>,{' '}
                      <span itemProp="addressRegion">{BUSINESS_INFO.address.state}</span>{' '}
                      <span itemProp="postalCode">{BUSINESS_INFO.address.zip}</span>
                    </span>
                  </div>
                  <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="flex items-center gap-2 text-sm text-[var(--light-gray)] hover:text-[var(--safety-orange)] transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                    <span itemProp="telephone">{BUSINESS_INFO.phone}</span>
                  </a>
                  <a href={`mailto:${BUSINESS_INFO.email}`} className="flex items-center gap-2 text-sm text-[var(--light-gray)] hover:text-[var(--safety-orange)] transition-colors">
                    <Mail className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                    {BUSINESS_INFO.email}
                  </a>
                  <div className="pt-2 border-t border-[var(--steel-gray)]/10">
                    <p className="text-xs text-[var(--slate-gray)] mb-1">Business Hours</p>
                    <p className="text-sm text-[var(--light-gray)]">Mon-Sat: 6AM - 8PM</p>
                    <p className="text-sm text-[var(--light-gray)]">Sunday: Closed</p>
                  </div>
                </div>
              </FooterDropdown>

              <FooterDropdown title="Service Areas" icon={MapPin}>
                <div className="flex flex-wrap gap-1.5">
                  {BUSINESS_INFO.areaServed.map((area) => (
                    <span
                      key={area}
                      className="px-2 py-0.5 text-xs text-[var(--light-gray)] bg-[var(--steel-gray)]/10 rounded-md"
                      itemProp="areaServed"
                      itemScope
                      itemType="https://schema.org/City"
                    >
                      <span itemProp="name">{area}</span>
                    </span>
                  ))}
                </div>
              </FooterDropdown>
            </nav>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-4">
              <Link href="/" className="inline-flex items-center gap-1 mb-4">
                <div className="relative w-14 h-14">
                  <Image
                    src="/logo.png"
                    alt="Largo Can Cleaning - Professional Trash Can Cleaning Service in Pinellas County, Florida"
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white leading-none">LargoCan</span>
                  <span className="text-[9px] font-semibold text-[var(--safety-orange)] uppercase tracking-widest">Cleaning</span>
                </div>
              </Link>
              <p className="text-sm text-[var(--slate-gray)] mb-5 max-w-xs">
                Professional trash can cleaning & sanitization. Eliminating 99.9% of bacteria, odors, and pests.
              </p>
              {/* Contact Info - NAP with Schema */}
              <address className="space-y-2 not-italic" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <div className="flex items-center gap-2.5 text-sm text-[var(--light-gray)]">
                  <MapPin className="w-4 h-4 text-[var(--safety-orange)]" aria-hidden="true" />
                  <span>
                    <span itemProp="addressLocality">{BUSINESS_INFO.address.city}</span>,{' '}
                    <span itemProp="addressRegion">{BUSINESS_INFO.address.state}</span>{' '}
                    <span itemProp="postalCode">{BUSINESS_INFO.address.zip}</span>
                  </span>
                </div>
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="flex items-center gap-2.5 text-sm text-[var(--light-gray)] hover:text-[var(--safety-orange)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--asphalt-black)] rounded"
                  aria-label={`Call us at ${BUSINESS_INFO.phone}`}
                >
                  <Phone className="w-4 h-4 text-[var(--safety-orange)]" aria-hidden="true" />
                  <span itemProp="telephone">{BUSINESS_INFO.phone}</span>
                </a>
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="flex items-center gap-2.5 text-sm text-[var(--light-gray)] hover:text-[var(--safety-orange)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--asphalt-black)] rounded"
                  aria-label={`Email us at ${BUSINESS_INFO.email}`}
                >
                  <Mail className="w-4 h-4 text-[var(--safety-orange)]" aria-hidden="true" />
                  <span itemProp="email">{BUSINESS_INFO.email}</span>
                </a>
              </address>
              {/* Social Icons - Desktop */}
              <div className="flex items-center gap-3 mt-5">
                <a
                  href={BUSINESS_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--steel-gray)]/10 text-[var(--slate-gray)] hover:bg-[var(--safety-orange)] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety-orange)]"
                  aria-label="Follow us on Facebook"
                  itemProp="sameAs"
                >
                  <Facebook className="w-5 h-5" aria-hidden="true" />
                </a>
                <a
                  href={BUSINESS_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--steel-gray)]/10 text-[var(--slate-gray)] hover:bg-[var(--safety-orange)] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety-orange)]"
                  aria-label="Follow us on Instagram"
                  itemProp="sameAs"
                >
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Services Column */}
            <nav className="col-span-2" aria-labelledby="footer-services-heading">
              <h2 id="footer-services-heading" className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Services</h2>
              <ul className="space-y-2.5">
                {footerLinks.services.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[var(--slate-gray)] hover:text-[var(--safety-orange)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety-orange)] rounded">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company Column */}
            <nav className="col-span-2" aria-labelledby="footer-company-heading">
              <h2 id="footer-company-heading" className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Company</h2>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[var(--slate-gray)] hover:text-[var(--safety-orange)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--safety-orange)] rounded">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Hours & Location Column */}
            <div className="col-span-4">
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Hours & Location</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-sm">
                  <Clock className="w-4 h-4 text-[var(--safety-orange)] mt-0.5 shrink-0" />
                  <div className="text-[var(--slate-gray)]">
                    <p>Mon-Sat: 6AM - 8PM</p>
                    <p>Sunday: Closed</p>
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
