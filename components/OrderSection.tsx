'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { TIERS, pricePerCookie } from '@/lib/tiers';

export function OrderSection({ acceptingOrders = true }: { acceptingOrders?: boolean }) {
  const { t } = useLanguage();

  return (
    <section id="order" className="bg-bg-alt py-24 px-6 md:px-12 text-center scroll-mt-16">
      <p className="text-gold text-[11px] tracking-[6px] uppercase mb-5">
        {t.home.order.badge}
      </p>
      <h2 className="font-serif text-3xl md:text-[40px] font-normal leading-[1.3] mb-5 text-text-primary">
        {t.home.order.headline}
      </h2>
      <div className="gold-divider mb-10" />

      {!acceptingOrders && (
        <div className="border border-red-800/40 bg-red-950/30 p-3 mb-6 text-xs text-red-400 font-sans text-center max-w-[860px] mx-auto">
          {t.home.order.paused}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[860px] mx-auto">
        {TIERS.map((tier) => {
          const isPopular = tier.id === 'medium';
          return (
            <div
              key={tier.id}
              className={`relative bg-card border text-left transition-colors ${
                isPopular
                  ? 'border-gold/30 pt-14'
                  : 'border-text-primary/[0.06] hover:border-gold/20'
              } px-7 pb-9 ${isPopular ? '' : 'pt-9'}`}
            >
              {isPopular && (
                <div className="absolute top-0 left-0 right-0 bg-gold text-bg text-center text-[10px] tracking-[3px] py-2 font-semibold uppercase">
                  {t.home.order.popular}
                </div>
              )}

              <p className="font-serif text-[22px] text-text-primary mb-1">
                {tier.label}
              </p>
              <p className="text-text-muted text-xs mb-6">
                {t.home.order.flavor}
              </p>

              <p className="font-serif text-4xl text-text-primary mb-0.5">
                ${tier.price}<span className="text-base text-text-dim align-super">.00</span>
              </p>
              <p className="text-text-muted text-xs mb-1">
                ${pricePerCookie(tier)} {t.home.order.perCookie}
              </p>
              {tier.savings && (
                <p className="text-gold text-xs font-medium">
                  {t.home.order.savings[tier.id as 'medium' | 'large'] ?? tier.savings}
                </p>
              )}

              <Link
                href={acceptingOrders ? `/checkout?tier=${tier.id}` : '#'}
                aria-disabled={!acceptingOrders}
                className={`block mt-6 py-3.5 text-center text-[11px] tracking-[3px] uppercase font-medium transition-colors ${
                  isPopular
                    ? 'bg-gold text-bg border border-gold hover:bg-gold-hover hover:border-gold-hover'
                    : 'border border-text-primary/[0.12] text-text-primary hover:border-gold hover:text-gold'
                } ${!acceptingOrders ? 'pointer-events-none opacity-40' : ''}`}
              >
                {t.home.order.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
