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

      {/* Decorative ornamental rule */}
      <div className="flex items-center justify-center gap-4 mt-10 max-w-[320px] mx-auto">
        <div className="flex-1 h-px bg-gold/20" />
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 opacity-60">
          <path d="M9 1 C9 1 11.5 5.5 17 9 C11.5 12.5 9 17 9 17 C9 17 6.5 12.5 1 9 C6.5 5.5 9 1 9 1Z" stroke="#c49b48" strokeWidth="0.8" fill="#c49b48" fillOpacity="0.15"/>
        </svg>
        <div className="flex-1 h-px bg-gold/20" />
      </div>

      <p className="font-serif text-[14px] italic text-text-muted/70 mt-5 tracking-wide">
        {t.home.signature.tagline}
      </p>
    </section>
  );
}
