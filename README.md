# AI Spend Audit

This web application, developed as part of the Credex internship, aims to tackle the common issue of teams overspending on AI tools. Many organizations subscribe to multiple AI services monthly without a clear understanding of whether they're on the most cost-effective plans or if their current subscriptions align with their actual needs.

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

- Landing page
- Audit form
- Audit results page
- Recommendation section
- Lead capture process

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DEVLOG.md](./DEVLOG.md)
- [REFLECTION.md](./REFLECTION.md)
- [TESTS.md](./TESTS.md)
