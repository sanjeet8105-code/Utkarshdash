-- ============================================================================
-- Utkarsh Capital — Supabase schema (v2: single consolidated user profile)
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).
--
-- This REPLACES the earlier normalized version. It drops the old
-- personal_info / kyc_documents / addresses / loan_details / bank_details /
-- wallets tables (if they exist) and consolidates everything into one
-- `applicants` row per user. Safe to run even if you already ran the old
-- schema — just note it deletes any test data in those tables.
-- ============================================================================

create extension if not exists pgcrypto; -- for gen_random_uuid()

drop table if exists wallet_transactions cascade;
drop table if exists fee_payments cascade;
drop table if exists letters cascade;
drop table if exists application_progress cascade;
drop table if exists wallets cascade;
drop table if exists bank_details cascade;
drop table if exists loan_details cascade;
drop table if exists addresses cascade;
drop table if exists kyc_documents cascade;
drop table if exists personal_info cascade;
drop table if exists applicants cascade;
drop table if exists agents cascade;

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
create table agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  whatsapp text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- applicants — ONE ROW PER USER. Created the moment a mobile number is
-- captured on /apply-now, then filled in as they move through the 5-step
-- wizard on /apply. Every field for personal info, documents, address,
-- loan, bank, and wallet lives right here.
-- ----------------------------------------------------------------------------
create table applicants (
  id uuid primary key default gen_random_uuid(),
  mobile_number text not null unique,

  -- started -> personal_info -> document -> address -> loan -> bank -> submitted
  -- -> agent_assigned -> welcome_letter -> under_review -> approved -> approval_due
  status text not null default 'started',
  agent_id uuid references agents(id) on delete set null,

  -- Step 1 — Personal Info
  full_name text,
  email text,

  -- Step 2 — Document (KYC)
  aadhar_number text,
  pan_number text,
  aadhar_status text not null default 'pending', -- pending | uploaded | verified
  pan_status text not null default 'pending',

  -- Step 3 — Address
  address text,
  pincode text,
  state text,
  city text,

  -- Step 4 — Loan details
  loan_amount numeric,
  loan_purpose text,
  tenure_months integer,
  interest_rate numeric,
  emi numeric,

  -- Step 5 — Bank details
  account_holder_name text,
  account_number text,
  ifsc_code text,
  account_type text, -- Savings | Current
  bank_name text,
  branch text,

  -- Dashboard: wallet (1:1 with the user, so it lives here too)
  wallet_sanctioned_amount numeric not null default 0,
  wallet_balance numeric not null default 0,
  wallet_locked boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger applicants_set_updated_at
  before update on applicants
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Dashboard: step tracker (one applicant has many progress rows)
-- ----------------------------------------------------------------------------
create table application_progress (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references applicants(id) on delete cascade,
  step_order integer not null,
  step_name text not null,
  step_status text not null default 'upcoming', -- completed | current | upcoming
  description text,
  completed_at timestamptz,
  unique (applicant_id, step_order)
);

create index application_progress_applicant_idx
  on application_progress (applicant_id);

-- ----------------------------------------------------------------------------
-- Dashboard: wallet transaction history (one applicant has many)
-- ----------------------------------------------------------------------------
create table wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references applicants(id) on delete cascade,
  label text not null,
  amount numeric not null,
  status text not null default 'due', -- due | paid | credited
  transaction_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index wallet_transactions_applicant_idx
  on wallet_transactions (applicant_id);

-- ----------------------------------------------------------------------------
-- Dashboard: letters (one applicant has many)
-- ----------------------------------------------------------------------------
create table letters (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references applicants(id) on delete cascade,
  letter_type text not null,
  document_id text,
  issued_on timestamptz,
  status text not null default 'pending', -- pending | issued | payment_due
  file_url text,
  created_at timestamptz not null default now()
);

create index letters_applicant_idx
  on letters (applicant_id);

-- ----------------------------------------------------------------------------
-- Dashboard: fee payments (one applicant has many)
-- ----------------------------------------------------------------------------
create table fee_payments (
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

create index fee_payments_applicant_idx
  on fee_payments (applicant_id);

-- ============================================================================
-- Row Level Security
--
-- All reads/writes go through Next.js API routes using SUPABASE_SERVICE_ROLE_KEY
-- (server-side only), which bypasses RLS. RLS stays ON with no public
-- policies below, so the anon/public key can't touch these tables at all —
-- safe to leave as-is until you build the admin page's own auth.
-- ============================================================================

alter table agents enable row level security;
alter table applicants enable row level security;
alter table application_progress enable row level security;
alter table wallet_transactions enable row level security;
alter table letters enable row level security;
alter table fee_payments enable row level security;

-- ============================================================================
-- Sample agent (optional)
-- ============================================================================
insert into agents (name, phone, whatsapp)
values ('Ashish K.', '+91 75860 39825', '+91 75860 39825')
on conflict do nothing;
