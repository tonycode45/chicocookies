'use client';

import { useLanguage } from '@/context/LanguageContext';

export function SignatureSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-bg-alt py-24 px-6 md:px-12 text-center">
      <p className="text-gold text-[11px] tracking-[6px] uppercase mb-5">
        {t.home.signature.badge}
      </p>
      <h2 className="font-serif text-3xl md:text-[40px] font-normal leading-[1.3] mb-5 text-text-primary">
        {t.home.signature.headline}
      </h2>
      <div className="gold-divider mb-8" />
      <p className="text-text-muted text-[15px] leading-[1.8] max-w-[560px] mx-auto">
        {t.home.signature.description}
      </p>
    </section>
  );
}
