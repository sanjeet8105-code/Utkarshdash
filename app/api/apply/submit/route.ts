import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

const DEFAULT_STEPS = [
  {
    step_order: 1,
    step_name: "Application Submitted",
    description: "Your loan application has been submitted successfully.",
  },
  {
    step_order: 2,
    step_name: "Agent Assigned",
    description: "An agent will be assigned to assist you shortly.",
  },
  {
    step_order: 3,
    step_name: "Welcome Letter Sent",
    description: "Your welcome letter will be issued for this application.",
  },
  {
    step_order: 4,
    step_name: "Under Review",
    description: "Your application will be reviewed by our team.",
  },
  {
    step_order: 5,
    step_name: "Approved",
    description:
      "Once approved, the sanctioned loan amount will be credited to your wallet.",
  },
  {
    step_order: 6,
    step_name: "Approval Due",
    description: "Any pending fee will need to be cleared to continue.",
  },
];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const id = body?.id;

  if (!id) {
    return NextResponse.json({ error: "Missing applicant id." }, { status: 400 });
  }

  const { error: statusError } = await getSupabaseServer()
    .from("applicants")
    .update({ status: "submitted" })
    .eq("id", id);

  if (statusError) {
    return NextResponse.json({ error: statusError.message }, { status: 500 });
  }

  const progressRows = DEFAULT_STEPS.map((step, i) => ({
    applicant_id: id,
    ...step,
    step_status: i === 0 ? "completed" : "upcoming",
    completed_at: i === 0 ? new Date().toISOString() : null,
  }));

  const { error: progressError } = await getSupabaseServer()
    .from("application_progress")
    .upsert(progressRows, { onConflict: "applicant_id,step_order" });

  if (progressError) {
    return NextResponse.json({ error: progressError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
