import { describe, expect, it } from "vitest";
import { generateAudit } from "../lib/audit/generateAudit";
import type { AuditFormInput } from "../types/audit";

describe("generateAudit", () => {
  it("returns a valid AuditResult with all required fields", () => {
    const input: AuditFormInput = {
      toolId: "chatgpt",
      currentPlanId: "team",
      monthlySpend: 90,
      seats: 3,
      teamSize: 3,
      useCase: "general",
    };

    const result = generateAudit(input);

    expect(result.id).toBeTruthy();
    expect(result.createdAt).toBeTruthy();
    expect(result.shareUrl).toContain(result.id);
    expect(result.currentToolName).toBe("ChatGPT");
    expect(result.currentPlanName).toBe("Team");
    expect(typeof result.monthlySavings).toBe("number");
    expect(typeof result.annualSavings).toBe("number");
    expect(Array.isArray(result.findings)).toBe(true);
    expect(result.recommendation).toBeDefined();
  });

  it("sets annualSavings to 12 times monthlySavings", () => {
    const input: AuditFormInput = {
      toolId: "chatgpt",
      currentPlanId: "team",
      monthlySpend: 90,
      seats: 3,
      teamSize: 3,
      useCase: "coding",
    };

    const result = generateAudit(input);

    expect(result.annualSavings).toBe(result.monthlySavings * 12);
  });

  it("throws an error for an unknown tool", () => {
    const input: AuditFormInput = {
      toolId: "nonexistent_tool",
      currentPlanId: "pro",
      monthlySpend: 50,
      seats: 2,
      teamSize: 2,
      useCase: "general",
    };

    expect(() => generateAudit(input)).toThrow();
  });

  it("sets overspend to true when savings are detected", () => {
    const input: AuditFormInput = {
      toolId: "chatgpt",
      currentPlanId: "enterprise",
      monthlySpend: 300,
      seats: 3,
      teamSize: 2,
      useCase: "writing",
    };

    const result = generateAudit(input);

    expect(result.overspend).toBe(true);
  });

  it("generates a unique id for each audit", () => {
    const input: AuditFormInput = {
      toolId: "cursor",
      currentPlanId: "pro",
      monthlySpend: 60,
      seats: 3,
      teamSize: 3,
      useCase: "coding",
    };

    const a = generateAudit(input);
    const b = generateAudit(input);

    expect(a.id).not.toBe(b.id);
  });
});
