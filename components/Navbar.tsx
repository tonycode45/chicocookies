'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';

const LANGS = ['en', 'fr', 'es'] as const;

export function Navbar() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const { theme, toggleTheme } = useTheme();
  const { hasItems, totalPacks } = useCart();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-12 h-16 border-b border-gold/[0.08] bg-bg/95 backdrop-blur-md">
      <Link href="/" className="font-serif text-[15px] text-text-primary tracking-[4px] uppercase">
        Chicoine Cookies
      </Link>

      <div className="flex items-center gap-1.5">
        {/* Language toggle */}
        <div className="flex gap-0.5 mr-4">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`text-[11px] px-2 py-1 tracking-wider uppercase transition-colors ${
                lang === l ? 'text-text-primary' : 'text-text-dim hover:text-gold'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Order link */}
        <a
          href="#order"
          className="text-text-primary text-[11px] tracking-[3px] uppercase px-3 py-1 transition-colors hover:text-gold"
        >
          {t.nav.order}
        </a>

        <div className="w-px h-5 bg-text-primary/[0.08] mx-2" />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="text-text-muted text-base px-2.5 py-1 transition-colors hover:text-gold"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>

        {/* Cart */}
        <Link
          href="/checkout"
          className="text-text-muted text-base px-2.5 py-1 transition-colors hover:text-gold relative"
          aria-label="Cart"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {hasItems && (
            <span className="absolute -top-1 -right-1 bg-gold text-bg text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
              {totalPacks}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
