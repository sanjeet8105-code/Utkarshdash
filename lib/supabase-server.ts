import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only client. Uses the service role key, which bypasses Row Level
// Security — that's intentional here, since every table has RLS enabled
// with no public policies (see supabase/schema.sql). Only import this file
// from Route Handlers or Server Components, never from a "use client" file.
//
// The client is created lazily, on first use inside a request, rather than
// at module load time. Next.js imports every route file during
// `npm run build` to collect page data — if creating the client (and its
// env var check) happened at the top level, a missing env var would throw
// during the BUILD itself and take down the whole deployment, not just the
// one route that needs Supabase.

let cached: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient {
  if (cached) return cached;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. " +
        "Add them in Vercel → Project → Settings → Environment Variables (and .env.local for local dev), then redeploy."
    );
  }

  cached = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
  return cached;
}
