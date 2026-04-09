'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { TIERS, TierId, pricePerCookie } from '@/lib/tiers'

interface ShopSettings {
  acceptingOrders: boolean
  batchInfo: string
  availableSpots: number
  cutoffTime: string
  pickupInstructions: string
}

const INGREDIENTS = [
  'Rolled oats',
  'Baking soda',
  'Vanilla extract',
  'All-natural peanut butter',
  'Brown sugar',
  'Eggs',
  'Chocolate chips',
]

export default function HomePage() {
  const router = useRouter()
  const { addTier } = useCart()
  const { t } = useLanguage()
  const [settings, setSettings] = useState<ShopSettings | null>(null)

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setSettings).catch(() => {})
  }, [])

  const handleSelectTier = (id: TierId) => {
    addTier(id)
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* ── Hero ── */}
      <section className="bg-[#FAF8F4] dark:bg-stone-950 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16">
        <p className="text-xs tracking-widest uppercase text-gold mb-8 font-sans">
          {t.home.hero.badge}
        </p>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-stone-900 dark:text-stone-100 leading-tight mb-6 max-w-2xl">
          {t.home.hero.headline}
        </h1>
        <div className="gold-divider mx-auto mb-6" />
        <p className="text-stone-500 dark:text-stone-400 text-base sm:text-lg max-w-md leading-relaxed mb-10">
          {t.home.hero.description}
        </p>
        <a
          href="#order"
          className="inline-block bg-stone-900 dark:bg-stone-100 hover:bg-stone-700 dark:hover:bg-stone-300 text-white dark:text-stone-900 text-xs tracking-widest uppercase font-medium px-10 py-4 transition-colors font-sans"
        >
          {t.home.hero.cta}
        </a>
      </section>

      {/* ── The Signature ── */}
      <section className="bg-white dark:bg-stone-900 py-20 sm:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase text-gold mb-4 font-sans">{t.home.signature.badge}</p>
          <h2 className="font-serif text-3xl md:text-5xl text-stone-900 dark:text-stone-100 mb-6">{t.home.signature.headline}</h2>
          <div className="gold-divider mx-auto mb-8" />
          <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed max-w-xl mx-auto">
            {t.home.signature.description}
          </p>
        </div>
      </section>

      {/* ── Three Pillars ── */}
      <section className="bg-stone-50 dark:bg-stone-800 py-20 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {(
              [
                { num: 'I', pillar: t.home.pillars.i },
                { num: 'II', pillar: t.home.pillars.ii },
                { num: 'III', pillar: t.home.pillars.iii },
              ] as const
            ).map(({ num, pillar }) => (
              <div key={num} className="border-t border-stone-200 dark:border-stone-700 pt-8">
                <p className="font-serif text-gold text-2xl mb-4">{num}</p>
                <h3 className="font-serif text-stone-900 dark:text-stone-100 text-xl mb-3">{pillar.title}</h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Order ── */}
      <section id="order" className="bg-[#FAF8F4] dark:bg-stone-950 py-20 sm:py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs tracking-widest uppercase text-gold mb-4 font-sans">{t.home.order.badge}</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">{t.home.order.headline}</h2>
            <div className="gold-divider mx-auto mt-5" />
          </div>

          {settings && !settings.acceptingOrders && (
            <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-5 py-3 mb-6 text-center text-xs text-red-600 dark:text-red-400 font-sans tracking-wider uppercase">
              {t.home.order.paused}
            </div>
          )}

          {/* Tier cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative flex flex-col border bg-white dark:bg-stone-900 transition-shadow ${
                  tier.popular
                    ? 'border-gold shadow-md'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500'
                }`}
              >
                {tier.popular && (
                  <div className="bg-gold px-3 py-1 text-center">
                    <span className="text-white text-[10px] tracking-widest uppercase font-sans font-medium">
                      {t.home.order.popular}
                    </span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <p className="font-serif text-stone-900 dark:text-stone-100 text-2xl mb-1">{tier.label}</p>
                  <p className="text-stone-400 dark:text-stone-500 text-xs font-sans tracking-wide mb-5">
                    {t.home.order.flavor}
                  </p>

                  <div className="mb-1">
                    <span className="font-serif text-stone-900 dark:text-stone-100 text-3xl">${tier.price}</span>
                    <span className="text-stone-400 dark:text-stone-500 text-sm font-sans ml-1">.00</span>
                  </div>
                  <p className="text-stone-400 dark:text-stone-500 text-xs font-sans mb-2">
                    ${pricePerCookie(tier)} {t.home.order.perCookie}
                  </p>

                  {tier.savings ? (
                    <p className="text-gold text-xs font-sans tracking-wide mb-5">{tier.savings}</p>
                  ) : (
                    <div className="mb-5 h-4" />
                  )}

                  <button
                    onClick={() => handleSelectTier(tier.id as TierId)}
                    disabled={settings !== null && !settings.acceptingOrders}
                    className={`mt-auto w-full text-xs tracking-widest uppercase font-sans font-medium py-4 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      tier.popular
                        ? 'bg-gold hover:bg-gold-dark text-stone-950'
                        : 'bg-stone-900 dark:bg-stone-100 hover:bg-stone-700 dark:hover:bg-stone-300 text-white dark:text-stone-900'
                    }`}
                  >
                    {t.home.order.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white dark:bg-stone-900 py-20 sm:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase text-gold mb-4 font-sans">{t.home.howItWorks.badge}</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 mb-14">{t.home.howItWorks.headline}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {t.home.howItWorks.steps.map(({ n, title, desc }) => (
              <div key={n} className="text-left md:text-center">
                <p className="font-sans text-xs tracking-widest text-gold mb-3">{n}</p>
                <h3 className="font-serif text-stone-800 dark:text-stone-200 text-xl mb-3">{title}</h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ingredients ── */}
      <section className="bg-stone-50 dark:bg-stone-800 py-20 sm:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-widest uppercase text-gold mb-4 font-sans">{t.home.ingredients.badge}</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 mb-4">{t.home.ingredients.headline}</h2>
            <div className="gold-divider mx-auto mb-6" />
            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mx-auto">
              {t.home.ingredients.description}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {INGREDIENTS.map((item) => (
              <span
                key={item}
                className="border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 font-serif text-sm px-5 py-2.5"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="text-center text-stone-400 dark:text-stone-500 text-xs tracking-widest uppercase font-sans mt-5">
            {t.home.ingredients.footer}
          </p>
        </div>
      </section>

      {/* ── Founder Story ── */}
      <section className="bg-stone-900 dark:bg-black py-20 sm:py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase text-gold mb-8 font-sans">{t.home.story.badge}</p>
          <div className="gold-divider mx-auto mb-8" />
          <blockquote className="font-serif text-xl sm:text-2xl text-stone-100 leading-relaxed italic mb-8">
            {t.home.story.quote}
          </blockquote>
          <p className="text-stone-500 text-sm font-sans tracking-wide whitespace-pre-line">
            {t.home.story.caption}
          </p>
        </div>
      </section>

      {/* ── Referral ── */}
      <section className="bg-white dark:bg-stone-900 py-16 sm:py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase text-gold mb-4 font-sans">{t.home.referral.badge}</p>
          <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-100 mb-4">{t.home.referral.headline}</h2>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-sm mx-auto mb-8">
            {t.home.referral.description}
          </p>
          <a
            href="#order"
            className="inline-block border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:border-stone-900 dark:hover:border-stone-200 hover:text-stone-900 dark:hover:text-stone-100 text-xs tracking-widest uppercase font-sans px-8 py-4 transition-colors"
          >
            {t.home.referral.cta}
          </a>
        </div>
      </section>

      {/* ── Pickup & Delivery ── */}
      <section className="bg-[#FAF8F4] dark:bg-stone-950 py-20 sm:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase text-gold mb-4 font-sans">{t.home.fulfillment.badge}</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">{t.home.fulfillment.headline}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-200 dark:bg-stone-700">
            <div className="bg-white dark:bg-stone-900 p-8 sm:p-10">
              <p className="text-xs tracking-widest uppercase text-gold mb-5 font-sans">{t.home.fulfillment.pickup.badge}</p>
              <p className="font-serif text-stone-900 dark:text-stone-100 text-2xl mb-4">{t.home.fulfillment.pickup.headline}</p>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                {settings?.pickupInstructions || t.home.fulfillment.pickup.fallback}
              </p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-8 sm:p-10">
              <p className="text-xs tracking-widest uppercase text-gold mb-5 font-sans">{t.home.fulfillment.delivery.badge}</p>
              <p className="font-serif text-stone-900 dark:text-stone-100 text-2xl mb-4">{t.home.fulfillment.delivery.headline}</p>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                {t.home.fulfillment.delivery.desc}
              </p>
            </div>
          </div>
          <p className="text-center text-stone-400 dark:text-stone-500 text-xs tracking-wide mt-8 font-sans uppercase">
            {t.home.fulfillment.footer}
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-stone-900 dark:bg-black py-16 px-6 text-center">
        <p className="font-serif text-2xl text-stone-100 tracking-[0.1em] mb-3">Chicoine Cookies</p>
        <div className="gold-divider mx-auto mb-5" />
        <p className="text-stone-500 text-xs tracking-widest uppercase font-sans">
          {t.home.footer.tagline}
        </p>
        <p className="text-stone-700 text-xs mt-6 font-sans">
          &copy; {new Date().getFullYear()} Chicoine Cookies
        </p>
      </footer>
    </div>
  )
}
