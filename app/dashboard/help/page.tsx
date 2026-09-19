"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How do I check my application status?",
    a: "Open the Dashboard tab — your current step and any pending action are shown at the top.",
  },
  {
    q: "How long does approval take?",
    a: "Most applications move from submission to approval within 24–48 hours once documents are verified.",
  },
  {
    q: "What if my payment doesn't reflect?",
    a: "Upload your payment slip from the Fee Payments tab and our team will verify it within a few hours.",
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">Help Center</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white p-5 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-brand">
            <Phone className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-bold text-ink">Call us</p>
          <p className="text-xs text-muted">1800-572-9808</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-brand">
            <Mail className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-bold text-ink">Email us</p>
          <p className="text-xs text-muted">care@utkarshcapital.com</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <MessageCircle className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-bold text-ink">WhatsApp</p>
          <p className="text-xs text-muted">Chat with your agent</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="text-base font-bold text-ink">Frequently asked</h2>
        <div className="mt-3 divide-y divide-black/5">
          {FAQS.map((item, i) => (
            <div key={item.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-sm font-semibold text-ink">{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-brand transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <p className="pb-4 text-sm text-muted">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
