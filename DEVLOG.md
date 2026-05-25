# 7-Day Devlog

## Day 1

- Read the assignment brief and narrowed the MVP scope.
- Decided to focus on one clear audit flow instead of a broad dashboard.
- Set up the Next.js App Router project structure.

## Day 2

- Sketched the core form fields and result page sections.
- Listed the AI tools and pricing assumptions I wanted to support.
- Decided the audit logic should be deterministic and not AI-driven.

## Day 3

- Built the first version of the landing page and audit form.
- Added `localStorage` draft persistence so the form feels less fragile.
- Realized I needed better shared types before going further.

## Day 4

- Implemented `calculateSavings`, `detectOverspend`, `recommendPlan`, and `generateAudit`.
- Reworked the recommendation logic so it reads like business reasoning instead of clever code.
- Added initial test coverage for the core utility functions.

## Day 5

- Added API routes for creating audits and capturing leads.
- Connected Supabase for simple storage of audits and leads.
- Added a result route with a shareable URL structure.

## Day 6

- Integrated Anthropic for a short summary paragraph.
- Added a fallback summary so the app still works without the API.
- Cleaned up the result UI to be more presentation-friendly.

## Day 7

- Replaced boilerplate docs with project-specific documentation.
- Reviewed the code for readability and beginner explainability.
- Ran tests, linting, and a production build pass.

## Biggest blockers

- Balancing product polish with the “student-built in 7 days” constraint.
- Making the shareable result flow still work during local development without relying fully on Supabase.
- Keeping the recommendation logic useful without turning it into a fake enterprise rules engine.
