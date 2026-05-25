import { calculateSavings } from "@/lib/audit/calculateSavings";
import { findPlanById, findToolById } from "@/lib/pricing/pricingData";
import type { AuditFormInput, AuditRecommendation } from "@/types/audit";
import type { ToolOption, ToolPlan } from "@/types/tool";

function getRecommendedSeatCount(input: AuditFormInput) {
  return Math.max(1, Math.min(input.seats, input.teamSize));
}

function getDefaultPlan(tool: ToolOption, input: AuditFormInput) {
  const sortedPlans = [...tool.plans].sort((a, b) => a.monthlyPrice - b.monthlyPrice);

  if (input.teamSize >= 4) {
    return (
      sortedPlans.find((plan) => plan.kind === "team") ??
      sortedPlans.find((plan) => plan.kind === "enterprise") ??
      sortedPlans[0]
    );
  }

  return sortedPlans[0];
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

  if (input.useCase === "writing" || input.useCase === "research") {
    const claude = findToolById("claude");
    const claudePlan = claude?.plans[0];

    if (claude && claudePlan) {
      candidates.push(
        buildRecommendation(
          claude,
          claudePlan,
          input,
          "Claude Pro looks like a better fit if most of the work is writing, docs, or research.",
        ),
      );
    }
  }

  if (input.useCase === "coding") {
    const cursor = findToolById("cursor");
    const cursorPlan =
      cursor?.plans.find((plan) => plan.kind === "individual") ?? cursor?.plans[0];

    if (cursor && cursorPlan) {
      candidates.push(
        buildRecommendation(
          cursor,
          cursorPlan,
          input,
          "If most of the work is coding, a coding-first tool is easier to justify.",
        ),
      );
    }
  }

  if (input.useCase === "general" && input.teamSize <= 2) {
    const chatgpt = findToolById("chatgpt");
    const chatgptPlan = chatgpt?.plans.find((plan) => plan.id === "plus");

    if (chatgpt && chatgptPlan) {
      candidates.push(
        buildRecommendation(
          chatgpt,
          chatgptPlan,
          input,
          "For general day-to-day use, a basic individual plan is usually enough at this size.",
        ),
      );
    }
  }

  const bestCandidate = candidates.reduce((best, candidate) => {
    const bestSavings = calculateSavings(input.monthlySpend, best.monthlyCost);
    const candidateSavings = calculateSavings(input.monthlySpend, candidate.monthlyCost);

    if (candidateSavings > bestSavings) {
      return candidate;
    }

    return best;
  }, currentRecommendation);

  return bestCandidate;
}
