import type { UseCase } from "@/types/tool";

export interface AuditFormInput {
  toolId: string;
  currentPlanId: string;
  monthlySpend: number;
  seats: number;
  teamSize: number;
  useCase: UseCase;
}

export interface AuditFinding {
  title: string;
  detail: string;
  impact: "high" | "medium" | "low";
}

export interface AuditRecommendation {
  toolId: string;
  toolName: string;
  planId: string;
  planName: string;
  monthlyCost: number;
  seats: number;
  switchType: "keep" | "downgrade" | "switch-tool";
  reason: string;
}

export interface AuditResult {
  id: string;
  createdAt: string;
  shareUrl: string;
  input: AuditFormInput;
  currentToolName: string;
  currentPlanName: string;
  benchmarkSpend: number;
  monthlySavings: number;
  annualSavings: number;
  overspend: boolean;
  findings: AuditFinding[];
  recommendation: AuditRecommendation;
  summary: string;
}
