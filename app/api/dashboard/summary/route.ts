import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const [applicantRes, progressRes, lettersRes, feesRes, transactionsRes] =
    await Promise.all([
      getSupabaseServer()
        .from("applicants")
        .select("*, agents(name, phone, whatsapp)")
        .eq("id", id)
        .maybeSingle(),
      getSupabaseServer()
        .from("application_progress")
        .select("*")
        .eq("applicant_id", id)
        .order("step_order"),
      getSupabaseServer()
        .from("letters")
        .select("*")
        .eq("applicant_id", id)
        .order("created_at"),
      getSupabaseServer()
        .from("fee_payments")
        .select("*")
        .eq("applicant_id", id)
        .order("created_at"),
      getSupabaseServer()
        .from("wallet_transactions")
        .select("*")
        .eq("applicant_id", id)
        .order("created_at"),
    ]);

  if (applicantRes.error) {
    return NextResponse.json({ error: applicantRes.error.message }, { status: 500 });
  }
  if (!applicantRes.data) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  return NextResponse.json({
    applicant: applicantRes.data,
    progress: progressRes.data ?? [],
    letters: lettersRes.data ?? [],
    fees: feesRes.data ?? [],
    transactions: transactionsRes.data ?? [],
  });
}
