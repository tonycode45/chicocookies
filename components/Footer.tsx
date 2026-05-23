'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gold/[0.06] px-8 md:px-12 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
      <span className="font-serif text-[13px] text-text-dim tracking-widest">
        Chicoine Cookies
      </span>
      <div className="flex gap-5">
        <a href="#order" className="text-text-faint text-[11px] tracking-[2px] uppercase hover:text-gold transition-colors">
          Order
        </a>
        <Link href="/orders" className="text-text-faint text-[11px] tracking-[2px] uppercase hover:text-gold transition-colors">
          My Orders
        </Link>
      </div>
    </footer>
  );
}
