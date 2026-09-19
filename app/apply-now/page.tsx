"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

const REASSURANCE = [
  "Takes about a minute to begin",
  "Review your details before submitting",
  "Your application is handled securely",
];

const TRUST_CHIPS = [
  {
    title: "No cost to check",
    desc: "Starting an application does not create a loan.",
  },
  {
    title: "Clear next steps",
    desc: "We explain what information is needed at each stage.",
  },
  {
    title: "You stay in control",
    desc: "Review the offer and lender terms before accepting.",
  },
];

function ApplyNowForm() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!agree) {
      setError("Please accept the Terms & Privacy Policy to continue.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/apply/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      router.push(`/apply?id=${json.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="overflow-hidden rounded-3xl border border-black/5 md:flex">
        <div className="bg-navy p-8 text-white sm:p-10 md:w-[42%]">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Start an Application
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            Find a loan that fits your plans.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/65">
            Share your mobile number to begin. This first step only helps us
            set up your application — it is not a loan approval.
          </p>

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6">
            {REASSURANCE.map((line, i) => (
              <div key={line} className="flex items-center gap-3 text-sm text-white/75">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white p-8 sm:p-10">
          <p className="text-sm font-semibold text-brand">Step 1 of 2</p>
          <h2 className="mt-1 text-2xl font-extrabold text-ink">
            Your mobile number
          </h2>
          <p className="mt-2 text-sm text-muted">
            We will use it to continue your application and keep you updated.
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            <label className="text-sm font-semibold text-ink">
              Mobile number
            </label>
            <div className="mt-2 flex items-center gap-2 border-b border-black/15 pb-2 focus-within:border-brand">
              <span className="text-sm text-muted">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                placeholder="10-digit number"
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
              />
            </div>

            <label className="mt-5 flex items-start gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 accent-[#4F3FF0]"
              />
              I agree to the{" "}
              <a href="#" className="text-brand underline underline-offset-2">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-brand underline underline-offset-2">
                Privacy Policy
              </a>
              .
            </label>

            {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? "Please wait…" : "Continue"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
              <Lock className="h-3.5 w-3.5" /> Your details are encrypted in
              transit.
            </p>
          </form>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {TRUST_CHIPS.map((chip) => (
          <div
            key={chip.title}
            className="rounded-2xl border border-black/5 bg-white p-5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light text-brand">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <p className="mt-3 text-sm font-bold text-ink">{chip.title}</p>
            <p className="mt-1 text-sm text-muted">{chip.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
        <ShieldCheck className="h-4 w-4 text-brand" />
        RBI-recognized NBFC partner — your data is never sold or shared.
      </div>
    </div>
  );
}

export default function ApplyNowPage() {
  return (
    <Suspense fallback={null}>
      <ApplyNowForm />
    </Suspense>
  );
}
