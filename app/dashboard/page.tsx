"use client";

import {
  CheckCircle2,
  Clock,
  FileText,
  IndianRupee,
  Wallet,
  QrCode,
  Upload,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Sample data — replace with a Supabase fetch keyed on the logged-in */
/*  applicant's id once auth is wired up.                             */
/* ------------------------------------------------------------------ */

const APPLICATION = {
  id: "APP2394857610293",
  applicantName: "Rahul Kumar",
  loanPurpose: "Personal Loan",
  loanAmount: 800000,
  tenureMonths: 18,
  interestRate: 9,
  emi: 47678,
  status: "Approval Due",
  pendingFee: 1999,
  walletBalance: 800000,
};

const STEPS = [
  {
    title: "Application Submitted",
    desc: "Your loan application has been submitted successfully.",
  },
  {
    title: "Agent Assigned",
    desc: "Ashish K. has been assigned to assist you.",
  },
  {
    title: "Welcome Letter Sent",
    desc: "Your welcome letter has been issued for this application.",
  },
  {
    title: "Under Review",
    desc: "Your application review has been completed.",
  },
  {
    title: "Approved",
    desc: "Your loan application has been approved and the sanctioned loan amount has been credited to your wallet.",
  },
  {
    title: "Approval Due",
    desc: `Please pay ₹${APPLICATION.pendingFee.toLocaleString("en-IN")} to continue.`,
  },
];

const CURRENT_STEP = 5; // zero-indexed — "Approval Due"

const CHECKLIST = [
  { name: "Aadhaar Card", status: "pending" },
  { name: "PAN Card", status: "pending" },
];

const PAY_TO = {
  accountHolder: "Utkarsh Capital Pvt Ltd",
  bankName: "Jharkhand Rajya Gramin Bank",
  accountNumber: "84040841962",
  ifsc: "SBIN0RRVCGB",
  upi: "8084326199@ptyes",
};

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold text-emerald-600">
        Loan Application Dashboard
      </p>
      <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">
        Welcome, {APPLICATION.applicantName}
      </h1>

      {/* Step tracker */}
      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Application ID
        </p>
        <p className="text-sm font-bold text-ink">{APPLICATION.id}</p>

        <div className="mt-6 flex items-start overflow-x-auto pb-2">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-1 items-start last:flex-none">
              <div className="flex min-w-[92px] flex-col items-center gap-2 text-center">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    i < CURRENT_STEP
                      ? "bg-emerald-600 text-white"
                      : i === CURRENT_STEP
                      ? "bg-amber-500 text-white"
                      : "bg-black/5 text-muted"
                  }`}
                >
                  {i < CURRENT_STEP ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={`text-[11px] font-semibold leading-tight sm:text-xs ${
                    i <= CURRENT_STEP ? "text-ink" : "text-muted"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mt-4 h-0.5 flex-1 ${
                    i < CURRENT_STEP ? "bg-emerald-600" : "bg-black/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-black/5 bg-white p-4">
          <FileText className="h-4 w-4 text-brand" />
          <p className="mt-2 text-xs text-muted">Application ID</p>
          <p className="text-sm font-bold text-ink">{APPLICATION.id}</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-4">
          <Clock className="h-4 w-4 text-amber-500" />
          <p className="mt-2 text-xs text-muted">Status</p>
          <p className="text-sm font-bold text-ink">{APPLICATION.status}</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-4">
          <IndianRupee className="h-4 w-4 text-brand" />
          <p className="mt-2 text-xs text-muted">Loan Amount</p>
          <p className="text-sm font-bold text-ink">
            {formatINR(APPLICATION.loanAmount)}
          </p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-4">
          <IndianRupee className="h-4 w-4 text-brand" />
          <p className="mt-2 text-xs text-muted">Estimated EMI</p>
          <p className="text-sm font-bold text-ink">
            {formatINR(APPLICATION.emi)}
          </p>
        </div>
      </div>

      {/* Wallet banner */}
      <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-emerald-700 p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Wallet className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-white/70">Available Wallet Balance</p>
            <p className="text-2xl font-extrabold">
              {formatINR(APPLICATION.walletBalance)}
            </p>
            <p className="mt-0.5 text-xs text-white/70">
              Loan amount credited. Please clear approval to proceed.
            </p>
          </div>
        </div>
        <button className="w-fit rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-emerald-700">
          Withdraw
        </button>
      </div>

      {/* Progress timeline */}
      <div className="mt-5 rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-ink">Application Progress Timeline</h2>

        <div className="relative mt-6 flex flex-col gap-7 pl-4">
          <span className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-black/10" />
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative flex gap-4">
              <span
                className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  i < CURRENT_STEP
                    ? "bg-emerald-600 text-white"
                    : i === CURRENT_STEP
                    ? "bg-amber-100 text-amber-600"
                    : "bg-black/5 text-muted"
                }`}
              >
                {i < CURRENT_STEP ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : i === CURRENT_STEP ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{i + 1}</span>
                )}
              </span>
              <div className="flex-1">
                <p
                  className={`text-sm font-bold ${
                    i <= CURRENT_STEP ? "text-ink" : "text-muted"
                  }`}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 text-sm text-muted">{step.desc}</p>

                {i === CURRENT_STEP && (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <p className="flex items-center gap-2 text-sm font-bold text-ink">
                      <IndianRupee className="h-4 w-4 text-amber-600" />
                      Payment Required
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-amber-600">
                      {formatINR(APPLICATION.pendingFee)}
                    </p>
                    <p className="text-xs text-muted">Fee Type: Approval</p>

                    <div className="mt-4 grid gap-5 rounded-xl border border-amber-200/70 bg-white p-4 sm:grid-cols-[1fr_auto] sm:p-5">
                      <div className="space-y-1.5 text-sm">
                        <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                          Pay To
                        </p>
                        <p>
                          <span className="font-semibold text-ink">
                            Account Holder:
                          </span>{" "}
                          {PAY_TO.accountHolder}
                        </p>
                        <p>
                          <span className="font-semibold text-ink">
                            Bank Name:
                          </span>{" "}
                          {PAY_TO.bankName}
                        </p>
                        <p>
                          <span className="font-semibold text-ink">
                            Account Number:
                          </span>{" "}
                          {PAY_TO.accountNumber}
                        </p>
                        <p>
                          <span className="font-semibold text-ink">IFSC:</span>{" "}
                          {PAY_TO.ifsc}
                        </p>
                        <p>
                          <span className="font-semibold text-ink">UPI:</span>{" "}
                          {PAY_TO.upi}
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                          Scan to Pay
                        </p>
                        <span className="flex h-28 w-28 items-center justify-center rounded-lg border border-dashed border-amber-300 bg-amber-50/50">
                          <QrCode className="h-14 w-14 text-amber-400" strokeWidth={1} />
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button className="rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white">
                        Pay Now
                      </button>
                      <button className="flex items-center gap-2 rounded-full border border-emerald-700 px-6 py-2.5 text-sm font-semibold text-emerald-700">
                        <Upload className="h-4 w-4" /> Upload Payment Slip
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submission checklist */}
      <div className="mt-5 rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-ink">Submission Checklist</h2>
        <div className="mt-4 flex flex-col gap-3">
          {CHECKLIST.map((doc) => (
            <div
              key={doc.name}
              className="flex items-center justify-between rounded-xl border border-black/5 bg-[#FAFAFE] px-4 py-3.5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{doc.name}</p>
                  <p className="text-xs text-muted">Click to upload document</p>
                </div>
              </div>
              <button className="text-sm font-semibold text-brand">Upload</button>
            </div>
          ))}
        </div>
      </div>

      {/* Agent + Help */}
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
          <h3 className="text-base font-bold text-ink">Your Agent</h3>
          <p className="mt-3 text-sm font-semibold text-ink">Ashish K.</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            <Phone className="h-4 w-4" /> +91 75860 39825
          </p>
          <button className="mt-4 flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white">
            <MessageCircle className="h-4 w-4" /> WhatsApp Support
          </button>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
          <h3 className="text-base font-bold text-ink">Need Help?</h3>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted">
            <Phone className="h-4 w-4" /> Toll Free: 1800-572-9808
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <Mail className="h-4 w-4" /> care@utkarshcapital.com
          </p>
        </div>
      </div>

      {/* Application summary */}
      <div className="mt-5 rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-ink">Application Summary</h2>
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted">Applicant</p>
            <p className="text-sm font-bold text-ink">
              {APPLICATION.applicantName}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Loan Applied For</p>
            <p className="text-sm font-bold text-ink">
              {APPLICATION.loanPurpose}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Loan Amount</p>
            <p className="text-sm font-bold text-ink">
              {formatINR(APPLICATION.loanAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Tenure</p>
            <p className="text-sm font-bold text-ink">
              {APPLICATION.tenureMonths} months
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Interest Rate</p>
            <p className="text-sm font-bold text-ink">
              {APPLICATION.interestRate}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Estimated EMI</p>
            <p className="text-sm font-bold text-ink">
              {formatINR(APPLICATION.emi)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Current Application Status</p>
            <p className="text-sm font-bold text-amber-600">
              {APPLICATION.status}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Pending Fee</p>
            <p className="text-sm font-bold text-ink">
              {formatINR(APPLICATION.pendingFee)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
