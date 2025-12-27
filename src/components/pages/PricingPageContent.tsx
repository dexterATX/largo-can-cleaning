'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Check,
  ArrowRight,
  Phone,
  Shield,
  Clock,
  Leaf,
  Star,
  ChevronDown,
  Sparkles,
  Zap,
  BadgeCheck,
  CircleDot,
} from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { BUSINESS_INFO } from '@/lib/schema'
import { cn } from '@/lib/utils'

// ============================================
// DATA
// ============================================

const plans = [
  {
    id: 'one-time',
    name: 'One-Time',
    tagline: 'Try us out',
    price: 25,
    period: '/can',
    icon: Sparkles,
    color: '#3B82F6',
    features: [
      '190°F high-pressure wash',
      '99.9% bacteria elimination',
      'Deodorizer treatment',
      'Same-day available',
    ],
    cta: 'Book Now',
    popular: false,
  },
  {
    id: 'monthly',
    name: 'Monthly',
    tagline: 'Best value',
    price: 22,
    period: '/can/mo',
    savings: 'Save 12%',
    icon: Star,
    color: '#F97316',
    features: [
      'Everything in One-Time',
      '10% recurring discount',
      'Priority scheduling',
      'Cancel anytime',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    id: 'deep-clean',
    name: 'Deep Clean',
    tagline: 'Maximum clean',
    price: 45,
    period: '/can',
    icon: Zap,
    color: '#10B981',
    features: [
      'Industrial degreasing',
      'Protective coating',
      'Interior & exterior detail',
      'Before/after photos',
    ],
    cta: 'Book Deep Clean',
    popular: false,
  },
]

const addOns = [
  { name: 'Extra can (same visit)', price: '$15' },
  { name: 'Recycling bin', price: '$15' },
  { name: 'Bi-weekly service', price: '$20/can' },
  { name: 'Weekly service', price: '$18/can' },
]

const guarantees = [
  { icon: Shield, title: '100% Satisfaction', desc: 'Re-clean or refund' },
  { icon: Clock, title: 'On-Time Service', desc: 'We show up when we say' },
  { icon: Leaf, title: 'Eco-Friendly', desc: 'Safe for family & pets' },
]

const faqs = [
  {
    q: 'Do I need to be home?',
    a: 'No! Just leave your bins at the curb on your scheduled day. We handle everything and send you a notification when complete.',
  },
  {
    q: 'What if it rains?',
    a: 'We clean rain or shine. Our process uses high-temperature water that works effectively in any weather condition.',
  },
  {
    q: 'Is there a contract?',
    a: 'No contracts ever. Cancel or pause your service anytime with no fees or penalties.',
  },
  {
    q: 'How do I know my bins were cleaned?',
    a: "You'll notice the difference immediately! We also send a completion notification with optional before/after photos.",
  },
]

// ============================================
// COMPONENTS
// ============================================

function PlanCard({ plan }: { plan: typeof plans[0] }) {
  return (
    <div
      className={cn(
        'relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300',
        'bg-gradient-to-b from-[var(--concrete-gray)] to-[var(--asphalt-black)]',
        'shadow-[0_4px_20px_rgba(0,0,0,0.4)]',
        plan.popular
          ? 'ring-2 ring-[var(--safety-orange)] shadow-[0_4px_30px_rgba(255,107,0,0.2)]'
          : 'ring-1 ring-[var(--steel-gray)]/30 hover:ring-[var(--steel-gray)]/50'
      )}
    >
      {/* Popular Glow Effect */}
      {plan.popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[var(--safety-orange)]/20 rounded-full blur-[60px] -translate-y-1/2" />
      )}

      {/* Top Accent Bar */}
      <div 
        className="h-1 w-full"
        style={{ backgroundColor: plan.popular ? 'var(--safety-orange)' : `${plan.color}40` }}
      />

      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white bg-[var(--safety-orange)] rounded-md shadow-lg">
            <Star className="w-2.5 h-2.5 fill-current" />
            Popular
          </span>
        </div>
      )}

      <div className="relative flex flex-col flex-1 p-4 sm:p-5">
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg"
          style={{ 
            backgroundColor: `${plan.color}20`,
            boxShadow: `0 4px 15px ${plan.color}20`
          }}
        >
          <plan.icon className="w-6 h-6" style={{ color: plan.color }} />
        </div>

        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
          <p className="text-xs text-[var(--slate-gray)]">{plan.tagline}</p>
        </div>

        {/* Price */}
        <div className="mb-5 pb-5 border-b border-[var(--steel-gray)]/20">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">${plan.price}</span>
            <span className="text-sm text-[var(--slate-gray)]">{plan.period}</span>
          </div>
          {plan.savings && (
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 text-[10px] font-bold text-[var(--safety-orange)] bg-[var(--safety-orange)]/10 rounded-full border border-[var(--safety-orange)]/20">
              <Zap className="w-2.5 h-2.5" />
              {plan.savings}
            </span>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6 flex-1">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[var(--light-gray)]">
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${plan.color}15` }}
              >
                <Check className="w-3 h-3" style={{ color: plan.color }} />
              </div>
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          variant={plan.popular ? 'primary' : 'outline'}
          className="w-full"
          size="md"
        >
          {plan.cta}
        </Button>
      </div>
    </div>
  )
}

type Plan = typeof plans[number]

function MobileCarousel({ plans: plansList }: { plans: Plan[] }) {
  return (
    <div className="w-full overflow-hidden lg:hidden">
      {/* Mobile: CSS scroll-snap carousel */}
      <div className="sm:hidden">
        <div
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {plansList.map((plan) => (
            <div
              key={plan.id}
              className="min-w-[280px] max-w-[280px] snap-center"
            >
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-[var(--slate-gray)] mt-2">
          ← Swipe to see all plans →
        </p>
      </div>

      {/* Tablet: centered grid */}
      <div className="hidden sm:flex justify-center px-4">
        <div className="flex gap-4">
          {plansList.map((plan) => (
            <div
              key={plan.id}
              className="w-[260px]"
            >
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FAQItem({ faq, index, isOpen, onToggle }: {
  faq: typeof faqs[0]
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [faq.a])

  return (
    <div
      className={cn(
        "rounded-xl border",
        isOpen
          ? "bg-[var(--concrete-gray)]/50 border-[var(--safety-orange)]/30"
          : "bg-[var(--concrete-gray)]/20 border-[var(--steel-gray)]/20"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {/* Number badge */}
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold",
            isOpen
              ? "bg-[var(--safety-orange)] text-white"
              : "bg-[var(--steel-gray)]/20 text-[var(--slate-gray)]"
          )}
        >
          {(index + 1).toString().padStart(2, '0')}
        </div>

        <span className={cn(
          "flex-1 text-sm font-medium",
          isOpen ? "text-white" : "text-[var(--light-gray)]"
        )}>
          {faq.q}
        </span>

        {/* Plus/Minus icon */}
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
            isOpen ? "bg-[var(--safety-orange)]/20" : "bg-[var(--steel-gray)]/20"
          )}
        >
          <ChevronDown
            className={cn(
              "w-4 h-4 will-change-transform",
              isOpen ? "text-[var(--safety-orange)] rotate-180" : "text-[var(--slate-gray)] rotate-0"
            )}
            style={{ transition: 'transform 100ms ease-out' }}
          />
        </div>
      </button>

      {/* Height-based animation with will-change */}
      <div
        className="overflow-hidden will-change-[height]"
        style={{
          height: isOpen ? height : 0,
          transition: 'height 100ms ease-out',
        }}
      >
        <div ref={contentRef} className="px-4 pb-4 pl-[60px]">
          <p className="text-sm text-[var(--slate-gray)] leading-relaxed">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function PricingPageContent() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  return (
    <>
      {/* Hero Section - Modern Design */}
      <section className="relative pt-24 pb-10 sm:pt-32 sm:pb-14 bg-[var(--asphalt-black)] overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--asphalt-black)] via-[var(--asphalt-black)] to-[var(--concrete-gray)]/20" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          {/* Glows - hidden on mobile for performance */}
          <div className="hidden md:block absolute top-1/4 -right-20 w-[400px] h-[400px] bg-[var(--safety-orange)]/10 rounded-full blur-[60px]" />
          <div className="hidden md:block absolute bottom-0 -left-20 w-[300px] h-[300px] bg-[var(--safety-orange)]/5 rounded-full blur-[60px]" />
        </div>

        {/* Floating Accent Elements - hidden on mobile */}
        <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[35%] right-0 w-1/4 h-px bg-gradient-to-l from-[var(--safety-orange)]/30 to-transparent" />
          <div className="absolute top-[45%] left-0 w-1/5 h-px bg-gradient-to-r from-[var(--safety-orange)]/20 to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--safety-orange)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--safety-orange)]" />
              </span>
              <span className="text-xs font-semibold tracking-widest uppercase text-[var(--safety-orange)]">
                Simple Pricing
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Transparent{' '}
              <span className="relative inline-block">
                <span className="text-[var(--safety-orange)]">Pricing</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full h-3"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M4 8C40 2 160 2 196 8"
                    stroke="var(--safety-orange)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[var(--slate-gray)] mb-8 max-w-md mx-auto">
              No contracts. No hidden fees. Cancel anytime.
            </p>

            {/* Trust Indicators - Mobile Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
              {[
                { icon: Shield, label: '100% Satisfaction', color: '#10B981' },
                { icon: Zap, label: 'Same-Day Available', color: 'var(--safety-orange)' },
                { icon: BadgeCheck, label: 'No Contracts', color: '#3B82F6' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--concrete-gray)]/60 border border-[var(--steel-gray)]/30"
                >
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  <span className="text-xs font-medium text-[var(--light-gray)]">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Quick Price Preview - Mobile Only */}
            <div className="sm:hidden">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-[var(--concrete-gray)] to-[var(--concrete-gray)]/80 border border-[var(--steel-gray)]/30">
                <div className="text-left">
                  <p className="text-[10px] text-[var(--slate-gray)] uppercase tracking-wide">Starting at</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">$22</span>
                    <span className="text-xs text-[var(--slate-gray)]">/can/mo</span>
                  </div>
                </div>
                <div className="w-px h-10 bg-[var(--steel-gray)]/30" />
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[var(--safety-orange)] fill-[var(--safety-orange)]" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">5.0</p>
                    <p className="text-[9px] text-[var(--slate-gray)]">500+ reviews</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Stats Row */}
            <div className="hidden sm:flex items-center justify-center gap-8">
              {[
                { value: '$22', label: 'Starting Price', sub: '/can/mo' },
                { value: '500+', label: 'Happy Customers' },
                { value: '5.0', label: 'Google Rating', icon: Star },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    {stat.icon && <stat.icon className="w-5 h-5 text-[var(--safety-orange)] fill-[var(--safety-orange)]" />}
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                    {stat.sub && <span className="text-sm text-[var(--slate-gray)]">{stat.sub}</span>}
                  </div>
                  <p className="text-xs text-[var(--slate-gray)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--asphalt-black)] to-transparent" />
      </section>

      {/* Pricing Cards */}
      <section className="py-8 sm:py-12 bg-[var(--asphalt-black)]">
        {/* Mobile & Tablet: Drag Carousel */}
        <MobileCarousel plans={plans} />

        {/* Desktop: Grid */}
        <Container className="hidden lg:block">
          <div className="grid grid-cols-3 gap-5 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </Container>
      </section>

      {/* Trust & Add-ons Combined Section */}
      <section className="py-8 sm:py-12 bg-[var(--asphalt-dark)]">
        <Container>
          {/* Trust Badges - Horizontal Scroll on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            {/* Mobile: Scrollable badges with scroll indicator */}
            <div className="sm:hidden">
              <div className="overflow-x-auto scrollbar-none pb-2 -mx-4 px-4">
                <div className="flex gap-2 w-max">
                  {guarantees.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--concrete-gray)]/50 border border-[var(--steel-gray)]/20 whitespace-nowrap"
                    >
                      <div className="w-7 h-7 rounded-full bg-[var(--safety-orange)]/10 flex items-center justify-center">
                        <item.icon className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white">{item.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scroll hint text */}
              <p className="text-center text-[10px] text-[var(--slate-gray)] mt-3">
                ← Swipe for more →
              </p>
            </div>

            {/* Desktop: Centered badges */}
            <div className="hidden sm:flex items-center justify-center gap-6">
              {guarantees.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--safety-orange)]/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[var(--safety-orange)]" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-white">{item.title}</span>
                    <span className="block text-xs text-[var(--slate-gray)]">{item.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Divider with label */}
          <div className="flex items-center gap-4 max-w-xl mx-auto mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--steel-gray)]/30 to-[var(--steel-gray)]/30" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--slate-gray)]">Customize Your Service</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[var(--steel-gray)]/30 to-[var(--steel-gray)]/30" />
          </div>

          {/* Add-ons - Modern Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            {/* Mobile: 2x2 Grid */}
            <div className="sm:hidden grid grid-cols-2 gap-2">
              {addOns.map((addon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-xl bg-[var(--concrete-gray)]/40 border border-[var(--steel-gray)]/20"
                >
                  <p className="text-xs text-[var(--light-gray)] mb-2 line-clamp-2">{addon.name}</p>
                  <p className="text-base font-bold text-[var(--safety-orange)]">{addon.price}</p>
                </motion.div>
              ))}
            </div>

            {/* Desktop: Horizontal list */}
            <div className="hidden sm:grid grid-cols-2 gap-3">
              {addOns.map((addon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 hover:border-[var(--safety-orange)]/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--safety-orange)]/50 group-hover:bg-[var(--safety-orange)] transition-colors" />
                    <span className="text-sm text-[var(--light-gray)]">{addon.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[var(--safety-orange)]">{addon.price}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA for custom quote */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-6"
            >
              <p className="text-xs text-[var(--slate-gray)] mb-2">Need something specific?</p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--safety-orange)] hover:underline"
              >
                Get a custom quote
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* FAQ Accordion - Modern Design */}
      <section className="py-10 sm:py-16 bg-[var(--asphalt-black)] relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-[var(--safety-orange)]/5 rounded-full blur-[120px] -translate-y-1/2" />

        <Container className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            {/* Mobile: Centered */}
            <div className="sm:hidden text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20">
                <CircleDot className="w-3 h-3 text-[var(--safety-orange)]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--safety-orange)]">FAQ</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Common Questions
              </h2>
              <p className="text-sm text-[var(--slate-gray)]">
                Quick answers to help you decide
              </p>
            </div>

            {/* Desktop: Left aligned with stats */}
            <div className="hidden sm:flex items-end justify-between max-w-2xl mx-auto">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20">
                  <CircleDot className="w-3 h-3 text-[var(--safety-orange)]" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--safety-orange)]">FAQ</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Common Questions
                </h2>
                <p className="text-sm text-[var(--slate-gray)]">
                  Quick answers to help you decide
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{faqs.length}</p>
                <p className="text-xs text-[var(--slate-gray)]">Questions answered</p>
              </div>
            </div>
          </div>

          {/* FAQ Items - Stacked Cards */}
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openFAQ === index}
                onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="max-w-2xl mx-auto mt-8">
            {/* Mobile: Simple link */}
            <div className="sm:hidden text-center">
              <a
                href="/faq"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--safety-orange)]"
              >
                View all FAQs
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Desktop: Card with contact option */}
            <div className="hidden sm:flex items-center justify-between p-4 rounded-xl bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--safety-orange)]/10 flex items-center justify-center">
                  <CircleDot className="w-5 h-5 text-[var(--safety-orange)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Still have questions?</p>
                  <p className="text-xs text-[var(--slate-gray)]">We're here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/faq"
                  className="px-4 py-2 text-sm font-medium text-[var(--light-gray)] hover:text-white transition-colors"
                >
                  View all FAQs
                </a>
                <a
                  href="/contact"
                  className="px-4 py-2 text-sm font-medium text-white bg-[var(--safety-orange)] rounded-lg hover:bg-[var(--safety-orange)]/90 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA - Modern Design */}
      <section className="py-10 sm:py-16 bg-[var(--asphalt-dark)] relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--safety-orange)]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[var(--safety-orange)]/5 rounded-full blur-[120px]" />

        <Container className="relative z-10">
          {/* Mobile CTA Card */}
          <div className="sm:hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden"
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--safety-orange)]/30 via-transparent to-[var(--safety-orange)]/20 rounded-2xl" />

              <div className="relative m-[1px] p-5 rounded-2xl bg-[var(--asphalt-black)]">
                {/* Icon row */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="w-12 h-12 rounded-xl bg-[var(--safety-orange)] flex items-center justify-center shadow-lg shadow-[var(--safety-orange)]/30"
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                <h2 className="text-xl font-bold text-white text-center mb-2">
                  Ready for Clean Bins?
                </h2>
                <p className="text-sm text-[var(--slate-gray)] text-center mb-5">
                  Join 500+ happy customers in Pinellas County
                </p>

                {/* Trust row */}
                <div className="flex items-center justify-center gap-4 mb-5 pb-5 border-b border-[var(--steel-gray)]/20">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[var(--success)]" />
                    <span className="text-xs text-[var(--light-gray)]">Guaranteed</span>
                  </div>
                  <div className="w-px h-4 bg-[var(--steel-gray)]/30" />
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[var(--safety-orange)]" />
                    <span className="text-xs text-[var(--light-gray)]">Same-Day</span>
                  </div>
                  <div className="w-px h-4 bg-[var(--steel-gray)]/30" />
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-[var(--light-gray)]">5.0</span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="space-y-2">
                  <Button className="w-full" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Get Free Quote
                  </Button>
                  <a
                    href={`tel:${BUSINESS_INFO.phone}`}
                    className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white bg-[var(--concrete-gray)] rounded-xl"
                  >
                    <Phone className="w-4 h-4" />
                    Call {BUSINESS_INFO.phone}
                  </a>
                </div>

                {/* Bottom note */}
                <p className="text-center text-[10px] text-[var(--slate-gray)] mt-4">
                  Free estimates · No contracts · Cancel anytime
                </p>
              </div>
            </motion.div>
          </div>

          {/* Desktop CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hidden sm:block"
          >
            <div className="relative rounded-3xl overflow-hidden">
              {/* Gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--safety-orange)]/40 via-[var(--safety-orange)]/20 to-[var(--safety-orange)]/40 rounded-3xl" />

              <div className="relative m-[1px] p-10 rounded-3xl bg-gradient-to-br from-[var(--asphalt-black)] to-[var(--concrete-gray)]/30">
                <div className="flex items-center justify-between gap-10">
                  {/* Left content */}
                  <div className="flex-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', delay: 0.1 }}
                      className="w-14 h-14 rounded-2xl bg-[var(--safety-orange)] flex items-center justify-center mb-5 shadow-lg shadow-[var(--safety-orange)]/30"
                    >
                      <Sparkles className="w-7 h-7 text-white" />
                    </motion.div>

                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                      Ready for Sparkling Clean Bins?
                    </h2>
                    <p className="text-base text-[var(--slate-gray)] mb-6 max-w-md">
                      Join 500+ satisfied customers who trust us with their bin cleaning.
                      Schedule today and see the difference.
                    </p>

                    {/* Trust badges */}
                    <div className="flex items-center gap-4">
                      {[
                        { icon: Shield, label: '100% Satisfaction', color: '#10B981' },
                        { icon: Clock, label: 'Same-Day Service', color: 'var(--safety-orange)' },
                        { icon: Star, label: '5.0 Rating', color: '#FBBF24', fill: true },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <item.icon
                            className={cn("w-4 h-4", item.fill && "fill-current")}
                            style={{ color: item.color }}
                          />
                          <span className="text-sm text-[var(--light-gray)]">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right CTA */}
                  <div className="flex-shrink-0 text-center">
                    <div className="p-6 rounded-2xl bg-[var(--asphalt-black)]/50 border border-[var(--steel-gray)]/20">
                      <p className="text-xs text-[var(--slate-gray)] uppercase tracking-wide mb-1">Starting at</p>
                      <div className="flex items-baseline justify-center gap-1 mb-4">
                        <span className="text-4xl font-bold text-white">$22</span>
                        <span className="text-sm text-[var(--slate-gray)]">/can/mo</span>
                      </div>

                      <div className="space-y-2">
                        <Button className="w-full" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                          Get Free Quote
                        </Button>
                        <a
                          href={`tel:${BUSINESS_INFO.phone}`}
                          className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-[var(--light-gray)] hover:text-white transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          {BUSINESS_INFO.phone}
                        </a>
                      </div>

                      <p className="text-[10px] text-[var(--slate-gray)] mt-3">
                        No contracts · Cancel anytime
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

    </>
  )
}
