# Prompts

## Anthropic summary prompt

The app only uses Anthropic for the summary paragraph on the result page.

Code location:

- [lib/ai/generateSummary.ts](./lib/ai/generateSummary.ts)

## System prompt

The current system prompt asks the model to:

- sound like an operator reviewing software spend
- stay specific and practical
- avoid buzzwords and hype
- keep the summary to one paragraph
- use only the numbers provided

## User prompt structure

The app sends:

- current tool and plan
- current monthly spend
- recommended tool and plan
- recommended monthly cost
- monthly savings
- annual savings
- use case
- audit findings

## Why AI use is narrow

I intentionally limited AI to the summary because:

- pricing logic should be deterministic
- recommendations should be explainable in plain business rules
- AI is better used here as a writing layer, not a decision layer

## Fallback behavior

If Anthropic is unavailable or the API key is missing, the app falls back to a local summary function:

- [lib/ai/fallbackSummary.ts](./lib/ai/fallbackSummary.ts)

That keeps the product usable in local development and avoids hard dependency on the API.
