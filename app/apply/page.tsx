"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  FileText,
  Home as HomeIcon,
  Coins,
  Landmark,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { STEP_ORDER } from "@/lib/apply-steps";

const STEPS = [
  { key: "personal_info", label: "Personal Info", icon: User },
  { key: "document", label: "Document", icon: FileText },
  { key: "address", label: "Address", icon: HomeIcon },
  { key: "loan", label: "Loan", icon: Coins },
  { key: "bank", label: "Bank", icon: Landmark },
] as const;

type FormState = {
  full_name: string;
  email: string;
  aadhar_number: string;
  pan_number: string;
  address: string;
  pincode: string;
  state: string;
  city: string;
  loan_amount: string;
  loan_purpose: string;
  tenure_months: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  account_type: string;
  bank_name: string;
  branch: string;
};

const INITIAL_STATE: FormState = {
  full_name: "",
  email: "",
  aadhar_number: "",
  pan_number: "",
  address: "",
  pincode: "",
  state: "",
  city: "",
  loan_amount: "80000",
  loan_purpose: "Personal Loan",
  tenure_months: "24",
  account_holder_name: "",
  account_number: "",
  ifsc_code: "",
  account_type: "Savings",
  bank_name: "",
  branch: "",
};

const INTEREST_RATE = 9; // flat sample rate shown to the applicant

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink">{label}</label>
      <input
        {...props}
        className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-brand focus:outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink">{label}</label>
      <select
        {...props}
        className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 text-sm text-ink focus:border-brand focus:outline-none"
      >
        {children}
      </select>
    </div>
  );
}

function ApplyWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const emi = useMemo(() => {
    const amount = Number(form.loan_amount) || 0;
    const months = Number(form.tenure_months) || 1;
    const r = INTEREST_RATE / 12 / 100;
    const value =
      r === 0
        ? amount / months
        : (amount * r * Math.pow(1 + r, months)) /
          (Math.pow(1 + r, months) - 1);
    return Math.round(value);
  }, [form.loan_amount, form.tenure_months]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  if (!id) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-sm text-muted">
          We couldn&apos;t find your application. Please start again with
          your mobile number.
        </p>
        <button
          onClick={() => router.push("/apply-now")}
          className="mt-5 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"
        >
          Go to Apply Now
        </button>
      </div>
    );
  }

  async function saveStep(stepKey: string, data: Record<string, unknown>) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/apply/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, step: stepKey, data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not save this step.");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this step.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleContinue() {
    const stepKey = STEP_ORDER[stepIndex];
    let payload: Record<string, unknown> = {};

    if (stepKey === "personal_info") {
      if (!form.full_name || !form.email) {
        setError("Please fill in your name and email.");
        return;
      }
      payload = { full_name: form.full_name, email: form.email };
    } else if (stepKey === "document") {
      if (!form.aadhar_number || !form.pan_number) {
        setError("Please enter both Aadhar and PAN numbers.");
        return;
      }
      payload = { aadhar_number: form.aadhar_number, pan_number: form.pan_number };
    } else if (stepKey === "address") {
      if (!form.address || !form.pincode || !form.state || !form.city) {
        setError("Please complete your address details.");
        return;
      }
      payload = {
        address: form.address,
        pincode: form.pincode,
        state: form.state,
        city: form.city,
      };
    } else if (stepKey === "loan") {
      if (!form.loan_amount || !form.tenure_months) {
        setError("Please enter a loan amount and tenure.");
        return;
      }
      payload = {
        loan_amount: Number(form.loan_amount),
        loan_purpose: form.loan_purpose,
        tenure_months: Number(form.tenure_months),
        interest_rate: INTEREST_RATE,
        emi,
      };
    } else if (stepKey === "bank") {
      if (!form.account_holder_name || !form.account_number || !form.ifsc_code) {
        setError("Please complete your bank details.");
        return;
      }
      payload = {
        account_holder_name: form.account_holder_name,
        account_number: form.account_number,
        ifsc_code: form.ifsc_code,
        account_type: form.account_type,
        bank_name: form.bank_name,
        branch: form.branch,
      };
    }

    const ok = await saveStep(stepKey, payload);
    if (!ok) return;

    if (stepIndex === STEPS.length - 1) {
      setSaving(true);
      try {
        const res = await fetch("/api/apply/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Could not submit application.");
        router.push(`/dashboard?id=${id}`);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not submit application."
        );
        setSaving(false);
      }
      return;
    }

    setStepIndex((i) => i + 1);
  }

  function handleBack() {
    setError("");
    setStepIndex((i) => Math.max(0, i - 1));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        {/* Step sidebar */}
        <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const state =
              i < stepIndex ? "done" : i === stepIndex ? "active" : "upcoming";
            return (
              <div
                key={step.key}
                className={`flex min-w-[168px] items-center gap-3 rounded-xl px-4 py-3 md:min-w-0 ${
                  state === "active"
                    ? "bg-navy text-white"
                    : state === "done"
                    ? "bg-brand-light text-brand"
                    : "bg-[#FAFAFE] text-muted"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    state === "active"
                      ? "bg-white/15 text-white"
                      : state === "done"
                      ? "bg-brand text-white"
                      : "bg-black/5 text-muted"
                  }`}
                >
                  {state === "done" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </span>
                <div>
                  <p
                    className={`text-[10px] font-medium uppercase tracking-wide ${
                      state === "active" ? "text-white/60" : "text-current opacity-60"
                    }`}
                  >
                    Step {i + 1}
                  </p>
                  <p className="text-sm font-bold">{step.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white">
          <div className="bg-navy px-6 py-4 text-sm text-white/90">
            Your information is used only to process this loan application.
          </div>

          <div className="p-6 sm:p-8">
            {stepIndex === 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  placeholder="Full Name"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                />
                <Field
                  label="Email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
            )}

            {stepIndex === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Aadhar Number"
                  placeholder="Aadhar Number"
                  value={form.aadhar_number}
                  onChange={(e) => update("aadhar_number", e.target.value)}
                />
                <Field
                  label="PAN Number"
                  placeholder="PAN Number"
                  value={form.pan_number}
                  onChange={(e) => update("pan_number", e.target.value.toUpperCase())}
                />
              </div>
            )}

            {stepIndex === 2 && (
              <div>
                <h3 className="text-base font-bold text-ink">
                  Permanent Address
                </h3>
                <p className="text-sm text-muted">
                  Please enter the permanent address same as Aadhar card.
                </p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field
                      label="Address"
                      placeholder="Enter your permanent address"
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                    />
                  </div>
                  <Field
                    label="PIN Code"
                    placeholder="PIN Code"
                    value={form.pincode}
                    onChange={(e) => update("pincode", e.target.value)}
                  />
                  <Field
                    label="State"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                  />
                  <Field
                    label="City"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                  />
                </div>
              </div>
            )}

            {stepIndex === 3 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Loan Amount"
                  type="number"
                  value={form.loan_amount}
                  onChange={(e) => update("loan_amount", e.target.value)}
                />
                <SelectField
                  label="Loan Purpose"
                  value={form.loan_purpose}
                  onChange={(e) => update("loan_purpose", e.target.value)}
                >
                  <option>Personal Loan</option>
                  <option>Home Loan</option>
                  <option>Business Loan</option>
                  <option>Education Loan</option>
                  <option>Gold Loan</option>
                  <option>Car Loan</option>
                </SelectField>
                <SelectField
                  label="Loan Tenure (in months)"
                  value={form.tenure_months}
                  onChange={(e) => update("tenure_months", e.target.value)}
                >
                  {[6, 12, 18, 24, 36, 48, 60].map((m) => (
                    <option key={m} value={m}>
                      {m} months
                    </option>
                  ))}
                </SelectField>
                <div>
                  <label className="text-sm font-semibold text-ink">
                    Estimated EMI
                  </label>
                  <div className="mt-2 rounded-lg border border-brand/30 bg-brand-light px-4 py-3 text-sm font-bold text-brand">
                    ₹{emi.toLocaleString("en-IN")} / month at {INTEREST_RATE}%
                    p.a.
                  </div>
                </div>
              </div>
            )}

            {stepIndex === 4 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Account Holder Name"
                  placeholder="Account Holder Name"
                  value={form.account_holder_name}
                  onChange={(e) => update("account_holder_name", e.target.value)}
                />
                <Field
                  label="IFSC Code"
                  placeholder="IFSC Code"
                  value={form.ifsc_code}
                  onChange={(e) => update("ifsc_code", e.target.value.toUpperCase())}
                />
                <Field
                  label="Account Number"
                  placeholder="Account Number"
                  value={form.account_number}
                  onChange={(e) => update("account_number", e.target.value)}
                />
                <SelectField
                  label="Account Type"
                  value={form.account_type}
                  onChange={(e) => update("account_type", e.target.value)}
                >
                  <option>Savings</option>
                  <option>Current</option>
                </SelectField>
                <Field
                  label="Bank Name"
                  placeholder="Bank Name"
                  value={form.bank_name}
                  onChange={(e) => update("bank_name", e.target.value)}
                />
                <Field
                  label="Branch"
                  placeholder="Branch Name"
                  value={form.branch}
                  onChange={(e) => update("branch", e.target.value)}
                />
              </div>
            )}

            {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

            <div className="mt-8 flex items-center justify-between border-t border-black/5 pt-6">
              <button
                onClick={handleBack}
                disabled={stepIndex === 0 || saving}
                className="flex items-center gap-1.5 text-sm font-semibold text-muted disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={handleContinue}
                disabled={saving}
                className="flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
              >
                {saving
                  ? "Saving…"
                  : stepIndex === STEPS.length - 1
                  ? "Submit"
                  : "Continue"}
                {!saving && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={null}>
      <ApplyWizard />
    </Suspense>
  );
}
