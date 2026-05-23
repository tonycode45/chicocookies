'use client';

import { useLanguage } from '@/context/LanguageContext';

const FEATURES = [
  { num: 'I', key: 'i' as const },
  { num: 'II', key: 'ii' as const },
  { num: 'III', key: 'iii' as const },
];

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1000px] mx-auto text-left">
        {FEATURES.map(({ num, key }) => (
          <div key={key} className="pt-8 border-t border-gold/[0.12]">
            <p className="font-serif text-gold text-xl italic mb-4">{num}</p>
            <h3 className="font-serif text-[22px] font-normal mb-3.5 text-text-primary">
              {t.home.pillars[key].title}
            </h3>
            <p className="text-text-muted text-sm leading-[1.7]">
              {t.home.pillars[key].desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
