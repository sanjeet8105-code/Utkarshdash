import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { STEP_CONFIG } from "@/lib/apply-steps";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { id, step, data } = body ?? {};

  const config = STEP_CONFIG[step];
  if (!id || !config) {
    return NextResponse.json(
      { error: "Missing or invalid applicant id / step." },
      { status: 400 }
    );
  }

  const payload: Record<string, unknown> = { applicant_id: id };
  for (const field of config.fields) {
    if (data?.[field] !== undefined) payload[field] = data[field];
  }

  const { error: upsertError } = await supabaseServer
    .from(config.table)
    .upsert(payload, { onConflict: "applicant_id" });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  const { error: statusError } = await supabaseServer
    .from("applicants")
    .update({ status: step })
    .eq("id", id);

  if (statusError) {
    return NextResponse.json({ error: statusError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
