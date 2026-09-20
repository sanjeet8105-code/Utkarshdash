"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { setStoredApplicantId } from "@/lib/applicant-session";

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStoredApplicantId(json.id);
      router.push(`/dashboard?id=${json.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFE] px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 sm:p-10">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand font-extrabold text-white">
            U
          </span>
          <span className="text-lg font-bold text-ink">Utkarsh Capital</span>
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-ink">
          Check your application
        </h1>
        <p className="mt-2 text-sm text-muted">
          Enter the mobile number you applied with to open your dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="text-sm font-semibold text-ink">Mobile number</label>
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-black/10 px-4 py-3 focus-within:border-brand">
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

          {error && (
            <div className="mt-3 text-xs font-medium text-red-600">
              {error}{" "}
              {error.toLowerCase().includes("no application") && (
                <a href="/apply-now" className="underline underline-offset-2">
                  Start a new application
                </a>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Checking…" : "Continue"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Lock className="h-3.5 w-3.5" /> Your details are encrypted in transit.
          </p>
        </form>

        <p className="mt-6 flex items-center justify-center gap-2 border-t border-black/5 pt-5 text-xs text-muted">
          <ShieldCheck className="h-4 w-4 text-brand" />
          Don&apos;t have an application yet?{" "}
          <a href="/apply-now" className="font-semibold text-brand underline underline-offset-2">
            Apply now
          </a>
        </p>
      </div>
    </div>
  );
}
