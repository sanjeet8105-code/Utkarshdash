// Temporary "session" for the mobile-number-only login. There's no OTP or
// real auth yet, so this just remembers which applicant id is "logged in"
// on this browser, in localStorage, so navigating between /dashboard pages
// doesn't lose context after the first ?id= redirect from /login.
//
// Replace this with a real session (Supabase Auth, a signed cookie, etc.)
// once OTP verification is added — at that point the id should come from
// a verified session, not a value the browser can set itself.

const KEY = "uc_applicant_id";

export function getStoredApplicantId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setStoredApplicantId(id: string) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, id);
}

export function clearStoredApplicantId() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}
