import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { AuditResult } from "@/types/audit";

export function buildFallbackSummary(audit: AuditResult) {
  if (!audit.overspend) {
    return `This setup looks pretty reasonable overall. Nothing here suggests a major waste issue, and the current plan is close to what this team likely needs. I'd still watch seat count as the team changes, since that's usually where spend drifts first. If usage stays about the same, this stack is probably fine as-is.`;
  }

  return `The biggest issue here is plan size. Based on the spend and seat count you entered, this setup looks heavier than it needs to be. The cleanest fix is switching to ${audit.recommendation.toolName} ${audit.recommendation.planName}, which brings the monthly cost closer to ${formatCurrency(audit.recommendation.monthlyCost)} and saves about ${formatCurrency(audit.monthlySavings)} each month. The stack itself is fine. It just looks like you're paying for more plan than the team really uses.`;
}
