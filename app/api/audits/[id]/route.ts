import { NextResponse } from "next/server";
import { getAuditById } from "@/lib/db/supabase";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const audit = await getAuditById(id);

  if (!audit) {
    return NextResponse.json({ audit: null }, { status: 404 });
  }

  return NextResponse.json({ audit });
}
