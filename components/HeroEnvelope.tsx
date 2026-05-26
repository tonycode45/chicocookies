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
        <div className="relative w-full max-w-[480px] h-[280px] mx-auto mb-10 overflow-hidden rounded border border-gold/[0.12]"
          style={{ background: 'radial-gradient(ellipse at 50% 60%, #3a2710 0%, #1e1208 55%, #130c05 100%)' }}>
          {/* Subtle radial glow */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(196,155,72,0.10) 0%, transparent 65%)' }} />
          {/* Grain texture overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '180px 180px' }} />
          {/* Cookie SVG illustration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
              {/* Cookie base */}
              <circle cx="55" cy="55" r="46" fill="#c49b48" fillOpacity="0.18" stroke="#c49b48" strokeOpacity="0.35" strokeWidth="1.2"/>
              {/* Rough edge bumps */}
              <circle cx="55" cy="9" r="3.5" fill="#c49b48" fillOpacity="0.22"/>
              <circle cx="77" cy="14" r="3" fill="#c49b48" fillOpacity="0.22"/>
              <circle cx="96" cy="33" r="3" fill="#c49b48" fillOpacity="0.22"/>
              <circle cx="101" cy="55" r="3.5" fill="#c49b48" fillOpacity="0.22"/>
              <circle cx="96" cy="77" r="3" fill="#c49b48" fillOpacity="0.22"/>
              <circle cx="77" cy="96" r="3" fill="#c49b48" fillOpacity="0.22"/>
              <circle cx="55" cy="101" r="3.5" fill="#c49b48" fillOpacity="0.22"/>
              <circle cx="33" cy="96" r="3" fill="#c49b48" fillOpacity="0.22"/>
              <circle cx="14" cy="77" r="3" fill="#c49b48" fillOpacity="0.22"/>
              <circle cx="9" cy="55" r="3.5" fill="#c49b48" fillOpacity="0.22"/>
              <circle cx="14" cy="33" r="3" fill="#c49b48" fillOpacity="0.22"/>
              <circle cx="33" cy="14" r="3" fill="#c49b48" fillOpacity="0.22"/>
              {/* Chocolate chips */}
              <ellipse cx="44" cy="40" rx="5" ry="4" fill="#c49b48" fillOpacity="0.55"/>
              <ellipse cx="66" cy="38" rx="4.5" ry="3.5" fill="#c49b48" fillOpacity="0.50"/>
              <ellipse cx="55" cy="58" rx="5.5" ry="4.5" fill="#c49b48" fillOpacity="0.60"/>
              <ellipse cx="38" cy="62" rx="4" ry="3.5" fill="#c49b48" fillOpacity="0.45"/>
              <ellipse cx="70" cy="64" rx="4.5" ry="4" fill="#c49b48" fillOpacity="0.50"/>
              <ellipse cx="50" cy="76" rx="4" ry="3.5" fill="#c49b48" fillOpacity="0.45"/>
              <ellipse cx="66" cy="78" rx="3.5" ry="3" fill="#c49b48" fillOpacity="0.40"/>
            </svg>
          </div>
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-12" style={{ background: 'linear-gradient(to top, rgba(19,12,5,0.6), transparent)' }} />
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
