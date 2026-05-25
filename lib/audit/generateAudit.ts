import { TOOL_OPTIONS } from "@/constants/tools";
import { calculateSavings } from "@/lib/audit/calculateSavings";
import { detectOverspend } from "@/lib/audit/detectOverspend";
import { recommendPlan } from "@/lib/audit/recommendPlan";
import { generateId } from "@/lib/utils/generateId";
import type { AuditFormInput, AuditResult } from "@/types/audit";

export function generateAudit(input: AuditFormInput): AuditResult {
  const tool = TOOL_OPTIONS.find((item) => item.id === input.toolId);
  const currentPlan = tool?.plans.find((plan) => plan.id === input.currentPlanId);

  if (!tool || !currentPlan) {
    throw new Error("Could not generate audit for the selected tool.");
  }

  const recommendation = recommendPlan(input);
  const benchmarkSpend = currentPlan.monthlyPrice * input.seats;
  const monthlySavings = calculateSavings(input.monthlySpend, recommendation.monthlyCost);
  const findings = detectOverspend(input);
  const id = generateId();

  return {
    id,
    createdAt: new Date().toISOString(),
    shareUrl: `/result/${id}`,
    input,
    currentToolName: tool.name,
    currentPlanName: currentPlan.name,
    benchmarkSpend,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    overspend: monthlySavings > 0 || findings.length > 0,
    findings,
    recommendation,
    summary: "",
  };
}
