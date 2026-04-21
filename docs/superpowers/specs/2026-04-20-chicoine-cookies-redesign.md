# Chicoine Cookies — Full Redesign Spec
**Date:** 2026-04-20
**Status:** Approved by user. Ready for implementation planning.

---

## Context

Antonio is a student who makes peanut butter oatmeal chocolate chip cookies at home and sells them at school. Family and classmates love them. The current site was built in scattered 1-hour sessions and works, but lacks cohesion, real payments, subscriptions, and photos.

**Goal:** Rebuild the site into a polished, fully functional online cookie store — 10× better than what exists today.

---

## What Exists Today

- **Stack:** Next.js 14, Tailwind CSS, TypeScript, Vercel
- **Fonts:** Playfair Display + Inter
- **Data:** Flat JSON file (`data/orders.json`) — no database
- **Auth:** Admin password via `sessionStorage` header
- **Pages:** `/` (storefront), `/checkout`, `/order-confirmation/[id]`, `/admin`
- **Tiers:** 2 cookies ($5) · 6 cookies ($14, popular) · 12 cookies ($22)
- **Payments:** Cash only — no online payments
- **Subscriptions:** Weekly drop = just a checkbox, no real recurring billing
- **Notifications:** None

---

## Chosen Approach

**Option A — Focused Upgrade.** Keep Next.js + Tailwind + Vercel. Add real services on top:

| Layer | Today | After |
|---|---|---|
| Database | Flat JSON file | Neon Postgres (Vercel Marketplace) |
| Payments | Cash only | Stripe Checkout |
| Subscriptions | Checkbox | Stripe Billing (weekly recurring) |
| Email | None | Resend (order confirmations + receipts) |
| Auth | sessionStorage password | Same (good enough for now) |

---

## Visual Design

### Direction
**Bold & Direct** — dark background (#0a0600), amber gold (#dc8c28), Georgia serif + system sans. Polished but warm. Not a fancy bakery — a real person making real cookies.

### Layout (approved synthesis of designs 2 + 5 + 7 + 9)

**Mobile:**
- Top nav: logo + "Open" badge
- Hero: byline → big headline → slogan → product description
- Subscription card (gold border, featured first)
- "Or order one time" divider → 3 price pills
- Bottom tab bar: Shop / My Orders / Subscribe / Story

**Desktop:**
- Left sidebar: logo, open/closed pill, nav items (Shop, My Orders, Subscribe, Story), founder avatar at bottom
- Main area: byline → big headline (2.1rem) → slogan → description → 3 info cards (today's status, pickup time, ingredient count)
- Right panel (sticky): subscription card featured at top → one-time tiers below → payment note

### Copy (approved)
- **Headline:** `Grandma approved.`
- **Slogan:** `"From scratch, obviously."`
- *(User noted these may be tweaked later — lock in for spec but keep flexible)*

### Color tokens
```
background:     #0a0600
surface:        #120c02
sidebar bg:     #080400
gold:           #dc8c28
gold warm:      #ffcf7a
text primary:   #fdf6ec
text muted:     #7a6a55
text dim:       #5a5040
border default: rgba(255,255,255,.07)
border gold:    rgba(220,140,40,.3)
```

---

## Pages & Features

### `/` — Homepage (redesigned)
- Hero with headline + slogan
- Story section with founder quote (personal, builds trust for parents + new visitors)
- Product tiers with cookie photo for each
- Social proof strip (testimonials)
- How it works (3 steps)
- Subscription upsell section

### `/checkout` — Upgraded
- Choose: one-time OR weekly subscription
- Stripe payment form (card, Apple Pay, Google Pay auto-included)
- Email required (for receipt)
- Pickup / delivery toggle ($5 delivery fee)

### `/order-confirmation/[id]`
- Order summary
- Status: "your cookies are being baked"
- Confirmation + receipt email sent via Resend automatically

### `/orders` — NEW: Order History
- Customer enters their email
- Shows all past orders: date, items, total, status
- Works for one-time and subscription orders
- No account/password needed

### `/subscribe` — NEW: Subscription Management
- Customer enters email to view active subscription
- Actions: pause, skip a week, cancel
- Powered by Stripe Billing customer portal

### `/admin` — Enhanced
- Same password login
- Revenue stats header: total this week/month, active subscriber count
- Orders list (from Postgres, same flow as today)
- Toggle: accepting orders on/off

### Receipts
- Stripe auto-receipt enabled on every payment
- Branded Resend email with order details, cookie count, and total
- Sent immediately after payment confirmation

---

## Data Model (Postgres)

### `orders`
| field | type | notes |
|---|---|---|
| id | uuid | primary key |
| created_at | timestamp | |
| customer_name | text | |
| phone | text | |
| email | text | required (for receipts) |
| fulfillment | enum | pickup / delivery |
| address | text | nullable |
| city | text | nullable |
| items | jsonb | array of {tierId, qty} |
| cookies_total | int | |
| subtotal | int | cents |
| delivery_fee | int | cents |
| total | int | cents |
| status | enum | new/confirmed/baking/ready/out_for_delivery/completed/cancelled |
| notes | text | nullable |
| is_event_order | bool | |
| referred_by | text | nullable |
| stripe_payment_intent_id | text | nullable |

### `subscriptions`
| field | type | notes |
|---|---|---|
| id | uuid | primary key |
| created_at | timestamp | |
| customer_email | text | |
| customer_name | text | |
| phone | text | |
| fulfillment | enum | pickup / delivery |
| tier_id | text | small/medium/large |
| status | enum | active/paused/cancelled |
| stripe_subscription_id | text | |
| stripe_customer_id | text | |

### `settings`
Single-row table (replaces settings JSON). Same fields as today + revenue aggregates cached.

---

## Tech Stack (final)

| | |
|---|---|
| Framework | Next.js 14, App Router |
| Styling | Tailwind CSS v3 |
| Database | Neon Postgres (Vercel Marketplace) |
| Payments | Stripe Checkout + Stripe Billing |
| Email | Resend |
| Hosting | Vercel (dev branch → main) |
| Language | TypeScript |

---

## Out of Scope (for now)
- Customer accounts with passwords (email lookup is enough)
- Inventory management beyond "spots left today"
- Multiple cookie flavors
- Loyalty points / referral rewards system (referral tracking already exists via ?ref=)

---

## Open Questions / Flexibility
- Headline/slogan may be tweaked during implementation — keep as a config string, not hardcoded deep in components
- Subscription pricing ($13/week) is a suggested 7% discount vs one-time; confirm before going live
- Cookie photos: user will supply real photos; placeholders used during build

---

## Next Step
Invoke `writing-plans` skill to create a phased implementation plan.
