import { NextResponse } from "next/server";
import { saveLead } from "@/lib/db/supabase";
import type { LeadInput } from "@/types/lead";

function validateLead(input: LeadInput) {
  return (
    input.auditId &&
    input.name.trim() &&
    input.email.trim() &&
    input.company.trim()
  );
}

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as LeadInput;

    if (!validateLead(input)) {
      return NextResponse.json(
        { error: "Add your name, email, and company." },
        { status: 400 },
      );
    }

    await saveLead(input);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Couldn't save that right now." },
      { status: 500 },
    );
  }
}
