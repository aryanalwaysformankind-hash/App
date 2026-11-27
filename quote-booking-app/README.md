# Quote & Booking Tool (v2)

Open `index.html`, or deploy the folder to Vercel/Netlify (no build step).

## New in v2
- Home dashboard: quoted this month, win rate, jobs won, deposits collected
- Follow-up reminders for quotes with no reply after 3 days (one-tap WhatsApp nudge)
- Saved services: build a quote with one tap
- Saved clients with auto-filled phone numbers
- Send by WhatsApp, email or link; client page with Save as PDF/Print
- Brand colour and business name on every quote

## Still needed for a real business
1. Backend/database (Supabase) so data syncs across devices and a client's Accept reaches you
2. Stripe Checkout for the deposit, with a webhook to mark "Deposit paid"
3. Calendar booking, logo upload, sending emails/SMS from the server
