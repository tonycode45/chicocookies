'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useTheme } from '@/context/ThemeContext'
import { useLanguage } from '@/context/LanguageContext'
import { Lang } from '@/lib/translations'

function BagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

const LANGS: Lang[] = ['en', 'fr', 'es']

export default function Header() {
  const { hasItems, totalPacks } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-stone-100 dark:border-stone-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-base sm:text-lg tracking-[0.1em] text-stone-900 dark:text-white uppercase">
          Chicoine Cookies
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          {/* Language switcher */}
          <div className="flex items-center">
            {LANGS.map((l, i) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-1.5 py-2 text-[10px] tracking-widest uppercase font-sans transition-colors ${
                  lang === l
                    ? 'text-stone-900 dark:text-stone-100 font-semibold'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                }${i < LANGS.length - 1 ? ' border-r border-stone-200 dark:border-stone-700 mr-0.5 pr-2' : ''}`}
                aria-label={`Switch to ${l.toUpperCase()}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Nav link (desktop) */}
          <Link
            href="/#order"
            className="hidden sm:block text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 text-xs tracking-widest uppercase transition-colors font-sans px-2 py-2"
          >
            {t.nav.order}
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            aria-label={t.header.toggleTheme}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Cart */}
          <Link href="/checkout" className="relative p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
            <BagIcon />
            {hasItems && (
              <span className="absolute top-0.5 right-0.5 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {totalPacks}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
