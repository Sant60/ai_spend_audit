import type { AuditFormInput, AuditResult } from "@/types/audit";

const AUDIT_DRAFT_KEY = "ai-spend-audit-draft";
const RECENT_AUDITS_KEY = "ai-spend-audit-results";

export function loadAuditDraft() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUDIT_DRAFT_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuditFormInput;
  } catch {
    return null;
  }
}

export function saveAuditDraft(input: AuditFormInput) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUDIT_DRAFT_KEY, JSON.stringify(input));
}

export function clearAuditDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUDIT_DRAFT_KEY);
}

export function saveRecentAudit(audit: AuditResult) {
  if (typeof window === "undefined") {
    return;
  }

  const existing = loadRecentAudits();
  existing[audit.id] = audit;
  window.localStorage.setItem(RECENT_AUDITS_KEY, JSON.stringify(existing));
}

export function loadRecentAudit(id: string) {
  return loadRecentAudits()[id] ?? null;
}

function loadRecentAudits() {
  if (typeof window === "undefined") {
    return {} as Record<string, AuditResult>;
  }

  const rawValue = window.localStorage.getItem(RECENT_AUDITS_KEY);

  if (!rawValue) {
    return {} as Record<string, AuditResult>;
  }

  try {
    return JSON.parse(rawValue) as Record<string, AuditResult>;
  } catch {
    return {} as Record<string, AuditResult>;
  }
}
