"use client";

import { Lock, Sparkles, Info, Receipt, Wallet as WalletIcon } from "lucide-react";

const WALLET = {
  sanctionedLoan: 800000,
  balance: 0,
  emi: 47678,
  tenureMonths: 18,
};

const TRANSACTIONS = [
  {
    label: "Approval",
    date: "13/9/2026",
    status: "Due",
    amount: 1999,
  },
];

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function WalletPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-brand">Customer Wallet</p>
      <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">My Wallet</h1>

      {/* Locked wallet card */}
      <div className="relative mt-6 overflow-hidden rounded-2xl bg-navy p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
        <p className="flex items-center gap-2 text-sm text-white/70">
          <Lock className="h-4 w-4" /> Wallet Locked
        </p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-white/50">
          Your Sanctioned Loan
        </p>
        <p className="mt-1 text-3xl font-extrabold sm:text-4xl">
          {formatINR(WALLET.sanctionedLoan)}
        </p>
        <p className="mt-3 text-sm text-white/60">
          Credited after fee payment, document and bank approval.
        </p>
      </div>

      {/* Wallet balance */}
      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-600">
              <Sparkles className="h-4 w-4" /> Wallet Balance
            </p>
            <p className="mt-2 text-2xl font-extrabold text-ink">
              {formatINR(WALLET.balance)}
            </p>
          </div>
          <button className="w-fit rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white">
            Withdraw
          </button>
        </div>
        <p className="mt-4 border-t border-amber-200/70 pt-4 text-xs text-amber-700">
          Wallet activates once your fee payment, documents and bank details
          are approved.
        </p>
      </div>

      {/* Upload notice */}
      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-brand-light p-5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <div>
          <p className="text-sm font-bold text-ink">
            Upload your documents for wallet credit
          </p>
          <p className="mt-1 text-sm text-muted">
            Once your fee payment, documents and bank details are approved,
            your sanctioned loan amount will reflect in this wallet.
          </p>
        </div>
      </div>

      {/* Transaction history */}
      <div className="mt-5 rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-base font-bold text-brand">
          <Receipt className="h-4 w-4" /> Transaction History
        </h2>
        <div className="mt-4 flex flex-col divide-y divide-black/5">
          {TRANSACTIONS.map((tx) => (
            <div
              key={tx.label}
              className="flex items-center justify-between py-3.5"
            >
              <div>
                <p className="text-sm font-bold text-ink">{tx.label}</p>
                <p className="text-xs text-muted">{tx.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-600">
                  {tx.status}
                </span>
                <span className="text-sm font-bold text-ink">
                  {formatINR(tx.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loan summary */}
      <div className="mt-5 rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-base font-bold text-brand">
          <WalletIcon className="h-4 w-4" /> Loan Summary
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-[#FAFAFE] p-4">
            <p className="text-xs text-muted">Loan Amount</p>
            <p className="mt-1 text-sm font-bold text-ink">
              {formatINR(WALLET.sanctionedLoan)}
            </p>
          </div>
          <div className="rounded-xl bg-[#FAFAFE] p-4">
            <p className="text-xs text-muted">Estimated EMI</p>
            <p className="mt-1 text-sm font-bold text-ink">
              {formatINR(WALLET.emi)}
            </p>
          </div>
          <div className="rounded-xl bg-[#FAFAFE] p-4">
            <p className="text-xs text-muted">Tenure</p>
            <p className="mt-1 text-sm font-bold text-ink">
              {WALLET.tenureMonths} months
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
