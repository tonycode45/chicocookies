# Chicoine Cookies — Production Launch Design

Date: 2026-05-26  
Branch: redesign/chicoine-cookies-v2  
Status: Approved, implementation in progress

---

## Overview

Five independent tasks to take Chicoine Cookies from test/local to a real production system with live payments, dynamic delivery pricing, and customer order tracking.

---

## Task 1 — Live Stripe + Environment Switch

**Scope:** Environment variables only, no code changes.

- Swap `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` from Stripe test keys to live keys in Vercel environment variables
- Register a new live webhook endpoint in the Stripe dashboard pointing to the production URL
- Update `STRIPE_WEBHOOK_SECRET` in Vercel to the live webhook signing secret
- Redeploy on Vercel to pick up the new env vars
- Smoke test with a real $1 charge to confirm end-to-end

**Files touched:** None (env vars only)

---

## Task 2 — Distance-Based Delivery Fee

**Scope:** New API route + checkout page update.

### Delivery zones (from LaSalle, QC as origin)

| Zone | Distance | Fee | Example areas |
|------|----------|-----|---------------|
| 1 | 0–5 km | $5 | LaSalle, Lachine, Verdun |
| 2 | 5–10 km | $9 | NDG, Côte-Saint-Luc, Ville-Émard |
| 3 | 10–15 km | $13 | Downtown, Plateau, Rosemont |
| Out of range | > 15 km | No delivery | — |

### New route: `POST /api/delivery-fee`

- Accepts `{ address: string, city: string }`
- Calls Google Maps Distance Matrix API server-side with origin = "LaSalle, Montreal, QC"
- Returns `{ fee: number, zone: number, distanceKm: number }` or `{ error: 'OUT_OF_RANGE' }`
- Requires `GOOGLE_MAPS_API_KEY` env var

### Checkout page changes

- When fulfillment = delivery and address fields are filled, debounce-call `/api/delivery-fee`
- Show the calculated fee inline before the customer can proceed
- If OUT_OF_RANGE, show: "Sorry, we don't deliver to this address (max 15 km from LaSalle)."
- Pass the calculated `deliveryFee` to the Stripe checkout session creation

**New env var required:** `GOOGLE_MAPS_API_KEY`

---

## Task 3 — Minimum Order Enforcement

**Scope:** Checkout page validation + server-side guard.

- If fulfillment = delivery and subtotal < $30, disable the submit button and show: "Delivery requires a minimum order of $30."
- Server-side: in `/api/stripe/checkout`, validate subtotal >= $30 before creating the session — return 400 if not met
- The 2-cookie tier ($5) remains available but delivery will always be blocked at that size

**Minimum:** $30 subtotal (before delivery fee)

---

## Task 4 — Customer Order Tracking Page

**Scope:** New public page at `/order/[id]`.

### Page: `/order/[id]`

- Public, no login required
- Fetches order from DB by ID
- Shows:
  - Order summary (items, subtotal, delivery fee, total)
  - Delivery address (if delivery)
  - Visual status timeline with 5 steps: Confirmed → Baking → Ready → Out for Delivery → Delivered
  - Current step highlighted
- Polls `/api/orders/[id]/status` every 30 seconds for live updates
- If order not found: show "Order not found" with a link to homepage

### Status values (already in codebase)

`new` → `confirmed` → `baking` → `ready` → `out_for_delivery` → `completed` | `cancelled`

### After Stripe payment success

- Stripe redirects to `/order/[id]?success=1`
- The `?success=1` param shows a "Payment received!" banner at the top
- The order ID comes from the Stripe session metadata (already stored on order creation)

**Files to create/modify:**
- `app/order/[id]/page.tsx` (new)
- `app/api/orders/[id]/status/route.ts` (new, returns `{ status }` only)

---

## Task 5 — Customer Email Notifications

**Scope:** Resend email triggers on status changes.

Resend is already integrated. Three emails are sent:

### Email 1 — Order Confirmed
- Trigger: after Stripe webhook confirms payment
- Subject: "Your Chicoine Cookies order is confirmed! 🍪"
- Content: order summary + big CTA button → `/order/[id]`

### Email 2 — Out for Delivery
- Trigger: when admin updates status to `out_for_delivery`
- Subject: "Your cookies are on the way!"
- Content: short message + tracking link

### Email 3 — Delivered
- Trigger: when admin updates status to `completed`
- Subject: "Your cookies have arrived — enjoy!"
- Content: thank-you note + tracking link for reference

### Implementation

- Add a `sendStatusEmail(order, status)` helper in `lib/email.ts`
- Call it from the admin status-update API route (`/api/orders/[id]`) when status changes to `out_for_delivery` or `completed`
- Call the confirmation email from the Stripe webhook handler

**Existing infrastructure:** `RESEND_API_KEY` already in env, email templates to be created in `lib/email.ts`

---

## Shared constraints

- All work happens on branch `redesign/chicoine-cookies-v2`
- DB is Neon Postgres (already provisioned)
- Do not change the order data model — fields are stable
- Stripe API version: `2026-03-25.dahlia`
