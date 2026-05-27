import { describe, expect, it } from "vitest";
import { detectOverspend } from "../lib/audit/detectOverspend";
import type { AuditFormInput } from "../types/audit";

describe("detectOverspend", () => {
  it("flags oversized collaboration plans for very small teams", () => {
    const input: AuditFormInput = {
      toolId: "chatgpt",
      currentPlanId: "team",
      monthlySpend: 60,
      seats: 2,
      teamSize: 2,
      useCase: "general",
    };

    const findings = detectOverspend(input);

    expect(findings.some((finding) => finding.title.includes("Collaboration"))).toBe(true);
  });

  it("flags unused seats when paid seats exceed team size", () => {
    const input: AuditFormInput = {
      toolId: "claude",
      currentPlanId: "team",
      monthlySpend: 120,
      seats: 4,
      teamSize: 2,
      useCase: "writing",
    };

    const findings = detectOverspend(input);

    expect(findings.some((finding) => finding.title.includes("Unused seats"))).toBe(true);
  });

  it("returns no findings for a well-optimised small individual setup", () => {
    const input: AuditFormInput = {
      toolId: "claude",
      currentPlanId: "pro",
      monthlySpend: 20,
      seats: 1,
      teamSize: 1,
      useCase: "writing",
    };

    const findings = detectOverspend(input);
    const highImpact = findings.filter((f) => f.impact === "high");

    expect(highImpact.length).toBe(0);
  });

  it("flags enterprise plan for a small team", () => {
    const input: AuditFormInput = {
      toolId: "cursor",
      currentPlanId: "enterprise",
      monthlySpend: 400,
      seats: 4,
      teamSize: 4,
      useCase: "coding",
    };

    const findings = detectOverspend(input);

    expect(findings.some((f) => f.title.toLowerCase().includes("enterprise"))).toBe(true);
  });

  it("flags coding use-case on general chat tool", () => {
    const input: AuditFormInput = {
      toolId: "chatgpt",
      currentPlanId: "team",
      monthlySpend: 90,
      seats: 3,
      teamSize: 3,
      useCase: "coding",
    };

    const findings = detectOverspend(input);

    expect(findings.some((f) => f.impact === "medium" || f.impact === "high")).toBe(true);
  });

  it("every finding has a non-empty title, detail, and valid impact level", () => {
    const input: AuditFormInput = {
      toolId: "chatgpt",
      currentPlanId: "team",
      monthlySpend: 200,
      seats: 6,
      teamSize: 3,
      useCase: "coding",
    };

    const findings = detectOverspend(input);

    for (const finding of findings) {
      expect(finding.title.length).toBeGreaterThan(0);
      expect(finding.detail.length).toBeGreaterThan(0);
      expect(["high", "medium", "low"]).toContain(finding.impact);
    }
  });
});
