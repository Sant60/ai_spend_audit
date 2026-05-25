import { NextResponse } from "next/server";
import { generateAudit } from "@/lib/audit/generateAudit";
import { generateSummary } from "@/lib/ai/generateSummary";
import { saveAudit } from "@/lib/db/supabase";
import type { AuditFormInput } from "@/types/audit";

function validateAuditInput(input: AuditFormInput) {
  return (
    input.toolId &&
    input.currentPlanId &&
    input.monthlySpend > 0 &&
    input.seats > 0 &&
    input.teamSize > 0 &&
    input.useCase
  );
}

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as AuditFormInput;

    if (!validateAuditInput(input)) {
      return NextResponse.json(
        { error: "Fill out every field first." },
        { status: 400 },
      );
    }

    const baseAudit = generateAudit(input);
    const summary = await generateSummary(baseAudit);
    const audit = { ...baseAudit, summary };

    await saveAudit(audit);

    return NextResponse.json({ audit });
  } catch {
    return NextResponse.json(
      { error: "Couldn't generate report right now." },
      { status: 500 },
    );
  }
}
