import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
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

  const updates: Record<string, unknown> = { status: step };
  for (const field of config.fields) {
    if (data?.[field] !== undefined) updates[field] = data[field];
  }

  const { error } = await getSupabaseServer()
    .from("applicants")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
