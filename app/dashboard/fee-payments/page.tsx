"use client";

import { AlertTriangle } from "lucide-react";

const PAYMENT_DUE = {
  feeType: "Approval",
  amount: 1999,
};

const PAYMENT_HISTORY = [
  {
    fee: "Approval",
    amount: 1999,
    utr: "—",
    status: "Due",
    by: "You",
    date: "13 Sept 2026",
  },
];

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
}

export default function FeePaymentsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Fee Payments
        </h1>

        <div className="mt-5 flex flex-col gap-4 rounded-2xl border-l-4 border-red-500 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2.5 text-sm text-red-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <span className="font-bold">Payment Required</span>
              <br />
              Your {PAYMENT_DUE.feeType} payment of{" "}
              <span className="font-bold">
                {formatINR(PAYMENT_DUE.amount)}
              </span>{" "}
              is due. Complete the payment to continue your application.
            </span>
          </p>
          <button className="w-fit rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white">
            Pay Now
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-ink">Payment History</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-muted">
                <th className="pb-3 font-medium">Fee</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">UTR</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">By</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {PAYMENT_HISTORY.map((row, i) => (
                <tr key={i}>
                  <td className="py-4 pr-4 font-semibold text-ink">{row.fee}</td>
                  <td className="py-4 pr-4 text-ink">
                    {formatINR(row.amount)}
                  </td>
                  <td className="py-4 pr-4 text-muted">{row.utr}</td>
                  <td className="py-4 pr-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                      Due
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-muted">{row.by}</td>
                  <td className="py-4 text-muted">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs text-muted sm:hidden">
          ← Swipe table horizontally to view all details →
        </p>
      </div>
    </div>
  );
}
