'use client';

import { useLanguage } from '@/context/LanguageContext';

export function IngredientsSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-bg-alt py-24 px-6 md:px-12 text-center">
      <p className="text-gold text-[11px] tracking-[6px] uppercase mb-5">
        {t.home.ingredients.badge}
      </p>
      <h2 className="font-serif text-3xl md:text-[40px] font-normal leading-[1.3] mb-5 text-text-primary">
        {t.home.ingredients.headline}
      </h2>
      <div className="gold-divider mb-8" />
      <p className="text-text-muted text-[15px] leading-[1.8] max-w-[560px] mx-auto mb-8">
        {t.home.ingredients.description}
      </p>

      <div className="flex flex-wrap justify-center gap-2.5 max-w-[640px] mx-auto">
        {t.home.ingredients.items.map((name) => (
          <span
            key={name}
            className="border border-text-primary/[0.1] px-5 py-2.5 text-[13px] text-text-primary tracking-wide transition-colors hover:border-gold/30"
          >
            {name}
          </span>
        ))}
      </div>

      <p className="text-text-dim text-xs tracking-[4px] uppercase mt-9">
        {t.home.ingredients.footer}
      </p>
    </section>
  );
}
