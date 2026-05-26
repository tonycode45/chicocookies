import getResend from '@/lib/resend'
import type { Order } from '@/lib/db/orders'

const FROM = process.env.RESEND_FROM ?? 'Chicoine Cookies <onboarding@resend.dev>'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

type EmailCopy = { subject: string; heading: string; body: string }

function copyFor(order: Order): EmailCopy | null {
  const isDelivery = order.fulfillment === 'delivery'
  switch (order.status) {
    case 'confirmed':
      return {
        subject: `Your Chicoine Cookies order is confirmed — ${order.id}`,
        heading: 'Order Confirmed',
        body: isDelivery
          ? "We've got your order and we're getting started. We'll email you the moment your cookies are on the way."
          : "We've got your order and we're getting started. We'll email you the moment it's ready for pickup.",
      }
    case 'out_for_delivery':
      return {
        subject: 'Your cookies are on the way!',
        heading: 'Out for Delivery',
        body: 'Your cookies just left the kitchen and are on their way to you. See you soon!',
      }
    case 'completed':
      return {
        subject: isDelivery ? 'Your cookies have arrived — enjoy!' : 'Thanks for your order — enjoy!',
        heading: isDelivery ? 'Delivered' : 'Order Complete',
        body: 'Thank you for ordering from Chicoine Cookies. We hope you love every bite.',
      }
    default:
      return null
  }
}

export async function sendOrderStatusEmail(order: Order) {
  if (!process.env.RESEND_API_KEY) return
  if (!order.email) return

  const copy = copyFor(order)
  if (!copy) return

  const trackUrl = `${BASE_URL}/order-confirmation/${order.id}`
  const totalDisplay = `$${(order.total / 100).toFixed(2)}`

  await getResend().emails.send({
    from: FROM,
    to: order.email,
    subject: copy.subject,
    html: `
      <div style="background:#0a0600;color:#fdf6ec;font-family:Georgia,serif;padding:40px;max-width:560px;margin:0 auto;">
        <p style="color:#dc8c28;font-family:system-ui,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 24px;">Chicoine Cookies</p>
        <h1 style="font-size:32px;margin:0 0 8px;">${copy.heading}</h1>
        <p style="color:#7a6a55;font-family:system-ui,sans-serif;font-size:14px;margin:0 0 28px;">${copy.body}</p>
        <a href="${trackUrl}" style="display:inline-block;background:#dc8c28;color:#0a0600;font-family:system-ui,sans-serif;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;text-decoration:none;padding:16px 32px;margin:0 0 32px;">
          Track your order
        </a>
        <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:24px;">
          <p style="font-family:system-ui,sans-serif;font-size:13px;color:#7a6a55;margin:0 0 4px;">Order ID</p>
          <p style="font-size:16px;margin:0 0 16px;">${order.id}</p>
          <p style="font-family:system-ui,sans-serif;font-size:13px;color:#7a6a55;margin:0 0 4px;">Total</p>
          <p style="font-size:24px;margin:0;">${totalDisplay}</p>
        </div>
        <p style="font-family:system-ui,sans-serif;font-size:11px;color:#5a5040;margin-top:40px;">
          &copy; ${new Date().getFullYear()} Chicoine Cookies
        </p>
      </div>
    `,
  })
}
