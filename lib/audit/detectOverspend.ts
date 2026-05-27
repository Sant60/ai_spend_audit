import { findPlanById } from "@/lib/pricing/pricingData";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { AuditFinding, AuditFormInput } from "@/types/audit";

export function detectOverspend(input: AuditFormInput): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const plan = findPlanById(input.toolId, input.currentPlanId);
  const benchmarkSpend = (plan?.monthlyPrice ?? 0) * input.seats;

  // Collaboration / team plan overkill for very small teams
  if (plan && plan.kind !== "individual" && input.seats <= 2) {
    findings.push({
      title: "Collaboration plan may be oversized for this team",
      detail: `${input.seats} paid seat${input.seats === 1 ? "" : "s"} rarely justifies a shared/team plan. An individual plan per user is usually cheaper.`,
      impact: "high",
    });
  }

  // Spending over benchmark
  if (input.monthlySpend > benchmarkSpend + 15) {
    findings.push({
      title: "Monthly bill is higher than the listed price suggests",
      detail: `You entered ${formatCurrency(input.monthlySpend)}/month. Based on the plan price, expected spend is closer to ${formatCurrency(benchmarkSpend)}.`,
      impact: "medium",
    });
  }

  // Unused seats — seats exceed team size
  if (input.seats > input.teamSize) {
    findings.push({
      title: "Unused seats detected — you may be over-buying",
      detail: `You listed ${input.seats} paid seat${input.seats === 1 ? "" : "s"} for a team of ${input.teamSize}. Reducing to ${input.teamSize} seat${input.teamSize === 1 ? "" : "s"} cuts cost directly.`,
      impact: "high",
    });
  }

  // Writing use-case on a non-writing-optimised tool
  if (
    input.useCase === "writing" &&
    input.toolId !== "claude" &&
    input.monthlySpend >= 20
  ) {
    findings.push({
      title: "A writing-focused tool may reduce cost for this workflow",
      detail:
        "If the primary work is writing or long-form documents, Claude Pro ($20/user) is typically sufficient and purpose-built for it.",
      impact: "low",
    });
  }

  // Coding use-case on a general chat tool
  if (
    input.useCase === "coding" &&
    (input.toolId === "chatgpt" || input.toolId === "claude") &&
    input.seats >= 2
  ) {
    findings.push({
      title: "General-purpose AI can be expensive for pure coding workflows",
      detail:
        "Coding-first tools like Cursor or GitHub Copilot are purpose-built for devs and typically cost less per seat for code work.",
      impact: "medium",
    });
  }

  // Data use-case on expensive plan
  if (
    (input.useCase === "data" || input.useCase === "mixed") &&
    input.monthlySpend > 100
  ) {
    findings.push({
      title: "API-direct billing may reduce costs for data/mixed workloads",
      detail:
        "Data workflows with variable usage often cost less on pay-as-you-go API billing rather than flat per-seat plans.",
      impact: "medium",
    });
  }

  // Enterprise plan for small teams
  if (plan && plan.kind === "enterprise" && input.teamSize <= 5) {
    findings.push({
      title: "Enterprise tier may be unnecessary at this team size",
      detail: `Enterprise plans are designed for large orgs with compliance needs. At ${input.teamSize} people, a Team or Pro plan almost always covers the same workflows for less.`,
      impact: "high",
    });
  }

  return findings;
}
