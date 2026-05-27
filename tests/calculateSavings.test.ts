import { describe, expect, it } from "vitest";
import { calculateSavings } from "../lib/audit/calculateSavings";

describe("calculateSavings", () => {
  it("returns the positive difference when the recommendation is cheaper", () => {
    expect(calculateSavings(120, 60)).toBe(60);
  });

  it("never returns a negative number when recommendation costs more", () => {
    expect(calculateSavings(40, 75)).toBe(0);
  });

  it("returns zero when current and recommended spend are equal", () => {
    expect(calculateSavings(50, 50)).toBe(0);
  });

  it("handles large values correctly", () => {
    expect(calculateSavings(10000, 2500)).toBe(7500);
  });

  it("handles fractional values", () => {
    expect(calculateSavings(99.99, 49.99)).toBeCloseTo(50);
  });
});
