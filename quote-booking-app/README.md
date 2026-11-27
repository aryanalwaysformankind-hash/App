# Quote & Booking Tool

A working web app for tradespeople: build a quote in under a minute, send the client a link, and track jobs.

## Run it
Open `index.html` in a browser, or serve the folder: `python3 -m http.server 8000` then visit http://localhost:8000

## What works now
- Sign up, brand name/phone/colour, settings (deposit %, validity, tax, currency)
- Quote builder with live total and deposit
- Client link (the quote is encoded in the link) with an Accept button
- Jobs list with statuses; data is saved in the browser (localStorage)

## What you still need to build (the real business)
1. **Backend and database** (Supabase or Firebase): real accounts, quotes saved online so the client's Accept reaches you from their phone.
2. **Stripe Checkout**: create a session for the deposit amount on Accept and mark the job "Deposit paid" via a Stripe webhook. Replace the manual "Mark deposit paid" button.
3. **Calendar and PDF**: add booked jobs to a calendar and generate a PDF of the quote.
4. **Logo upload, email/SMS sending, your own domain.**

Tip: give this folder to Claude Code or Lovable and ask it to do steps 1-3 in that order.
