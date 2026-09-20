# Utkarsh Capital

Next.js (App Router) + Tailwind CSS + Supabase.

## Project structure

```
app/
  page.tsx                  Marketing homepage
  layout.tsx                Root layout (fonts)
  apply-now/page.tsx        Step 1 — mobile number capture
  apply/page.tsx            Step 2 — 5-step application wizard
  dashboard/                Logged-in applicant area (layout + 7 pages)
  api/
    apply/start/route.ts    Creates the applicant row
    apply/save/route.ts     Saves one wizard step
    apply/submit/route.ts   Marks submitted, seeds progress + wallet
    dashboard/summary/route.ts   Aggregates one applicant's data
lib/
  supabase-server.ts        Service-role Supabase client (server only)
  apply-steps.ts            Step → table/field map used by /api/apply/save
supabase/
  schema.sql                Full database schema — run this first
tailwind.config.ts
.env.local.example
```

## 1. Set up Supabase

1. Create a project at supabase.com.
2. Open **SQL Editor → New query**, paste the contents of
   `supabase/schema.sql`, and run it. This creates:
   - `applicants` — **one row per user**, holding every field from all 5
     wizard steps (personal info, documents, address, loan, bank) plus
     wallet balance fields, all in a single flat row.
   - `agents`, `application_progress`, `wallet_transactions`, `letters`,
     `fee_payments` — small child tables for things that are genuinely
     *lists* per user (an applicant has many progress steps, many letters,
     many fee payments), each linked back via `applicant_id`.
3. Copy `.env.local.example` to `.env.local` and fill in:
   - `SUPABASE_URL` — Project Settings → API → Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — Project Settings → API → `service_role`
     key
4. Add the same two variables in **Vercel → Project → Settings →
   Environment Variables** before deploying (all environments).

**Why service-role only:** every table has Row Level Security turned on
with no public policies, so the anon/public key can't read or write
anything. All database access goes through the Next.js API routes in
`app/api/`, which run server-side with the service-role key. The browser
never talks to Supabase directly.

## 2. Local setup

```bash
npm install
npm run dev
```

## 3. How the flow works

- **`/apply-now`** — visitor enters their mobile number. On submit, this
  calls `POST /api/apply/start`, which either finds their existing
  in-progress application or inserts a new `applicants` row, then redirects
  to `/apply?id=<uuid>`.
- **`/apply`** — the 5-step wizard (Personal Info → Document → Address →
  Loan → Bank). Each "Continue" calls `POST /api/apply/save` with the
  step's fields, which upserts into that section's table
  (e.g. `personal_info`, `kyc_documents`) and updates `applicants.status`.
  The final step calls `POST /api/apply/submit`, which seeds the six-step
  `application_progress` timeline and creates a locked `wallets` row, then
  redirects to `/dashboard?id=<uuid>`.
- **`/dashboard`** (+ `/wallet`, `/letters`, `/fee-payments`, `/profile`) —
  each page calls `GET /api/dashboard/summary?id=<uuid>`, which joins
  everything for that applicant in one response, and renders it. If no
  `?id=` is present (e.g. you're just reviewing the design), every page
  falls back to built-in sample data instead of showing blank sections.

## 4. What's still manual / sample data

- **No authentication yet.** Anyone with an applicant's `id` in the URL can
  view their dashboard — fine for a demo, not for production. Add Supabase
  Auth (e.g. phone OTP) and update the RLS policy comments in
  `schema.sql`, or add a session check in the dashboard layout, before
  going live with real users.
- **Homepage CTAs** ("Apply Now" buttons and the hero phone form) link to
  `/apply-now`. The hero form doesn't pre-fill the number typed there —
  wire that up if you want a one-field-less flow.
- **Letters, fee payments, agent assignment** aren't created automatically
  by any backend process — they're rows you (or a future admin panel /
  cron job) will need to insert as an application moves through underwriting.
  The `wallet_transactions`, `letters`, and `fee_payments` tables are ready
  for that; nothing currently writes to them after submit.
- **QR code** on the dashboard's payment box is a static placeholder icon,
  not a real scannable code — add a library like `qrcode.react` if you want
  a working one.

## Notes

- All homepage copy lives in the arrays at the top of `app/page.tsx`
  (`LOAN_OPTIONS`, `FEATURES`, `CHARGES`, `FAQS`).
- The EMI calculator (homepage and `/apply` loan step) computes a real
  amortization formula — nothing is hardcoded.
- Only `lucide-react` and `@supabase/supabase-js` are added beyond a
  default Next.js + Tailwind install.
