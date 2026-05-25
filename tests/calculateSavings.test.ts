import { describe, expect, it } from "vitest";
import { calculateSavings } from "../lib/audit/calculateSavings";

describe("calculateSavings", () => {
  it("returns the difference when the recommendation is cheaper", () => {
    expect(calculateSavings(120, 60)).toBe(60);
  });

  it("never returns a negative number", () => {
    expect(calculateSavings(40, 75)).toBe(0);
  });
});
