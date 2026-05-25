import { createClient } from "@supabase/supabase-js";
import type { AuditResult } from "@/types/audit";
import type { LeadInput } from "@/types/lead";

function getSupabaseKeys() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return { url, key };
}

function getSupabaseClient() {
  const keys = getSupabaseKeys();

  if (!keys) {
    return null;
  }

  return createClient(keys.url, keys.key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function saveAudit(audit: AuditResult) {
  const client = getSupabaseClient();

  if (!client) {
    return false;
  }

  const { error } = await client.from("audits").upsert({
    id: audit.id,
    tool_name: audit.currentToolName,
    current_plan: audit.currentPlanName,
    monthly_spend: audit.input.monthlySpend,
    seats: audit.input.seats,
    team_size: audit.input.teamSize,
    use_case: audit.input.useCase,
    audit_payload: audit,
  });

  return !error;
}

export async function getAuditById(id: string) {
  const client = getSupabaseClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("audits")
    .select("audit_payload")
    .eq("id", id)
    .single();

  if (error || !data?.audit_payload) {
    return null;
  }

  return data.audit_payload as AuditResult;
}

export async function saveLead(lead: LeadInput) {
  const client = getSupabaseClient();

  if (!client) {
    return false;
  }

  const { error } = await client.from("leads").insert({
    audit_id: lead.auditId,
    name: lead.name,
    email: lead.email,
    company: lead.company,
  });

  return !error;
}
