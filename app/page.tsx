import Link from 'next/link'
import { getSettings } from '@/lib/db/settings'

const COPY = {
  byline: 'Handmade in small batches',
  headline: 'Grandma approved.',
  slogan: '"From scratch, obviously."',
  description: 'Peanut butter oatmeal chocolate chip cookies, baked fresh to order by a student who takes this seriously.',
}

const TIERS_DISPLAY = [
  { id: 'small',  label: '2 Cookies',  price: 5  },
  { id: 'medium', label: '6 Cookies',  price: 14, popular: true },
  { id: 'large',  label: '12 Cookies', price: 22 },
]

export default async function HomePage() {
  const settings = await getSettings()

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">

      {/* ── Sidebar (desktop only) ── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-sidebar border-r border-white/5 sticky top-0 h-screen">
        <div className="p-8 flex-1">
          <p className="font-serif text-text-primary text-lg tracking-wide mb-1">Chicoine</p>
          <p className="font-serif text-gold text-xs tracking-widest uppercase mb-8">Cookies</p>

          <div className={`inline-flex items-center gap-2 mb-10 px-3 py-1 border text-[10px] font-sans tracking-widest uppercase ${
            settings.acceptingOrders
              ? 'border-green-700/40 text-green-400'
              : 'border-red-700/40 text-red-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${settings.acceptingOrders ? 'bg-green-400' : 'bg-red-400'}`} />
            {settings.acceptingOrders ? 'Open' : 'Closed'}
          </div>

          <nav className="space-y-1">
            {[{ href: '/', label: 'Shop' }, { href: '/orders', label: 'My Orders' }, { href: '/subscribe', label: 'Subscribe' }].map(({ href, label }) => (
              <Link key={href} href={href} className="block py-2 text-sm font-sans text-text-muted hover:text-text-primary transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-8 border-t border-white/5">
          <p className="text-text-dim text-xs font-sans">Antonio C.</p>
          <p className="text-text-dim text-[10px] font-sans mt-0.5">Founder & baker</p>
        </div>
      </aside>

      {/* ── Main area ── */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-screen">

        {/* Content */}
        <div className="flex-1 px-6 pt-12 pb-24 md:px-12 md:pt-16 max-w-2xl">

          {/* Mobile header */}
          <div className="flex items-center justify-between mb-10 md:hidden">
            <p className="font-serif text-text-primary">Chicoine Cookies</p>
            <span className={`text-xs font-sans ${settings.acceptingOrders ? 'text-green-400' : 'text-red-400'}`}>
              {settings.acceptingOrders ? '● Open' : '● Closed'}
            </span>
          </div>

          {/* Hero */}
          <p className="text-xs tracking-widest uppercase text-gold font-sans mb-6">{COPY.byline}</p>
          <h1 className="font-serif text-5xl md:text-6xl text-text-primary leading-tight mb-4">{COPY.headline}</h1>
          <p className="font-serif text-text-muted text-lg italic mb-6">{COPY.slogan}</p>
          <p className="text-text-muted font-sans text-sm leading-relaxed mb-10 max-w-md">{COPY.description}</p>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3 mb-14">
            {[
              { label: 'Today', value: settings.batchInfo },
              { label: 'Pickup', value: '4–7pm' },
              { label: 'Made with', value: '7 ingredients' },
            ].map(({ label, value }) => (
              <div key={label} className="border border-white/10 p-4">
                <p className="text-gold text-[10px] tracking-widest uppercase font-sans mb-1">{label}</p>
                <p className="text-text-primary font-serif text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Story */}
          <div className="border-l-2 border-gold/30 pl-6 mb-14">
            <blockquote className="font-serif text-text-primary text-lg italic leading-relaxed mb-3">
              &ldquo;I started making these for my family. Grandma said they were the best she&apos;d ever had. That felt like enough to start selling them.&rdquo;
            </blockquote>
            <p className="text-text-dim text-xs font-sans tracking-widest uppercase">Antonio · Grade 10</p>
          </div>

          {/* Testimonials */}
          <div className="space-y-3 mb-14">
            <p className="text-xs tracking-widest uppercase text-text-muted font-sans mb-4">What people say</p>
            {[
              { quote: 'These are dangerously good.', name: 'Sophie M.' },
              { quote: "I bought the 12-pack thinking I'd share. I didn't.", name: 'Tyler K.' },
              { quote: 'My kids ask for these by name now.', name: 'Mrs. Tremblay' },
            ].map(({ quote, name }) => (
              <div key={name} className="border border-white/10 p-4">
                <p className="font-serif text-text-primary text-sm italic mb-2">&ldquo;{quote}&rdquo;</p>
                <p className="text-text-dim text-xs font-sans">— {name}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div>
            <p className="text-xs tracking-widest uppercase text-text-muted font-sans mb-6">How it works</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { n: '01', title: 'Order online', desc: 'Pick your size and pay.' },
                { n: '02', title: 'Baked fresh', desc: 'Made same-day in small batches.' },
                { n: '03', title: 'Pickup or delivery', desc: 'At school or your door.' },
              ].map(({ n, title, desc }) => (
                <div key={n}>
                  <p className="text-gold text-xs font-sans tracking-widest mb-2">{n}</p>
                  <p className="font-serif text-text-primary text-sm mb-1">{title}</p>
                  <p className="text-text-muted text-xs font-sans leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sticky order panel ── */}
        <aside className="lg:w-80 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto border-t border-white/5 lg:border-t-0 lg:border-l lg:border-white/5 p-6">

          {/* Subscription card */}
          <div className="border border-gold/30 p-5 mb-6">
            <p className="text-[10px] tracking-widest uppercase text-gold font-sans mb-3">Best value</p>
            <p className="font-serif text-text-primary text-lg mb-1">Weekly subscription</p>
            <p className="text-text-muted text-xs font-sans mb-4 leading-relaxed">Fresh cookies every week. Skip or cancel anytime.</p>
            <div className="space-y-2 mb-5">
              {[{ label: '2 cookies / week', price: '$5' }, { label: '6 cookies / week', price: '$13' }, { label: '12 cookies / week', price: '$21' }].map(({ label, price }) => (
                <div key={label} className="flex justify-between text-sm font-sans">
                  <span className="text-text-muted">{label}</span>
                  <span className="text-text-primary">{price}/wk</span>
                </div>
              ))}
            </div>
            <Link href="/subscribe" className="block w-full text-center bg-gold hover:bg-gold-warm text-bg text-xs tracking-widest uppercase font-sans py-3 transition-colors">
              Subscribe →
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-white/10" />
            <p className="text-text-dim text-[10px] tracking-widest uppercase font-sans">Or order once</p>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {!settings.acceptingOrders && (
            <div className="border border-red-800/40 bg-red-950/30 p-3 mb-4 text-xs text-red-400 font-sans text-center">
              Not accepting orders right now
            </div>
          )}

          <div className="space-y-2 mb-6">
            {TIERS_DISPLAY.map((tier) => (
              <Link key={tier.id}
                href={settings.acceptingOrders ? `/checkout?tier=${tier.id}` : '#'}
                className={`flex items-center justify-between border px-4 py-3 transition-colors ${
                  tier.popular ? 'border-gold/30 hover:border-gold' : 'border-white/10 hover:border-white/20'
                } ${!settings.acceptingOrders ? 'pointer-events-none opacity-40' : ''}`}>
                <div>
                  <p className="font-serif text-text-primary text-sm">{tier.label}</p>
                  {tier.popular && <p className="text-gold text-[10px] font-sans tracking-widest uppercase">Popular</p>}
                </div>
                <p className="font-serif text-text-primary">${tier.price}</p>
              </Link>
            ))}
          </div>

          <p className="text-text-dim text-[10px] font-sans text-center">Secure payment via Stripe · CAD</p>
        </aside>
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-white/5 flex z-10">
        {[{ href: '/', label: 'Shop' }, { href: '/orders', label: 'Orders' }, { href: '/subscribe', label: 'Subscribe' }].map(({ href, label }) => (
          <Link key={href} href={href} className="flex-1 py-4 text-center text-xs font-sans text-text-muted hover:text-gold transition-colors tracking-widest uppercase">
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
