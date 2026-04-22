import getResend from '@/lib/resend'

interface ReceiptParams {
  to: string
  orderId: string
  total: number // cents
}

export async function sendReceiptEmail({ to, orderId, total }: ReceiptParams) {
  if (!process.env.RESEND_API_KEY) return

  const totalDisplay = `$${(total / 100).toFixed(2)}`

  await getResend().emails.send({
    from: 'Chicoine Cookies <orders@chicoinecookies.com>',
    to,
    subject: `Your cookie order is confirmed — ${orderId}`,
    html: `
      <div style="background:#0a0600;color:#fdf6ec;font-family:Georgia,serif;padding:40px;max-width:560px;margin:0 auto;">
        <p style="color:#dc8c28;font-family:system-ui,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 24px;">Chicoine Cookies</p>
        <h1 style="font-size:32px;margin:0 0 8px;">Order Confirmed</h1>
        <p style="color:#7a6a55;font-family:system-ui,sans-serif;font-size:14px;margin:0 0 32px;">"From scratch, obviously."</p>
        <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:24px;">
          <p style="font-family:system-ui,sans-serif;font-size:13px;color:#7a6a55;margin:0 0 4px;">Order ID</p>
          <p style="font-size:16px;margin:0 0 16px;">${orderId}</p>
          <p style="font-family:system-ui,sans-serif;font-size:13px;color:#7a6a55;margin:0 0 4px;">Total</p>
          <p style="font-size:24px;margin:0 0 32px;">${totalDisplay}</p>
        </div>
        <p style="font-family:system-ui,sans-serif;font-size:13px;color:#7a6a55;">
          Your cookies are being baked. We'll be in touch with pickup/delivery details.
        </p>
        <p style="font-family:system-ui,sans-serif;font-size:11px;color:#5a5040;margin-top:40px;">
          &copy; ${new Date().getFullYear()} Chicoine Cookies
        </p>
      </div>
    `,
  })
}
