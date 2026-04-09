'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { translations, Lang } from '@/lib/translations'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: typeof translations['en']
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
})

function detectLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem('lang') as Lang | null
  if (saved && ['en', 'fr', 'es'].includes(saved)) return saved
  const code = (navigator.language || '').toLowerCase().split('-')[0]
  if (code === 'fr') return 'fr'
  if (code === 'es') return 'es'
  return 'en'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    setLangState(detectLang())
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
