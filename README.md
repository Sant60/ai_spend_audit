# AI Spend Audit

This web application, developed as part of the Credex internship assignment, aims to tackle the common issue of teams overspending on AI tools. Many organizations subscribe to multiple AI services monthly without a clear understanding of whether they're on the most cost-effective plans or if their current subscriptions align with their actual needs.

The core functionality of the app allows users to input details about their AI tools, including their monthly expenses, the number of user seats, and the specific use cases. Based on this information, the application then generates a comprehensive audit report. This report not only highlights potential areas of overspending but also provides actionable recommendations for optimization and estimates the potential savings.

---

# Live Demo

## Deployed URL

https://ai-spend-audit-eight-nu.vercel.app/

---

# Loom Walkthrough

<div>
    <a href="https://www.loom.com/share/c8860030acd04b99be1806e7fa9d4109">
      <p>AI Spend Audit Project Walkthrough and Results - Watch Video</p>
    </a>
    <a href="https://www.loom.com/share/c8860030acd04b99be1806e7fa9d4109">
      <img style="max-width:300px;" src="https://cdn.corenexis.com/files/c/4961844720.png">
    </a>
  </div>

### Full Video Link

https://www.loom.com/share/c8860030acd04b99be1806e7fa9d4109

---

# Key Features

- The ability to catalog AI tools, their associated plans, seat counts, and monthly costs.
- Persistent storage of user input via `localStorage` to prevent data loss upon page refresh.
- A rule-based system for generating audit recommendations, ensuring predictability and ease of verification.
- Calculations for estimated monthly and annual cost savings.
- Integration with the Anthropic API to generate concise, personalized AI summaries.
- The creation of shareable pages for audit results.
- A lead capture mechanism that stores data in Supabase.

---

# Supported Tools

- Cursor
- GitHub Copilot
- Claude
- ChatGPT
- Anthropic API
- OpenAI API
- Gemini
- Windsurf

---

# Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase for backend services
- Anthropic API for AI capabilities
- Vitest for testing
- GitHub Actions for CI/CD
- Vercel for deployment

---

# Screenshots

## Landing page

<img width="1971" height="1360" alt="image" src="https://github.com/user-attachments/assets/a5839847-0a91-4503-8fa5-9eb9062c7787" />

---

## Audit form

<img width="1971" height="1139" alt="image" src="https://github.com/user-attachments/assets/f99e2d93-18c1-4c86-8907-24163cbb09f0" />

---

## Audit results page

<img width="1971" height="2509" alt="image" src="https://github.com/user-attachments/assets/9da5a298-4c7e-4382-abab-11eede2936d1" />

---

## Recommendation section

<img width="994" height="474" alt="image" src="https://github.com/user-attachments/assets/55f3a397-6cd4-4b6f-9665-9928f069cc34" />

---

## Lead capture process

<img width="642" height="653" alt="image" src="https://github.com/user-attachments/assets/0ed4e43b-d2dc-4a50-a1b3-31ad1b7239a0" />

---

# Local Setup

## 1. Install dependencies

```bash
npm install
```

---

## 2. Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# AI summary — at least one required; tried in order: Gemini → Anthropic → OpenAI
# Gemini is free at aistudio.google.com (recommended)
GEMINI_API_KEY=your-gemini-api-key

# Anthropic (optional fallback) — console.anthropic.com
ANTHROPIC_API_KEY=your-anthropic-api-key

# OpenAI (optional fallback) — platform.openai.com
OPENAI_API_KEY=your-openai-api-key

# Email notifications (optional) — resend.com free tier
RESEND_API_KEY=your-resend-api-key
```

---

## 3. Start the development server

```bash
npm run dev
```

---

## 4. Run tests

```bash
npm run test -- --run
```

---

## 5. Run lint checks

```bash
npm run lint
```

---

# Database Schema

## audits

Stores details about each audit, such as:

- tool name
- current plan
- monthly spend
- seats
- team size
- use case
- audit output payload

---

## leads

Captures information from users interested in the service, including:

- audit ID
- name
- email
- company
- Role

---

# Development Decisions

- Audit calculations were intentionally kept rule-based to ensure recommendations are consistent and easy to validate.
- AI was specifically utilized for generating personalized summary content, rather than for core audit logic.
- `localStorage` was implemented to preserve user input, enhancing the user experience by preventing data loss.
- The focus was placed on usability and clarity, prioritizing a clean interface over excessive animations or visual effects.
- Much of the core logic was modularized within the `lib/audit/` directory to simplify debugging and maintenance.

---

# Testing

The project includes automated tests covering:

- Savings calculations
- Recommendation logic
- Overspend detection
- Audit generation edge cases

Run tests using:

```bash
npm run test -- --run
```

---

# CI/CD

GitHub Actions automatically runs:

- Lint checks
- Automated tests

on every push to `main`.

---

# Related Documentation

## Core Project Docs

- [README.md](./README.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [REFLECTION.md](./REFLECTION.md)
- [DEVLOG.md](./DEVLOG.md)
- [TESTS.md](./TESTS.md)

---

## Product & Planning

- [PRICING_DATA.md](./PRICING_DATA.md)
- [ECONOMICS.md](./ECONOMICS.md)
- [METRICS.md](./METRICS.md)
- [GTM.md](./GTM.md)
- [LANDING_COPY.md](./LANDING_COPY.md)
- [USER_INTERVIEWS.md](./USER_INTERVIEWS.md)

---

## Development Notes

- [PROMPTS.md](./PROMPTS.md)
- [AGENTS.md](./AGENTS.md)
- [CLAUDE.md](./CLAUDE.md)

---

# Main Folders

- `app/` — App Router pages and API routes
- `components/` — Reusable UI components
- `constants/` — Static pricing and tool data
- `lib/` — Core business logic and utilities
- `types/` — Shared TypeScript types
- `tests/` — Vitest test files
- `public/` — Static assets

---

# Assignment Context

Built as part of the Credex Web Development Internship Assignment.
