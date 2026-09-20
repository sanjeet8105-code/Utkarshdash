import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

// Mobile-number-only "login" — no OTP yet (that's the next step). This just
// checks whether an application exists for the given number and, if so,
// hands back its id so the browser can load that applicant's dashboard.
//
// NOTE: this is not secure on its own — anyone who knows (or guesses) a
// registered mobile number can "log in" as that applicant. It's fine while
// you're wiring up the flow, but add real OTP verification before this
// handles real users.
export async function POST(req: Request) {
const body = await req.json().catch(() => null);
const mobile = body?.mobile?.toString().trim();

if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
return NextResponse.json(
{ error: "Enter a valid 10-digit mobile number." },
{ status: 400 }
);
}

const { data, error } = await getSupabaseServer()
.from("applicants")
.select("id")
.eq("mobile_number", mobile)
.maybeSingle();

if (error) {
return NextResponse.json({ error: error.message }, { status: 500 });
}

if (!data) {
return NextResponse.json(
{ error: "No application found for this mobile number." },
{ status: 404 }
);
}

return NextResponse.json({ id: data.id });
}
