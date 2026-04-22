import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: 'Chicoine Cookies',
  description: 'Handcrafted peanut butter oatmeal chocolate chip cookies, baked fresh to order.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-bg text-text-primary antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
