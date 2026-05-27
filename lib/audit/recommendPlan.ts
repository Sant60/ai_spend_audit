import { calculateSavings } from "@/lib/audit/calculateSavings";
import { findPlanById, findToolById } from "@/lib/pricing/pricingData";
import type { AuditFormInput, AuditRecommendation } from "@/types/audit";
import type { ToolOption, ToolPlan } from "@/types/tool";

function getRecommendedSeatCount(input: AuditFormInput) {
  return Math.max(1, Math.min(input.seats, input.teamSize));
}

function getDefaultPlan(tool: ToolOption, input: AuditFormInput) {
  const sortedPlans = [...tool.plans].sort((a, b) => a.monthlyPrice - b.monthlyPrice);

  // Skip free plans (monthlyPrice === 0) unless explicitly requested
  const paidPlans = sortedPlans.filter((p) => p.monthlyPrice > 0);

  if (input.teamSize >= 4) {
    return (
      paidPlans.find((plan) => plan.kind === "team") ??
      paidPlans.find((plan) => plan.kind === "enterprise") ??
      paidPlans[0] ??
      sortedPlans[0]
    );
  }

  return paidPlans[0] ?? sortedPlans[0];
}

function buildRecommendation(
  tool: ToolOption,
  plan: ToolPlan,
  input: AuditFormInput,
  reason: string,
): AuditRecommendation {
  const seats = getRecommendedSeatCount(input);
  const currentTool = findToolById(input.toolId);

  let switchType: AuditRecommendation["switchType"] = "keep";

  if (tool.id === input.toolId && plan.id !== input.currentPlanId) {
    switchType = "downgrade";
  }

  if (tool.id !== input.toolId) {
    switchType = "switch-tool";
  }

  return {
    toolId: tool.id,
    toolName: tool.name,
    planId: plan.id,
    planName: plan.name,
    monthlyCost: plan.monthlyPrice * seats,
    seats,
    switchType,
    reason:
      currentTool?.id === tool.id
        ? reason
        : `${reason} It cuts cost without changing too much.`,
  };
}

export function recommendPlan(input: AuditFormInput): AuditRecommendation {
  const currentTool = findToolById(input.toolId);
  const currentPlan = findPlanById(input.toolId, input.currentPlanId);

  if (!currentTool || !currentPlan) {
    throw new Error("Unknown tool or plan selected.");
  }

  const currentRecommendation = buildRecommendation(
    currentTool,
    currentPlan,
    input,
    "The current setup looks fine for this team.",
  );

  const candidates: AuditRecommendation[] = [];

  // Always consider downgrading within the same tool
  candidates.push(
    buildRecommendation(
      currentTool,
      getDefaultPlan(currentTool, input),
      input,
      input.teamSize <= 2
        ? `${currentTool.name} ${getDefaultPlan(currentTool, input).name} should be enough for a team this small.`
        : "A lower plan on the same tool should still cover the work and cut the bill.",
    ),
  );

  // Writing / research → suggest Claude Pro
  if (input.useCase === "writing" || input.useCase === "research") {
    const claude = findToolById("claude");
    const claudePlan = claude?.plans.find((p) => p.id === "pro");

    if (claude && claudePlan) {
      candidates.push(
        buildRecommendation(
          claude,
          claudePlan,
          input,
          "Claude Pro is purpose-built for writing and research, and often costs less per seat than alternatives.",
        ),
      );
    }
  }

  // Coding → suggest Cursor Pro or GitHub Copilot Individual
  if (input.useCase === "coding") {
    const cursor = findToolById("cursor");
    const cursorPro = cursor?.plans.find((p) => p.id === "pro");
    if (cursor && cursorPro) {
      candidates.push(
        buildRecommendation(
          cursor,
          cursorPro,
          input,
          "Cursor Pro is designed specifically for coding and typically costs less than a general-purpose AI subscription.",
        ),
      );
    }

    const copilot = findToolById("copilot");
    const copilotBiz = copilot?.plans.find((p) => p.id === "business");
    if (copilot && copilotBiz && input.seats >= 3) {
      candidates.push(
        buildRecommendation(
          copilot,
          copilotBiz,
          input,
          "GitHub Copilot Business is the lowest-cost coding AI for teams at this size.",
        ),
      );
    }
  }

  // Data or mixed → suggest API direct billing
  if (input.useCase === "data" || input.useCase === "mixed") {
    const anthropicApi = findToolById("anthropic_api");
    const apiPlan = anthropicApi?.plans[0];
    if (anthropicApi && apiPlan && input.monthlySpend > 60) {
      candidates.push(
        buildRecommendation(
          anthropicApi,
          apiPlan,
          input,
          "For data or variable workloads, pay-as-you-go API billing often costs significantly less than flat per-seat plans.",
        ),
      );
    }
  }

  // General small team → suggest ChatGPT Plus
  if ((input.useCase === "general" || input.useCase === "mixed") && input.teamSize <= 2) {
    const chatgpt = findToolById("chatgpt");
    const plusPlan = chatgpt?.plans.find((p) => p.id === "plus");

    if (chatgpt && plusPlan) {
      candidates.push(
        buildRecommendation(
          chatgpt,
          plusPlan,
          input,
          "For general day-to-day use, an individual Plus plan is usually sufficient at this team size.",
        ),
      );
    }
  }

  // Find the candidate that saves the most money.
  // Tiebreaker: prefer a cross-tool switch that matches the use case over
  // a same-tool downgrade (more meaningful recommendation for the user).
  const bestCandidate = candidates.reduce((best, candidate) => {
    const bestSavings = calculateSavings(input.monthlySpend, best.monthlyCost);
    const candidateSavings = calculateSavings(input.monthlySpend, candidate.monthlyCost);

    if (candidateSavings > bestSavings) {
      return candidate;
    }

    // Equal savings: prefer a switch-tool recommendation that aligns with the use case
    if (candidateSavings === bestSavings && candidate.switchType === "switch-tool") {
      const candidateTool = findToolById(candidate.toolId);
      if (candidateTool?.bestFor.includes(input.useCase)) {
        return candidate;
      }
    }

    return best;
  }, currentRecommendation);

  return bestCandidate;
}
