"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getStoredApplicantId, setStoredApplicantId } from "@/lib/applicant-session";

// Call this from inside a component that's already wrapped in <Suspense>
// (because it uses useSearchParams). It resolves which applicant is
// "logged in": prefer ?id= from the URL (and remember it for next time),
// otherwise fall back to the id remembered from a previous /login, and if
// neither exists, send the visitor to /login instead of showing anyone's
// dashboard.
export function useApplicantId(): string | null {
  const router = useRouter();
  const urlId = useSearchParams().get("id");
  const [id, setId] = useState<string | null>(urlId);

  useEffect(() => {
    if (urlId) {
      setStoredApplicantId(urlId);
      setId(urlId);
      return;
    }
    const stored = getStoredApplicantId();
    if (stored) {
      setId(stored);
    } else {
      router.replace("/login");
    }
  }, [urlId, router]);

  return id;
}
