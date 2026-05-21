import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { LanguageProvider } from '@/context/LanguageContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: 'Chicoine Cookies',
  description: 'Handcrafted peanut butter oatmeal chocolate chip cookies, baked fresh to order.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning prevents a mismatch warning caused by ThemeProvider
    // toggling the `dark` class on <html> client-side after hydration.
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-bg text-text-primary antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>{children}</CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
