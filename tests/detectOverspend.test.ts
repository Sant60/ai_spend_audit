import { describe, expect, it } from "vitest";
import { detectOverspend } from "../lib/audit/detectOverspend";
import type { AuditFormInput } from "../types/audit";

describe("detectOverspend", () => {
  it("flags oversized collaboration plans", () => {
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
});
