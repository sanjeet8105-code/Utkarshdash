"use client";

import { Suspense, useEffect, useState } from "react";
import { useApplicantId } from "@/lib/use-applicant-id";
import { AlertTriangle } from "lucide-react";

const SAMPLE_HISTORY = [
  { fee: "Approval", amount: 1999, utr: "—", status: "Due", by: "You", date: "13 Sept 2026" },
];

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    value
  );
}

function FeePaymentsInner() {
  const id = useApplicantId();
  const [fees, setFees] = useState<any[] | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/dashboard/summary?id=${id}`)
      .then((r) => r.json())
      .then((json) => !json.error && setFees(json.fees ?? []))
      .catch(() => {});
  }, [id]);

  const rows =
    fees && fees.length > 0
      ? fees.map((f: any) => ({
          fee: f.fee_type,
          amount: f.amount,
          utr: f.utr ?? "—",
          status: f.status === "due" ? "Due" : "Paid",
          by: f.paid_by ?? "You",
          date: f.payment_date
            ? new Date(f.payment_date).toLocaleDateString("en-IN")
            : new Date(f.created_at).toLocaleDateString("en-IN"),
        }))
      : SAMPLE_HISTORY;

  const due = rows.find((r) => r.status === "Due");

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">Fee Payments</h1>

        {due && (
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border-l-4 border-red-500 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2.5 text-sm text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <span className="font-bold">Payment Required</span>
                <br />
                Your {due.fee} payment of{" "}
                <span className="font-bold">{formatINR(due.amount)}</span> is
                due. Complete the payment to continue your application.
              </span>
            </p>
            <button className="w-fit rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white">
              Pay Now
            </button>
          </div>
        )}
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
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="py-4 pr-4 font-semibold text-ink">{row.fee}</td>
                  <td className="py-4 pr-4 text-ink">{formatINR(row.amount)}</td>
                  <td className="py-4 pr-4 text-muted">{row.utr}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        row.status === "Due"
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {row.status}
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

export default function FeePaymentsPage() {
  return (
    <Suspense fallback={null}>
      <FeePaymentsInner />
    </Suspense>
  );
}
