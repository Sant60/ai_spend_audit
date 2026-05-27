import { NextResponse } from "next/server";
import { saveLead } from "@/lib/db/supabase";
import { checkRateLimit, getClientIp } from "@/lib/utils/rateLimit";
import type { LeadInput } from "@/types/lead";

function validateLead(input: LeadInput) {
  return (
    input.auditId &&
    input.name?.trim() &&
    input.email?.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())
  );
}

export async function POST(request: Request) {
  // Rate limit: 5 lead submissions per IP per hour
  const ip = getClientIp(request);
  const { ok } = checkRateLimit(ip, {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
  });

  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const body = (await request.json()) as LeadInput & { _hp?: string };

    // Honeypot: bots fill hidden fields
    if (body._hp && body._hp.length > 0) {
      return NextResponse.json({ success: true });
    }

    const { _hp: _ignored, ...input } = body; // eslint-disable-line @typescript-eslint/no-unused-vars

    if (!validateLead(input as LeadInput)) {
      return NextResponse.json(
        { error: "Please provide a valid name and email address." },
        { status: 400 },
      );
    }

    await saveLead(input as LeadInput);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Couldn't save that right now." },
      { status: 500 },
    );
  }
}
