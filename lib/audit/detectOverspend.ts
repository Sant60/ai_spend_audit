import { findPlanById } from "@/lib/pricing/pricingData";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { AuditFinding, AuditFormInput } from "@/types/audit";

export function detectOverspend(input: AuditFormInput): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const plan = findPlanById(input.toolId, input.currentPlanId);
  const benchmarkSpend = (plan?.monthlyPrice ?? 0) * input.seats;

  if (plan && plan.kind !== "individual" && input.seats <= 2) {
    findings.push({
      title: `${plan.name} may be too much for this team`,
      detail: `${input.seats} paid seat${input.seats === 1 ? "" : "s"} usually doesn't justify a shared plan yet.`,
      impact: "high",
    });
  }

  if (input.monthlySpend > benchmarkSpend + 15) {
    findings.push({
      title: "The current bill looks higher than expected",
      detail: `You entered ${formatCurrency(input.monthlySpend)}/month. Based on the listed price, this setup looks closer to ${formatCurrency(benchmarkSpend)}.`,
      impact: "medium",
    });
  }

  if (input.seats > input.teamSize) {
    findings.push({
      title: "You may be paying for unused seats",
      detail: `You listed ${input.seats} paid seat${input.seats === 1 ? "" : "s"} for a team of ${input.teamSize}.`,
      impact: "high",
    });
  }

  if (
    input.useCase === "writing" &&
    input.toolId !== "claude" &&
    input.monthlySpend >= 20
  ) {
    findings.push({
      title: "This tool may be more than you need for writing work",
      detail:
        "If most of the work is writing or docs, a simpler plan could probably do the job for less.",
      impact: "low",
    });
  }

  if (
    input.useCase === "coding" &&
    input.toolId === "chatgpt" &&
    input.seats >= 3
  ) {
    findings.push({
      title: "General chat seats can get expensive for dev teams",
      detail:
        "If most of the work is coding, a coding-first tool may be easier to justify.",
      impact: "low",
    });
  }

  return findings;
}
