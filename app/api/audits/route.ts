import { NextResponse } from "next/server";
import { generateAudit } from "@/lib/audit/generateAudit";
import { generateSummary } from "@/lib/ai/generateSummary";
import { saveAudit } from "@/lib/db/supabase";
import { checkRateLimit, getClientIp } from "@/lib/utils/rateLimit";
import type { AuditFormInput } from "@/types/audit";

function validateAuditInput(input: AuditFormInput) {
  return (
    input.toolId &&
    input.currentPlanId &&
    input.monthlySpend >= 0 &&
    input.seats > 0 &&
    input.teamSize > 0 &&
    input.useCase
  );
}

export async function POST(request: Request) {
  // Rate limit: 10 audits per IP per hour
  const ip = getClientIp(request);
  const { ok } = checkRateLimit(ip, {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
  });

  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const body = (await request.json()) as AuditFormInput & { _hp?: string };

    // Honeypot field — bots fill this, humans don't
    if (body._hp && body._hp.length > 0) {
      // Silently accept but don't process
      return NextResponse.json({ audit: null }, { status: 200 });
    }

    const { _hp: _ignored, ...input } = body; // eslint-disable-line @typescript-eslint/no-unused-vars

    if (!validateAuditInput(input as AuditFormInput)) {
      return NextResponse.json(
        { error: "Fill out every field first." },
        { status: 400 },
      );
    }

    const baseAudit = generateAudit(input as AuditFormInput);
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
