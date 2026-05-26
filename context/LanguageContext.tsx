'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { translations, Lang } from '@/lib/translations'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: typeof translations['en']
}

const VALID_LANGS: Lang[] = ['en', 'fr', 'es']
const STORAGE_KEY = 'chicoine-lang'

const LanguageContext = createContext<LanguageContextValue | null>(null)

function detectLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && (VALID_LANGS as string[]).includes(saved)) return saved as Lang
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
    if (!(VALID_LANGS as string[]).includes(l)) return
    setLangState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
