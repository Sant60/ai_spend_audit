# AI Spend Audit

This web application, developed as part of the Credex internship assignment, aims to tackle the common issue of teams overspending on AI tools. Many organizations subscribe to multiple AI services monthly without a clear understanding of whether they're on the most cost-effective plans or if their current subscriptions align with their actual needs.

The core functionality of the app allows users to input details about their AI tools, including their monthly expenses, the number of user seats, and the specific use cases. Based on this information, the application then generates a comprehensive audit report. This report not only highlights potential areas of overspending but also provides actionable recommendations for optimization and estimates the potential savings.

## Key Features

- The ability to catalog AI tools, their associated plans, seat counts, and monthly costs.
- Persistent storage of user input via `localStorage` to prevent data loss upon page refresh.
- A rule-based system for generating audit recommendations, ensuring predictability and ease of verification.
- Calculations for estimated monthly and annual cost savings.
- Integration with the Anthropic API to generate concise, personalized AI summaries.
- The creation of shareable pages for audit results.
- A lead capture mechanism that stores data in Supabase.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase for backend services
- Anthropic API for AI capabilities
- Vitest for testing

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Run tests

```bash
npm run test -- --run
```

### 5. Run lint checks

```bash
npm run lint
```

## Database Schema

### audits

Stores details about each audit, such as:

- tool name
- current plan
- monthly spend
- seats
- team size
- use case
- audit output payload

### leads

Captures information from users interested in the service, including:

- audit ID
- name
- email
- company

## Development Decisions

- Audit calculations were intentionally kept rule-based to ensure recommendations are consistent and easy to validate.
- AI was specifically utilized for generating personalized summary content, rather than for core audit logic.
- `localStorage` was implemented to preserve user input, enhancing the user experience by preventing data loss.
- The focus was placed on usability and clarity, prioritizing a clean interface over excessive animations or visual effects.
- Much of the core logic was modularized within the `lib/audit/` directory to simplify debugging and maintenance.

## Screenshots

## Landing page

<img width="1000" height="600" alt="image" src="https://github.com/user-attachments/assets/9dea971c-c690-4323-867c-3b1f410d8134" />

## Audit form

<img width="1971" height="1139" alt="image" src="https://github.com/user-attachments/assets/016a73ba-4e76-4921-b599-04ebce3b852d" />

## Audit results page

  <img width="1971" height="1772" alt="image" src="https://github.com/user-attachments/assets/ad1feff9-a7cf-4cd3-b4df-08420acb4a40" />

## Recommendation section

  <img width="993" height="380" alt="image" src="https://github.com/user-attachments/assets/666b106f-0618-4419-af03-1b55fc9b21fc" />

## Lead capture process

<img width="635" height="555" alt="image" src="https://github.com/user-attachments/assets/68703fab-ca96-4d91-a317-16dc6a82a65a" />

## Related Documentation

### Core Project Docs

- [README.md](./README.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [REFLECTION.md](./REFLECTION.md)
- [DEVLOG.md](./DEVLOG.md)
- [TESTS.md](./TESTS.md)

### Product & Planning

- [PRICING_DATA.md](./PRICING_DATA.md)
- [ECONOMICS.md](./ECONOMICS.md)
- [METRICS.md](./METRICS.md)
- [GTM.md](./GTM.md)
- [LANDING_COPY.md](./LANDING_COPY.md)
- [USER_INTERVIEWS.md](./USER_INTERVIEWS.md)

### Development Notes

- [PROMPTS.md](./PROMPTS.md)
- [AGENTS.md](./AGENTS.md)
- [CLAUDE.md](./CLAUDE.md)

### Main Folders

- `app/` — App Router pages and API routes
- `components/` — Reusable UI components
- `constants/` — Static pricing and tool data
- `lib/` — Core business logic and utilities
- `types/` — Shared TypeScript types
- `tests/` — Vitest test files
- `public/` — Static assets
