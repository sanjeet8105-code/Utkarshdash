-- ============================================================================
-- Utkarsh Capital — Supabase schema
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query)
-- ============================================================================

create extension if not exists pgcrypto; -- for gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Shared trigger: keeps updated_at current on every UPDATE
-- ----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ----------------------------------------------------------------------------
-- agents — loan officers who get assigned to an applicant
-- ----------------------------------------------------------------------------
create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  whatsapp text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- applicants — one row per loan application, created the moment a mobile
-- number is captured on /apply-now. Every other table hangs off this one.
-- ----------------------------------------------------------------------------
create table if not exists applicants (
  id uuid primary key default gen_random_uuid(),
  mobile_number text not null unique,
  -- started -> personal_info -> document -> address -> loan -> bank -> submitted
  -- -> agent_assigned -> welcome_letter -> under_review -> approved -> approval_due
  status text not null default 'started',
  agent_id uuid references agents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger applicants_set_updated_at
  before update on applicants
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Step 1 — Personal Info
-- ----------------------------------------------------------------------------
create table if not exists personal_info (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null unique references applicants(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger personal_info_set_updated_at
  before update on personal_info
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Step 2 — Document (KYC)
-- ----------------------------------------------------------------------------
create table if not exists kyc_documents (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null unique references applicants(id) on delete cascade,
  aadhar_number text,
  pan_number text,
  aadhar_status text not null default 'pending', -- pending | uploaded | verified
  pan_status text not null default 'pending',
  aadhar_file_url text,
  pan_file_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger kyc_documents_set_updated_at
  before update on kyc_documents
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Step 3 — Address
-- ----------------------------------------------------------------------------
create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null unique references applicants(id) on delete cascade,
  address text,
  pincode text,
  state text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger addresses_set_updated_at
  before update on addresses
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Step 4 — Loan details
-- ----------------------------------------------------------------------------
create table if not exists loan_details (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null unique references applicants(id) on delete cascade,
  loan_amount numeric,
  loan_purpose text,
  tenure_months integer,
  interest_rate numeric,
  emi numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger loan_details_set_updated_at
  before update on loan_details
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Step 5 — Bank details
-- ----------------------------------------------------------------------------
create table if not exists bank_details (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null unique references applicants(id) on delete cascade,
  account_holder_name text,
  account_number text,
  ifsc_code text,
  account_type text, -- Savings | Current
  bank_name text,
  branch text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger bank_details_set_updated_at
  before update on bank_details
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Dashboard: step tracker shown on /dashboard
-- ----------------------------------------------------------------------------
create table if not exists application_progress (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references applicants(id) on delete cascade,
  step_order integer not null,
  step_name text not null,
  step_status text not null default 'upcoming', -- completed | current | upcoming
  description text,
  completed_at timestamptz,
  unique (applicant_id, step_order)
);

create index if not exists application_progress_applicant_idx
  on application_progress (applicant_id);

-- ----------------------------------------------------------------------------
-- Dashboard: wallet
-- ----------------------------------------------------------------------------
create table if not exists wallets (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null unique references applicants(id) on delete cascade,
  sanctioned_amount numeric not null default 0,
  balance numeric not null default 0,
  is_locked boolean not null default true,
  updated_at timestamptz not null default now()
);

create trigger wallets_set_updated_at
  before update on wallets
  for each row execute function set_updated_at();

create table if not exists wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references wallets(id) on delete cascade,
  label text not null,
  amount numeric not null,
  status text not null default 'due', -- due | paid | credited
  transaction_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists wallet_transactions_wallet_idx
  on wallet_transactions (wallet_id);

-- ----------------------------------------------------------------------------
-- Dashboard: letters
-- ----------------------------------------------------------------------------
create table if not exists letters (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references applicants(id) on delete cascade,
  letter_type text not null,
  document_id text,
  issued_on timestamptz,
  status text not null default 'pending', -- pending | issued | payment_due
  file_url text,
  created_at timestamptz not null default now()
);

create index if not exists letters_applicant_idx
  on letters (applicant_id);

-- ----------------------------------------------------------------------------
-- Dashboard: fee payments
-- ----------------------------------------------------------------------------
create table if not exists fee_payments (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references applicants(id) on delete cascade,
  fee_type text not null,
  amount numeric not null,
  utr text,
  status text not null default 'due', -- due | paid
  paid_by text,
  payment_date date,
  created_at timestamptz not null default now()
);

create index if not exists fee_payments_applicant_idx
  on fee_payments (applicant_id);

-- ============================================================================
-- Row Level Security
--
-- All writes/reads for this app go through Next.js API routes using the
-- SUPABASE_SERVICE_ROLE_KEY (server-side only), which bypasses RLS entirely.
-- The browser never talks to Supabase directly, so we leave RLS ON with NO
-- public policies below — that means the anon/public key can't read or write
-- anything, even if it leaked.
--
-- If you later add Supabase Auth (e.g. phone OTP) and want the browser to
-- query Supabase directly, add policies like:
--
--   create policy "applicants can read own row"
--     on applicants for select
--     using (mobile_number = auth.jwt() ->> 'phone');
--
-- ============================================================================

alter table agents enable row level security;
alter table applicants enable row level security;
alter table personal_info enable row level security;
alter table kyc_documents enable row level security;
alter table addresses enable row level security;
alter table loan_details enable row level security;
alter table bank_details enable row level security;
alter table application_progress enable row level security;
alter table wallets enable row level security;
alter table wallet_transactions enable row level security;
alter table letters enable row level security;
alter table fee_payments enable row level security;

-- ============================================================================
-- Sample agent (optional) — lets applicants get assigned to someone real
-- immediately after submitting. Safe to delete or edit.
-- ============================================================================
insert into agents (name, phone, whatsapp)
values ('Ashish K.', '+91 75860 39825', '+91 75860 39825')
on conflict do nothing;
