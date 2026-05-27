import { buildFallbackSummary } from "@/lib/ai/fallbackSummary";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { AuditResult } from "@/types/audit";

function buildPrompt(audit: AuditResult): string {
  const findings = audit.findings
    .map((f) => `- ${f.title}: ${f.detail}`)
    .join("\n");

  return `Write a plain-English summary of this AI spend audit report.

Current tool: ${audit.currentToolName} ${audit.currentPlanName}
Current monthly spend: ${formatCurrency(audit.input.monthlySpend)}
Recommended option: ${audit.recommendation.toolName} ${audit.recommendation.planName}
Recommended monthly cost: ${formatCurrency(audit.recommendation.monthlyCost)}
Monthly savings: ${formatCurrency(audit.monthlySavings)}
Annual savings: ${formatCurrency(audit.annualSavings)}
Use case: ${audit.input.useCase}
Findings:
${findings || "- No major overspend found"}

Mention the biggest cost issue first, then the simplest change to make. Keep the writing direct and human. One paragraph, 80-120 words.`;
}

const SYSTEM_PROMPT =
  "You write short, natural audit summaries for startup teams. Sound like an operator reviewing software spend. Be specific, calm, and practical. Use the numbers provided. Do not use hype, buzzwords, or corporate language. Keep it to one paragraph, around 80 to 120 words.";

async function tryGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.4 },
        }),
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return text || null;
  } catch {
    return null;
  }
}

async function tryAnthropic(prompt: string): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 200,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.content?.[0]?.text?.trim();
    return text || null;
  } catch {
    return null;
  }
}

async function tryOpenAI(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 200,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch {
    return null;
  }
}

export async function generateSummary(audit: AuditResult): Promise<string> {
  const prompt = buildPrompt(audit);

  // Try providers in order: Gemini (free) → Anthropic → OpenAI → fallback template
  const summary =
    (await tryGemini(prompt)) ??
    (await tryAnthropic(prompt)) ??
    (await tryOpenAI(prompt)) ??
    buildFallbackSummary(audit);

  return summary;
}
