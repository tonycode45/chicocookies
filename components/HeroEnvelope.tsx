'use client';

import { useLanguage } from '@/context/LanguageContext';

export function HeroEnvelope() {
  const { t } = useLanguage();

  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 md:px-12 py-20">
      <div className="relative border border-gold/[0.15] px-8 py-14 md:px-[72px] md:py-16 text-center max-w-[680px] w-full">
        {/* Corner accents */}
        <div className="corner-tl" />
        <div className="corner-tr" />
        <div className="corner-bl" />
        <div className="corner-br" />

        <p className="text-gold text-[10px] tracking-[6px] uppercase mb-7">
          {t.home.hero.badge}
        </p>

        <h1 className="font-serif text-3xl md:text-[46px] font-normal leading-[1.25] mb-6 text-text-primary">
          {t.home.hero.headline}
        </h1>

        <div className="gold-divider mb-6" />

        <p className="text-text-muted text-[15px] leading-[1.8] max-w-[420px] mx-auto mb-9">
          {t.home.hero.description}
        </p>

        {/* Cookie photo placeholder */}
        <div className="w-full max-w-[480px] h-[280px] mx-auto mb-10 bg-gold/[0.04] border border-gold/[0.08] rounded flex items-center justify-center">
          <span className="text-text-faint text-[10px] tracking-[3px] uppercase">Cookie photo</span>
        </div>

        <a
          href="#order"
          className="inline-block bg-text-primary text-bg px-12 py-4 text-[11px] tracking-[4px] uppercase font-semibold transition-colors hover:bg-gold"
        >
          {t.home.hero.cta}
        </a>
      </div>
    </section>
  );
}
