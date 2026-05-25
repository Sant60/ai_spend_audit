import Anthropic from "@anthropic-ai/sdk";
import { buildFallbackSummary } from "@/lib/ai/fallbackSummary";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { AuditResult } from "@/types/audit";

export async function generateSummary(audit: AuditResult) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return buildFallbackSummary(audit);
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const findings = audit.findings.map((finding) => `- ${finding.title}: ${finding.detail}`).join("\n");

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-latest",
      max_tokens: 180,
      system:
        "You write short, natural audit summaries for startup teams. Sound like an operator reviewing software spend. Be specific, calm, and practical. Use the numbers provided. Do not use hype, buzzwords, or corporate language. Keep it to one paragraph, around 80 to 120 words.",
      messages: [
        {
          role: "user",
          content: `Write a plain-English summary of this report.\n\nCurrent tool: ${audit.currentToolName} ${audit.currentPlanName}\nCurrent monthly spend: ${formatCurrency(audit.input.monthlySpend)}\nRecommended option: ${audit.recommendation.toolName} ${audit.recommendation.planName}\nRecommended monthly cost: ${formatCurrency(audit.recommendation.monthlyCost)}\nMonthly savings: ${formatCurrency(audit.monthlySavings)}\nAnnual savings: ${formatCurrency(audit.annualSavings)}\nUse case: ${audit.input.useCase}\nFindings:\n${findings || "- No major overspend found"}\n\nMention the biggest cost issue first, then the simplest change to make. Keep the writing direct and human.`,
        },
      ],
    });

    const firstBlock = response.content[0];

    if (firstBlock && firstBlock.type === "text" && firstBlock.text.trim()) {
      return firstBlock.text.trim();
    }

    return buildFallbackSummary(audit);
  } catch {
    return buildFallbackSummary(audit);
  }
}
