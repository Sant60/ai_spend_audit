import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { AuditResult } from "@/types/audit";

export function buildFallbackSummary(audit: AuditResult) {
  if (!audit.overspend) {
    return `Your current setup actually looks fairly balanced for the size of the team. I don’t see any major overspending right now, and the plans seem close to what your usage would realistically need. The main thing worth keeping an eye on is seat growth over time, since costs usually start increasing there first. If your workflow and team size stay similar, this setup should work well without many changes.`;
  }

  return `The biggest issue here is plan size. Based on the spend and seat count you entered, this setup looks heavier than it needs to be. The cleanest fix is switching to ${audit.recommendation.toolName} ${audit.recommendation.planName}, which brings the monthly cost closer to ${formatCurrency(audit.recommendation.monthlyCost)} and saves about ${formatCurrency(audit.monthlySavings)} each month. The stack itself is fine. It just looks like you're paying for more plan than the team really uses.`;
}
