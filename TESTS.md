# Tests

## Current coverage

The project only tests the core deterministic audit logic. That was intentional.

Files covered:

- `calculateSavings()`
- `recommendPlan()`
- `detectOverspend()`

These tests live in:

- [tests/calculateSavings.test.ts](./tests/calculateSavings.test.ts)
- [tests/recommendPlan.test.ts](./tests/recommendPlan.test.ts)
- [tests/detectOverspend.test.ts](./tests/detectOverspend.test.ts)

## What each test checks

`calculateSavings`

- returns the difference when the recommended option is cheaper
- never returns a negative number

`recommendPlan`

- downgrades an oversized ChatGPT Team setup to a cheaper individual plan
- suggests Cursor for a coding-heavy team when it gives better cost efficiency

`detectOverspend`

- flags shared plans that look too large for a very small team
- flags extra seats when paid seats exceed team size

## Why coverage is limited

This project is an internship MVP, not a production finance product. I focused tests on the business logic that is easiest to break and easiest to defend in an interview.

I did not add broad UI test coverage because:

- most UI is straightforward rendering and form wiring
- the highest-risk logic lives in `lib/audit/`
- the assignment benefits more from a few meaningful tests than from inflated coverage

## How to run

```bash
npm run test -- --run
```

## What I would test next

- `generateAudit()` integration behavior
- route handler validation for `/api/audits`
- lead form submission happy/error paths
- localStorage draft persistence
