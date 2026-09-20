import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const mobile = body?.mobile?.toString().trim();

  if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
    return NextResponse.json(
      { error: "Enter a valid 10-digit Indian mobile number." },
      { status: 400 }
    );
  }

  // Reuse an in-progress application for the same number instead of
  // creating a duplicate every time someone re-enters their number.
  const { data: existing, error: lookupError } = await getSupabaseServer()
    .from("applicants")
    .select("id, status")
    .eq("mobile_number", mobile)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ id: existing.id, status: existing.status });
  }

  const { data, error } = await getSupabaseServer()
    .from("applicants")
    .insert({ mobile_number: mobile, status: "started" })
    .select("id, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, status: data.status });
}
