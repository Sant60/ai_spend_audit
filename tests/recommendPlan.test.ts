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

    expect(["cursor", "copilot"]).toContain(result.toolId);
    expect(result.switchType).toBe("switch-tool");
  });

  it("recommends Claude Pro for a writing workflow", () => {
    const input: AuditFormInput = {
      toolId: "chatgpt",
      currentPlanId: "team",
      monthlySpend: 90,
      seats: 3,
      teamSize: 3,
      useCase: "writing",
    };

    const result = recommendPlan(input);

    expect(result.toolId).toBe("claude");
    expect(result.planId).toBe("pro");
    expect(result.switchType).toBe("switch-tool");
  });

  it("keeps the same tool when already optimal", () => {
    const input: AuditFormInput = {
      toolId: "cursor",
      currentPlanId: "pro",
      monthlySpend: 20,
      seats: 1,
      teamSize: 1,
      useCase: "coding",
    };

    const result = recommendPlan(input);

    expect(result.toolId).toBe("cursor");
    expect(result.switchType).toBe("keep");
    expect(result.monthlyCost).toBeLessThanOrEqual(input.monthlySpend);
  });

  it("recommendation monthlyCost is never negative", () => {
    const input: AuditFormInput = {
      toolId: "claude",
      currentPlanId: "free",
      monthlySpend: 0,
      seats: 1,
      teamSize: 1,
      useCase: "general",
    };

    const result = recommendPlan(input);

    expect(result.monthlyCost).toBeGreaterThanOrEqual(0);
  });

  it("recommendation includes a non-empty reason string", () => {
    const input: AuditFormInput = {
      toolId: "copilot",
      currentPlanId: "enterprise",
      monthlySpend: 200,
      seats: 5,
      teamSize: 5,
      useCase: "coding",
    };

    const result = recommendPlan(input);

    expect(typeof result.reason).toBe("string");
    expect(result.reason.length).toBeGreaterThan(10);
  });
});
