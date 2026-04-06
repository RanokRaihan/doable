# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Next.js)
npm run build    # Production build
npm run lint     # Run ESLint
```

**No test framework is installed.** Do not attempt to run or generate tests.

## Full Architecture Reference

`AGENTS.md` is the authoritative codebase reference. Read it before making changes. It covers: tech stack versions, environment variables, project structure, authentication architecture, API client usage, form system, domain types, UI conventions, and key constraints.

## Architecture at a Glance

- **Frontend-only Next.js app** (App Router, React 19, TypeScript strict mode) — no database or ORM; all persistence is in a separate backend API at `BACKEND_URL`.
- **Server Components by default.** Add `"use client"` only when necessary (event handlers, hooks, browser APIs).
- **Auth:** JWT access + refresh tokens in HTTP-only cookies. The middleware (`src/proxy.ts`) handles token refresh transparently before every request. A 401 from the backend means the session is truly expired — never retry on 401.
- **Server Actions** live in `src/actions/` and must be marked `"use server"`. Wrap API calls in `actionHandler()` from `src/lib/api/actionHandler.ts`.
- **Route protection:** Add entries to `protectedRoutes` in `src/lib/auth/routes-utils.ts` — no other files need changing.
- **Forms:** TanStack React Form v1 via `useAppForm()` from `src/components/form/hooks.tsx`, validated with Zod schemas in `src/schema/`.
- **`/tasks` page uses mock data** (`MOCK_TASKS`) — replace with `apiClient` calls when implementing real data fetching.

## Critical Constraints

- **`const enum` is forbidden** (`isolatedModules: true`). Use `const` objects with `as const`.
- **`src/lib/config.ts` and `src/lib/api/tokens.ts` are server-only** — never import them from `"use client"` files.
- **`searchParams` and `params` in page components must be awaited** (Next.js 15+ requirement).
- **`Task.baseCompensation` is typed as `string`** — parse before arithmetic.
- **Images:** Only `images.unsplash.com` is whitelisted in `next.config.ts`.
- **Before any Next.js work,** read the relevant docs in `node_modules/next/dist/docs/` — training data is outdated.
