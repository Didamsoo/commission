# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AutoPerf Pro — a margin/commission management platform for automotive dealerships. French-language domain (UI, API errors, DB columns). Supports 6 role levels: commercial (1), chef_ventes (2), dir_concession (3), dir_marque (4), dir_plaque (5), admin (6). Each role has its own dashboard section and route group.

Role hierarchy is defined in `types/hierarchy.ts` with `ROLE_CONFIG` (levels, labels, colors, `canChallenge` chain) and `DEFAULT_PERMISSIONS` per role. Note: `admin` has `level: 0` in `ROLE_CONFIG` (not 6) — the value 6 is only used in middleware's `ROLE_LEVELS` for route gating.

## Setup

Requires Node.js 20+ and npm 10+. Copy `.env.example` to `.env.local` and fill in Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`), VAPID keys, Resend API key, and Sentry DSN.

## Commands

```bash
npm run dev              # Dev server (localhost:3000)
npm run build            # Production build
npm run test             # Unit tests (Vitest)
npm run test:watch       # Unit tests in watch mode
npm run test:coverage    # Unit tests with coverage
npm run test:e2e         # E2E tests (Playwright, needs dev server running)
npm run test:e2e:ui      # E2E tests with Playwright UI
npm run lint             # ESLint (default)
npm run lint:strict      # ESLint zero-warnings mode
npm run format           # Prettier write
npm run format:check     # Prettier check
```

Run a single unit test file: `npx vitest run path/to/file.test.ts`
Run a single E2E test: `npx playwright test e2e/file.spec.ts`

## Architecture

**Stack:** Next.js 15 (App Router) + React 19 + TypeScript strict, Supabase (auth + PostgreSQL + storage), Tailwind CSS 4, shadcn/ui, Recharts, Vitest + Playwright.

### Route Groups

- `app/(auth)/` — public auth pages (login, register, forgot/reset password)
- `app/(protected)/` — authenticated pages, organized by role:
  - `/dashboard`, `/calculator`, `/challenges`, `/leaderboard`, `/profile` — shared/commercial
  - `/chef-ventes/` — sales manager (level 2+)
  - `/direction/` — dealership director (level 3+)
  - `/marque/` — brand director (level 4+)
  - `/groupe/` — group director (level 5+)
- `app/api/` — API route handlers

### Middleware (`middleware.ts`)

Handles auth gating and role-based route protection. Uses Supabase SSR client with cookie forwarding. Role level is read from `user.user_metadata.role`. Routes under `/groupe`, `/marque`, `/direction`, `/chef-ventes` require minimum role levels (5, 4, 3, 2 respectively). Unauthenticated users on protected routes redirect to `/login`; authenticated users on auth pages redirect to their role home.

### Auth Pattern

All API routes authenticate via `getAuthenticatedUser()` from `lib/api/auth.ts`. Returns `AuthContext` (user, profile, supabase client) or `null`. Error responses use helpers from `lib/api/errors.ts`: `unauthorized()`, `forbidden()`, `badRequest()`, `notFound()`, `serverError()`.

### API Route Pattern

```typescript
import { getAuthenticatedUser } from '@/lib/api/auth'
import { unauthorized, forbidden, serverError } from '@/lib/api/errors'

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser()
  if (!auth) return unauthorized()
  // role check, then logic, wrap errors with serverError()
}
```

### Data Layer

- **Server:** `createClient()` from `lib/supabase/server.ts` (SSR, cookie-based)
- **Client:** `createClient()` from `lib/supabase/client.ts` (browser)
- **API client:** `lib/api/client.ts` — `apiFetch<T>()` wrapper returns `ApiResponse<T>`, throws `ApiError` on non-OK responses. Used by all client-side hooks.
- **Hooks:** `hooks/use-api.ts` provides `useApi<T>()` generic fetcher (pass `null` URL to skip); domain hooks (`use-dashboard.ts`, `use-fiches-marge.ts`, `use-defis.ts`, etc.) wrap specific endpoints
- **Validation:** Zod schemas in `lib/validations/` for each domain (defis, fiches-marge, profil, etc.)
- **Display mapping:** `lib/types/display.ts` — `mapMarqueToBrand()`, `mapConcessionToDealership()`, `displayValue()`
- **KPI helpers:** `lib/utils/kpi-helpers.ts` — `deriveBrandKPIs()`, `computeTrend()`

### Key Domain Concepts

- **Fiches marge** (margin sheets): core data entity. `vehicle_type` values: VP (displayed as "VN"), VO, VU
- **Défis** (challenges): platform challenges (`defis_plateforme`) and P2P challenges (`defis-p2p`). API returns participants as `defis_plateforme_participants`
- **Equipes** (teams): `objective` field is JSONB containing `monthly_target`
- **Profile:** no `concession_name` column — `/api/profil` joins on `concessions` table

### Heavy Imports

jspdf, xlsx are dynamically imported (`import()`) on user action to avoid bundle bloat. Do not convert these to static imports.

### Component Structure

- `components/ui/` — shadcn/ui primitives (54+ components)
- `components/charts/` — Recharts wrappers
- `components/p2p-challenges/` — P2P challenge system
- `components/margin-calculator.tsx` — large (59KB), core business logic

### Testing

- **Unit:** Vitest with jsdom, tests in `__tests__/` directories. Setup: `vitest.setup.ts`
- **E2E:** Playwright in `e2e/`, tests 6 browsers/devices, has auth setup project
- **CI:** GitHub Actions runs lint (warn-only), test, build on push/PR to main

### Path Alias

`@/*` maps to project root in both `tsconfig.json` and `vitest.config.ts`.

## DB Schema Notes

- `satisfaction` and `stock_days` have no real data source — display "N/A" when value is 0
- Sales target comes from `equipes.objective.monthly_target` (fallback: `totalSales * 1.1`)
- `ChallengeFormData` uses flat reward fields (`rewardType`, `rewardValue`), not nested `reward.type`

## Deployment

Vercel with automatic deploys on push to `main`. `.npmrc` has `legacy-peer-deps=true` for Vercel compatibility. Sentry tunnel route at `/monitoring`.
