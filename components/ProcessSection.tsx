'use client';

import { useLanguage } from '@/context/LanguageContext';

export function ProcessSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-6 md:px-12 text-center">
      <p className="text-gold text-[11px] tracking-[6px] uppercase mb-5">
        {t.home.howItWorks.badge}
      </p>
      <h2 className="font-serif text-3xl md:text-[40px] font-normal leading-[1.3] mb-5 text-text-primary">
        {t.home.howItWorks.headline}
      </h2>
      <div className="gold-divider mb-10" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[900px] mx-auto text-center">
        {t.home.howItWorks.steps.map((step) => (
          <div key={step.n}>
            <p className="text-gold text-xs tracking-[3px] font-semibold mb-4">{step.n}</p>
            <h3 className="font-serif text-xl font-normal mb-3 text-text-primary">
              {step.title}
            </h3>
            <p className="text-text-muted text-sm leading-[1.7]">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
