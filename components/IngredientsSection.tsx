'use client'

import { useLanguage } from '@/context/LanguageContext'
import { translations } from '@/lib/translations'

export default function IngredientsSection() {
  const { lang } = useLanguage()
  const t = translations[lang].home.ingredients

  return (
    <div className="mb-14">
      <p className="text-xs tracking-widest uppercase text-gold font-sans mb-2">{t.badge}</p>
      <h2 className="font-serif text-text-primary text-2xl mb-2">{t.headline}</h2>
      <p className="text-text-muted text-sm font-sans mb-6">{t.description}</p>

      <div className="border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6">
        <div className="grid grid-cols-1 gap-2">
          {t.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-gold text-[10px] font-sans tabular-nums w-4 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-serif text-text-primary text-sm">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-text-dim text-[10px] font-sans tracking-widest uppercase mt-6 pt-4 border-t border-white/5">
          {t.footer}
        </p>
      </div>
    </div>
  )
}
