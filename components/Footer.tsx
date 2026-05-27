'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gold/[0.06] px-8 md:px-12 pt-10 pb-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-serif text-[13px] text-text-dim tracking-widest">
            Chicoine Cookies
          </span>
          <span className="text-text-faint text-[11px] tracking-wide">
            {t.home.footer.tagline}
          </span>
        </div>
        <div className="flex gap-5">
          <a href="#order" className="text-text-faint text-[11px] tracking-[2px] uppercase hover:text-gold transition-colors">
            {t.nav.order}
          </a>
          <Link href="/orders" className="text-text-faint text-[11px] tracking-[2px] uppercase hover:text-gold transition-colors">
            {t.nav.myOrders}
          </Link>
        </div>
      </div>
      <p className="text-text-faint text-[10px] tracking-[2px] text-center">
        © 2026 Chicoine Cookies
      </p>
    </footer>
  );
}
