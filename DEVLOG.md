# Development Timeline

## Day 1

I started by reviewing the assignment requirements and identifying the main features needed for the MVP. Instead of building a large dashboard system, I decided to focus more on a simple and practical audit flow.

I also initialized the project using Next.js App Router and started setting up the base folder structure.

---

## Day 2

I worked on planning the form flow and the results page structure. I also created an initial list of AI tools and pricing plans that would be used inside the audit logic.

One important decision during this phase was keeping the audit logic deterministic instead of AI-generated so the recommendations remain predictable and easier to verify.

---

## Day 3

I built the first version of the landing page and audit form. I also implemented `localStorage` support so users do not lose progress after refreshing the page.

During this phase, I realized the project needed better shared type definitions before adding more features.

---

## Day 4

I started building the core audit utility functions:

- `calculateSavings()`
- `detectOverspend()`
- `recommendPlan()`
- `generateAudit()`

I adjusted the recommendation logic multiple times so the suggestions sounded more practical and less like overly complex enterprise logic.

I also added some initial tests for the main audit functions.

---

## Day 5

I created the API routes for generating audits and storing leads. I integrated Supabase for storing audit results and lead data.

I also created the initial structure for the results page and added support for shareable URLs using dynamic routes.

---

## Day 6

I integrated the Anthropic API to generate short personalized summaries for the audit results.

To avoid breaking the app when API access is unavailable, I also implemented a fallback summary system.

I spent some additional time improving the UI and spacing of the results page.

---

## Day 7

I replaced placeholder documentation with project-specific documentation and reviewed the codebase to make the structure easier to understand.

Finally, I ran tests, lint checks, and a final production build before deployment.

---

# Challenges Faced

- Finding the right balance between a polished product and the limitations of a 7-day timeline.
- Making the shareable results flow work properly during local development without depending completely on Supabase.
- Keeping the recommendation logic useful without making it unnecessarily complicated.
- Managing the project structure while learning new parts of the stack during development.
