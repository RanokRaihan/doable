# CLAUDE.md

Frontend-only Next.js 16 canary (App Router) task-marketplace. React 19, TypeScript strict, Tailwind v4. No database — all persistence lives in a separate backend API (`BACKEND_URL`). JWT access + refresh tokens in HTTP-only cookies, refreshed transparently by middleware in `src/proxy.ts`. shadcn/ui is the mandatory first choice for all UI components.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

**No test framework is installed.** Do not attempt to run or generate tests.

## Coding Conventions

- **Naming:** `PascalCase` for components and types; `camelCase` for functions/variables/non-component files; `SCREAMING_SNAKE_CASE` for enum values (via `const` objects `as const`).
- **File names:** Match the exported component exactly (`LoginForm.tsx` exports `LoginForm`). Non-component files are `camelCase`.
- **Imports:** Use `@/` alias for all `src/` imports. No relative `../../` imports.
- **`cn()` utility:** Always use `cn()` from `src/lib/utils.ts` for all conditional Tailwind class composition.
- **Server vs. client:** Server Components by default. Add `"use client"` only for event handlers, hooks, or browser APIs.
- **Server Actions:** One file per action in `src/actions/{domain}/`. Every file must be marked `"use server"` at the top. Wrap all API calls in `actionHandler()`.
- **Forms:** Always use `useAppForm()` from `src/components/form/hooks.tsx`. Validate with Zod schemas from `src/schema/`.
- **Zod schemas:** One file per form in `src/schema/{feature}Validation.ts`.
- **UI components:** Use shadcn/ui first. Only use custom design if a shadcn component does not exist.
- **Icons:** Lucide React only.
- **Toasts:** Sonner — `<Toaster>` is already in root layout.

## Do NOT

- Do not traverse the full `src/` tree to find files — check the directory map in AGENTS.md first.
- Do not re-read files whose purpose is already described in AGENTS.md unless you need their exact content.
- Do not assume file locations — verify against AGENTS.md before reading.
- Do not import `src/lib/config.ts` or `src/lib/api/tokens.ts` from `"use client"` files — they are server-only.
- Do not use `const enum` — `isolatedModules: true` is set. Use `const` objects with `as const`.
- Do not retry on 401 — middleware already attempted refresh; a 401 from the backend means the session is expired.
- Do not read `node_modules/` or `.next/` unless explicitly asked.
- Do not read `process.env` directly on the server — use `env.*` and `cookieConfig.*` from `src/lib/config.ts`; use `process.env.NEXT_PUBLIC_*` in client components only.
- Do not use raw `searchParams` or `params` in page components — they must be awaited (Next.js 15+ requirement).

## API / Type Questions

Before touching anything that calls the backend, read the `api-contracts/` directory in the repo root. Start with `api-contracts/index.md` for an overview, then read the relevant module file (`api-contracts/api-contract-auth.md`, `api-contracts/api-contract-task.md`, etc.). These files are the source of truth for endpoint paths, request/response shapes, shared enums, and cookie behavior. Cross-cutting concerns (error shapes, pagination, Decimal gotchas) are in `api-contracts/shared.md`.

For all domain types, see `src/lib/types.ts`. For auth types, see `src/lib/types/auth/index.ts`.

## Mandatory Post-Task Protocol

After any task that creates or deletes a file, renames something, or makes an architectural decision, you MUST update AGENTS.md before the task is considered done:
1. Add or remove the file from the directory map with a one-line purpose description
2. Append any architectural decision to ## Architectural Decisions
3. Add a one-line entry to ## Recent Changes at the top of AGENTS.md (format: YYYY-MM-DD — what changed)
