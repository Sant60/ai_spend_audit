# Reflection

## What I learned

This project was a good exercise in keeping a product technically honest. The hardest part was not building the UI. It was deciding how much logic should stay deterministic versus where AI could still add value.

I learned that the cleanest solution for this assignment was:

- keep all pricing and recommendations rule-based
- use AI only for summary writing
- make the result page feel useful with a small number of clearly justified metrics

## Bugs and mistakes I corrected

- I started with placeholder components and almost no shared types, which would have made the project feel incomplete and inconsistent.
- The result route needed to work with Next.js 16 async `params`, so I updated it to await route params correctly.
- Some of the original files were empty, which meant the UI looked wired up but the real product logic did not exist yet.
- I had to think carefully about the fallback path when Supabase is not configured locally. I kept a `localStorage` fallback so development still works.

## Tradeoffs I made

- I did not build complex authentication because the assignment does not need it.
- I did not build a full dashboard for multiple audits because one strong single-audit flow was more realistic for the time available.
- I kept the recommendation engine intentionally small, even though a real product would need more pricing coverage and exceptions.

## AI usage transparency

AI was used in two ways:

- to help generate a short personalized summary paragraph through the Anthropic API
- to help accelerate implementation during development

AI was not used for:

- pricing calculations
- savings computation
- overspend detection
- plan recommendation logic

Those parts are all deterministic TypeScript so they are easy to reason about and easy to defend in an interview.
