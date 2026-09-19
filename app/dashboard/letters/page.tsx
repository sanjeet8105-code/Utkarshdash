"use client";

import { useState } from "react";
import { FileText, Eye, Download, RefreshCw } from "lucide-react";

const LETTERS = [
  {
    type: "Welcome Letter",
    docId: "WELCOME-LETTER",
    issuedOn: "—",
    status: "Issued",
  },
  {
    type: "Approval Letter",
    docId: "APPROVAL-LETTER",
    issuedOn: "—",
    status: "Issued",
  },
  {
    type: "Approval Unpaid Letter",
    docId: "DOC-1",
    issuedOn: "13 Sept 2026, 11:33 am",
    status: "Payment Due",
  },
];

function StatusBadge({ status }: { status: string }) {
  const isIssued = status === "Issued";
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
        isIssued ? "bg-brand-light text-brand" : "bg-amber-100 text-amber-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function LettersPage() {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
            My Letters
          </h1>
          <button
            onClick={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 700);
            }}
            className="flex items-center gap-2 rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Below are the documents issued for your application. You can view,
          print, or download each document.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-muted">
                <th className="pb-3 font-medium">Letter Type</th>
                <th className="pb-3 font-medium">Document ID</th>
                <th className="pb-3 font-medium">Issued On</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {LETTERS.map((letter) => (
                <tr key={letter.docId}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
                        <FileText className="h-4 w-4" />
                      </span>
                      <span className="font-semibold text-ink">
                        {letter.type}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-muted">{letter.docId}</td>
                  <td className="py-4 pr-4 text-muted">{letter.issuedOn}</td>
                  <td className="py-4 pr-4">
                    <StatusBadge status={letter.status} />
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <button className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white">
                        <Eye className="h-3.5 w-3.5" /> View / Print
                      </button>
                      <button className="flex items-center gap-1.5 rounded-full border border-brand px-4 py-2 text-xs font-semibold text-brand">
                        <Download className="h-3.5 w-3.5" /> Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs text-muted sm:hidden">
          ← Swipe table horizontally to see all columns →
        </p>
      </div>
    </div>
  );
}
