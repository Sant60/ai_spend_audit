# Architecture Notes

## Why this structure

I kept the project close to the assignment guidance:

- `app/` for pages and API routes
- `components/` for form, result, and shared UI pieces
- `lib/` for audit logic, AI helper, database helper, and utilities
- `types/` for shared TypeScript interfaces
- `constants/` for tool and plan definitions
- `tests/` for a few important business-rule tests

## Data flow

1. The user visits `/audit` and fills the form.
2. The form state is saved in `localStorage` while typing.
3. On submit, the client sends the form payload to `POST /api/audits`.
4. The server runs deterministic audit logic in `lib/audit/`.
5. The server generates a short AI summary using Anthropic.
6. The full audit result is saved to Supabase if keys are configured.
7. The client stores the returned result in `localStorage` and navigates to `/result/[id]`.
8. The result page loads the audit from Supabase when possible, and falls back to `localStorage` if needed.
9. A lead form on the result page sends contact info to `POST /api/leads`.

## Audit engine design

The most important requirement was that the core business logic stay readable and defensible.

- `calculateSavings()` only computes cost difference and never goes negative.
- `detectOverspend()` looks for plain-language waste patterns, such as oversized collaboration plans and unused seats.
- `recommendPlan()` compares a small number of sensible plan candidates and picks the one with the best savings.
- `generateAudit()` combines the output into one result object used by the UI and persistence layer.

