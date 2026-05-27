# Test Suite

Run all tests:
```bash
npm test -- --run
```

Run in watch mode during development:
```bash
npm test
```

---

## Test Files

### `tests/calculateSavings.test.ts` — 5 tests

Covers the `calculateSavings(currentSpend, recommendedSpend)` function.

| Test | What it checks |
|------|---------------|
| returns positive difference when recommendation is cheaper | Basic happy path: 120 - 60 = 60 |
| never returns a negative number | Floor at zero: 40 - 75 → 0 |
| returns zero when spend is equal | Edge case: 50 - 50 = 0 |
| handles large values correctly | 10000 - 2500 = 7500 |
| handles fractional values | 99.99 - 49.99 ≈ 50 |

### `tests/detectOverspend.test.ts` — 6 tests

Covers the `detectOverspend(input)` audit finding engine.

| Test | What it checks |
|------|---------------|
| flags oversized collaboration plans | Team plan with ≤2 seats gets "Collaboration" finding |
| flags unused seats when paid seats exceed team size | 4 seats, 2-person team → "Unused seats" finding |
| returns no high-impact findings for optimal small setup | Claude Pro, 1 user, writing → no high-impact issues |
| flags enterprise plan for small team | Cursor Enterprise for 4 people → flagged |
| flags coding use-case on general chat tool | ChatGPT Team used for coding → medium/high impact finding |
| every finding has valid shape | title, detail are non-empty; impact is high/medium/low |

### `tests/recommendPlan.test.ts` — 6 tests

Covers the `recommendPlan(input)` recommendation engine.

| Test | What it checks |
|------|---------------|
| downgrades small ChatGPT team to individual Plus | 2-person team on Team plan → downgrade to Plus |
| suggests coding-focused tool for coding workflow | ChatGPT Team for coders → Cursor or Copilot switch-tool |
| recommends Claude Pro for writing workflow | ChatGPT Team for writing → Claude Pro switch-tool |
| keeps same tool when already optimal | Cursor Pro, 1 user, coding → keep |
| recommendation monthlyCost is never negative | Free plan input → monthlyCost ≥ 0 |
| recommendation includes a non-empty reason | All recommendations carry a reason string |

### `tests/generateAudit.test.ts` — 5 tests

Covers the `generateAudit(input)` full audit orchestration function.

| Test | What it checks |
|------|---------------|
| returns valid AuditResult with all required fields | All required fields present and typed correctly |
| annualSavings = 12 × monthlySavings | Mathematical consistency check |
| throws for unknown tool | Invalid toolId → throws Error |
| sets overspend=true when savings are detected | Enterprise plan for small team → overspend flag |
| generates unique id per audit | Two calls with same input produce different IDs |

---

## How tests are run in CI

See `.github/workflows/ci.yml` — runs `npm test -- --run` on every push to `main` and every pull request.

The audit engine (calculateSavings, detectOverspend, recommendPlan, generateAudit) has **22 automated tests** total, all covering the core business logic.
