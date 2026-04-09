'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const copyShareLink = () => {
    const link = `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${orderId}`
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const shareMessage = `Just ordered from Chicoine Cookies — handcrafted peanut butter oatmeal chocolate chip cookies, baked fresh. You need to try these. Mention my order (${orderId}) and we both get $5 off!`

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-stone-950 flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center">
        <p className="text-xs tracking-widest uppercase text-gold mb-6 font-sans">{t.confirmation.badge}</p>

        <h1 className="font-serif text-5xl text-stone-900 dark:text-stone-100 mb-4">{t.confirmation.headline}</h1>

        <div className="gold-divider mx-auto mb-6" />

        <p className="text-stone-500 dark:text-stone-400 mb-3">
          {t.confirmation.received}
        </p>

        <p className="text-stone-400 dark:text-stone-500 text-xs font-sans mb-10">
          {t.confirmation.reference} <span className="font-mono text-stone-600 dark:text-stone-300">{orderId}</span>
        </p>

        {/* Next steps */}
        <div className="border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-left mb-6">
          <div className="p-6">
            <p className="text-xs tracking-widest uppercase text-gold font-sans mb-5">{t.confirmation.nextSteps.badge}</p>
            <ol className="space-y-3">
              {t.confirmation.nextSteps.steps.map((step, i) => (
                <li key={i} className="flex gap-4 text-sm text-stone-500 dark:text-stone-400">
                  <span className="font-serif text-gold flex-shrink-0">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Referral CTA */}
        <div className="border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-left mb-8">
          <div className="p-6">
            <p className="text-xs tracking-widest uppercase text-gold font-sans mb-3">{t.confirmation.referral.badge}</p>
            <p className="font-serif text-stone-900 dark:text-stone-100 text-lg mb-2">{t.confirmation.referral.headline}</p>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-5">
              {t.confirmation.referral.description}{' '}
              <strong className="text-stone-700 dark:text-stone-300">{t.confirmation.referral.bold}</strong>{' '}
              {t.confirmation.referral.description2}
            </p>
            <div className="flex gap-2">
              <button
                onClick={copyShareLink}
                className="flex-1 bg-stone-900 dark:bg-stone-100 hover:bg-stone-700 dark:hover:bg-stone-300 text-white dark:text-stone-900 text-xs tracking-widest uppercase font-sans py-4 transition-colors font-medium"
              >
                {copied ? t.confirmation.referral.copied : t.confirmation.referral.copy}
              </button>
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={() => navigator.share({ title: 'Chicoine Cookies', text: shareMessage })}
                  className="border border-stone-200 dark:border-stone-600 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:border-stone-400 dark:hover:border-stone-400 text-xs tracking-widest uppercase font-sans px-5 transition-colors"
                >
                  {t.confirmation.referral.share}
                </button>
              )}
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:border-stone-900 dark:hover:border-stone-200 hover:text-stone-900 dark:hover:text-stone-100 text-xs tracking-widest uppercase font-sans px-8 py-4 transition-colors"
        >
          {t.confirmation.backHome}
        </Link>
      </div>
    </div>
  )
}
