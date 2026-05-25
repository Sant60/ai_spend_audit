import { describe, expect, it } from "vitest";
import { recommendPlan } from "../lib/audit/recommendPlan";
import type { AuditFormInput } from "../types/audit";

describe("recommendPlan", () => {
  it("downgrades a very small ChatGPT team to a cheaper individual plan", () => {
    const input: AuditFormInput = {
      toolId: "chatgpt",
      currentPlanId: "team",
      monthlySpend: 60,
      seats: 2,
      teamSize: 2,
      useCase: "general",
    };

    const result = recommendPlan(input);

    expect(result.toolId).toBe("chatgpt");
    expect(result.planId).toBe("plus");
    expect(result.switchType).toBe("downgrade");
    expect(result.monthlyCost).toBe(40);
  });

  it("suggests a coding-focused tool for a coding workflow when it saves money", () => {
    const input: AuditFormInput = {
      toolId: "chatgpt",
      currentPlanId: "team",
      monthlySpend: 120,
      seats: 4,
      teamSize: 4,
      useCase: "coding",
    };

    const result = recommendPlan(input);

    expect(result.toolId).toBe("cursor");
    expect(result.planId).toBe("pro");
    expect(result.switchType).toBe("switch-tool");
  });
});
