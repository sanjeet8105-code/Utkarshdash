import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const [
    applicantRes,
    personalRes,
    loanRes,
    bankRes,
    walletRes,
    progressRes,
    lettersRes,
    feesRes,
  ] = await Promise.all([
    supabaseServer
      .from("applicants")
      .select("*, agents(name, phone, whatsapp)")
      .eq("id", id)
      .maybeSingle(),
    supabaseServer.from("personal_info").select("*").eq("applicant_id", id).maybeSingle(),
    supabaseServer.from("loan_details").select("*").eq("applicant_id", id).maybeSingle(),
    supabaseServer.from("bank_details").select("*").eq("applicant_id", id).maybeSingle(),
    supabaseServer
      .from("wallets")
      .select("*, wallet_transactions(*)")
      .eq("applicant_id", id)
      .maybeSingle(),
    supabaseServer
      .from("application_progress")
      .select("*")
      .eq("applicant_id", id)
      .order("step_order"),
    supabaseServer
      .from("letters")
      .select("*")
      .eq("applicant_id", id)
      .order("created_at"),
    supabaseServer
      .from("fee_payments")
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
    personalInfo: personalRes.data ?? null,
    loan: loanRes.data ?? null,
    bank: bankRes.data ?? null,
    wallet: walletRes.data ?? null,
    progress: progressRes.data ?? [],
    letters: lettersRes.data ?? [],
    fees: feesRes.data ?? [],
  });
}
