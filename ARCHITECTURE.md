# Project Structure and Workflow

## Organizational Rationale

The project's organization closely follows the assignment requirements:

- **`app/`**: Contains the application pages and API endpoints.
- **`components/`**: Stores reusable UI components like forms, result cards, and shared layouts.
- **`lib/`**: Includes the core logic such as audit functions, AI integration, database setup, and utility helpers.
- **`types/`**: Defines shared TypeScript interfaces used across the app.
- **`constants/`**: Stores tool names and pricing related constants.
- **`tests/`**: Contains tests for important business logic and calculations.

## Operational Flow

1. A user opens the `/audit` page and fills out the form.
2. While typing, the form state is stored in `localStorage`.
3. After submission, the client sends the form data to the `POST /api/audits` endpoint.
4. The server runs the deterministic audit logic located inside `lib/audit/`.
5. Anthropic is then used to generate a short summary of the audit findings.
6. If Supabase credentials are available, the audit results are stored in the database.
7. The client stores the latest result in `localStorage` and redirects the user to `/result/[id]`.
8. The result page first tries to load audit data from Supabase. If unavailable, it falls back to `localStorage`.
9. A lead capture form on the result page sends user information to `POST /api/leads`.

## Audit Logic Design

One of the main goals during developement was to keep the business logic predictable and easy to understand.

- **`calculateSavings()`**: Calculates the difference between the current spend and the recommended spend while making sure the value never becomes negative.
- **`detectOverspend()`**: Detects common waste patterns such as oversized plans or unused seats.
- **`recommendPlan()`**: Compares a limited set of plans and reccomends the most cost-effective option.
- **`generateAudit()`**: Combines all outputs into a single audit result object used by both the UI and persistance layer.

## Notes

- Audit calculations are intentionally rule-based instead of AI-generated.
- AI is only used for generating personalized summaries.
- Most business logic is seperated inside `lib/audit/` to make debugging and maintainance easier.
- `localStorage` is used to improve the user experiance during refreshes or local development.
