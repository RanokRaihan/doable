# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

# for desiging component, it's mandatory use shadcnUI, if not possible then can move to custom design

# Get It Done — Agent Codebase Reference

A Next.js task-marketplace where users post tasks and workers accept them. This file is the authoritative guide for AI agents working in this repo.

---

## Cross-Codebase Contract

Before working on anything that touches the backend (API calls, auth flow,
types, response shapes), mandatory read `api-contract.md` in the root of this repo.

It is the source of truth for:

- All endpoint paths and HTTP methods
- Request and response shapes
- Shared enums (TaskStatus, TaskCategory, etc.)
- Auth token delivery and cookie behavior
- Known mismatches between frontend and backend types

## 1. Tech Stack (exact versions)

| Package              | Version                          |
| -------------------- | -------------------------------- |
| Next.js              | `^16.2.0-canary.37` (App Router) |
| React / React DOM    | `19.2.3`                         |
| TypeScript           | `^5` (strict mode)               |
| Tailwind CSS         | `^4` via `@tailwindcss/postcss`  |
| TanStack React Form  | `^1.28.2`                        |
| Zod                  | `^4.3.6`                         |
| Framer Motion        | `^12.31.0`                       |
| Sonner (toasts)      | `^2.0.7`                         |
| shadcn/ui (Radix UI) | via `radix-ui ^1.4.3`            |
| Lucide React         | `^0.563.0`                       |
| `server-only`        | `^0.0.1`                         |

---

## 2. npm Scripts

```bash
npm run dev      # next dev
npm run build    # next build
npm run start    # next start
npm run lint     # eslint
```

> **No test framework** — there are no test scripts or testing dependencies. Do not attempt to run or generate tests.

---

## 3. Environment Variables

Defined and enforced in `src/lib/config.ts`. Missing required vars throw at startup.

| Variable                  | Side   | Required | Default           | Description                                     |
| ------------------------- | ------ | -------- | ----------------- | ----------------------------------------------- |
| `BACKEND_URL`             | Server | **Yes**  | —                 | Backend API base URL (server-only)              |
| `NEXT_PUBLIC_BACKEND_URL` | Client | No       | —                 | Backend URL for client-side fetches (if needed) |
| `NODE_ENV`                | Both   | No       | `"development"`   | Node environment                                |
| `ACCESS_TOKEN_MAX_AGE`    | Server | No       | `900` (15 min)    | Access token cookie max-age in seconds          |
| `REFRESH_TOKEN_MAX_AGE`   | Server | No       | `604800` (7 days) | Refresh token cookie max-age in seconds         |

Use `env.backendUrl`, `env.isProduction`, `cookieConfig.*` from `src/lib/config.ts` — never read `process.env` directly. `NEXT_PUBLIC_BACKEND_URL` is not enforced by `config.ts` and must be accessed via `process.env.NEXT_PUBLIC_BACKEND_URL` in client components only.

---

## 4. Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout — wraps with <AuthProvider>
│   ├── globals.css                 # Tailwind v4 + global styles
│   ├── not-found.tsx
│   ├── (auth)/                     # No shared layout — inherits root
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── unauthorized/page.tsx
│   └── (main)/                     # Has shared layout with Navbar + Footer
│       ├── layout.tsx
│       ├── page.tsx                # Landing page
│       ├── tasks/                  # Task browser
│       ├── about/
│       ├── how-it-works/
│       ├── privacy/
│       └── terms/
│
├── actions/                        # Server Actions ("use server")
│   ├── auth/authAction.ts          # LoginAction, RegisterAction, logoutAction
│   └── common/cookie.ts            # setCookie / clearCookie helpers
│
├── lib/
│   ├── config.ts                   # env + cookieConfig (server-only)
│   ├── types.ts                    # Task domain types
│   ├── utils.ts                    # cn() utility
│   ├── api/
│   │   ├── client.ts               # Core fetch wrapper (retries, auth, timeout)
│   │   ├── errors.ts               # ApiError class
│   │   ├── actionHandler.ts        # Try/catch wrapper for Server Actions
│   │   ├── tokens.ts               # setTokens / clearTokens (cookie access)
│   │   ├── types.ts                # ApiResponse, BackendError, PaginatedResponse, RequestConfig
│   │   ├── utils.ts                # buildUrl, sleep, DEFAULT_TIMEOUT, RETRY_DELAY
│   │   └── index.ts                # Re-exports: apiClient, ApiResponse
│   └── auth/
│       ├── getCurrentUser.ts       # React cache — fetches current user once per request
│       ├── requireAuth.ts          # Server Component auth guard
│       ├── routes-utils.ts         # isAuthRoute / isAuthenticatedRoute / getRequiredRoles
│       └── proxy-utils.ts          # JWT decode, isTokenValid, isTokenExpiringSoon, refreshTokens
│
├── lib/types/
│   └── auth/index.ts               # LoggedinUser, RegisteredUser interfaces
│
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   ├── form/
│   │   ├── hooks.tsx               # useAppForm (TanStack), useFieldContext, useFormContext
│   │   ├── FormBase.tsx            # Label + error wrapper for form fields
│   │   ├── FormCheckbox.tsx
│   │   ├── InputWithIcon.tsx       # Text/email input with leading icon
│   │   └── PasswordInput.tsx       # Password field with show/hide toggle
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── login/                      # LoginForm, LoginFormContainer, LoginLeftSection
│   ├── register/                   # RegisterForm, RegisterFormContainer, RegisterLeftSection
│   ├── tasks/                      # TaskFilters, TaskSearch, TaskPagination, TaskSort, TaskSkeleton, ImageGallery
│   └── landing/                    # hero/, liveFeed/, howItWorks/, category/, testimonial/, becomeHelper/, FAQ/
│
├── providers/
│   └── AuthProvider.tsx            # Client context — holds current user state
│
├── schema/
│   ├── loginValidation.ts          # Zod: email + password (6+ chars)
│   └── registerValidation.ts       # Zod: name (2+) + email + password (8+) + confirmPassword
│
├── content/
│   ├── privacy-policy.md
│   └── terms-of-service.md
│
└── proxy.ts                        # Next.js middleware (token refresh + route protection)
```

`next.config.ts` — only allows remote images from `images.unsplash.com`.

---

## 5. Authentication Architecture

### Cookie names

- `accessToken` — HTTP-only, path `/`, `sameSite: lax`, secure in production
- `refreshToken` — same settings

### Middleware (`src/proxy.ts`)

Runs on every request. Logic:

1. Reads `accessToken` / `refreshToken` from cookies.
2. Decodes + validates the access token.
3. If access token is missing, expired, or expiring soon **and** a refresh token exists → calls `refreshTokens()` from `proxy-utils.ts`.
4. On successful refresh, attaches new cookies to the response **and** forwards `x-refreshed-access-token` header so Server Components can read the new token before the cookie is visible.
5. **Auth routes** (`/login`, `/register`): redirect authenticated users to `/profile`.
6. **Authenticated-only routes** (`/change-password`): redirect unauthenticated users to `/login?callbackUrl=<path>`.
7. **Protected routes** (role-based, see below): check role; redirect to `/unauthorized` on failure.

### Route protection map (`src/lib/auth/routes-utils.ts`)

```ts
const protectedRoutes = {
  "/profile": ["USER", "ADMIN"],
  "/post-task": ["USER", "ADMIN"],
  "/my-tasks": ["USER", "ADMIN"],
  "/admin/*": ["ADMIN"], // wildcard prefix match
};
```

Use `"/*"` suffix for prefix-matching. Everything else is exact-match only.

To add a new protected route, edit only `routes-utils.ts`.

### Server Component auth guard

Use `requireAuth()` from `src/lib/auth/requireAuth.ts` in Server Components that need a user. It calls `getCurrentUser()` (React-cached) and redirects if unauthenticated.

### Client-side auth state

`AuthProvider` (`src/providers/AuthProvider.tsx`) provides `user` via React context. Updated after login/logout via `router.refresh()`.

---

## 6. API Client

Import via `src/lib/api/index.ts`:

```ts
import { apiClient, ApiResponse } from "@/lib/api";
```

### Methods

```ts
apiClient.get<T>(endpoint, config?)
apiClient.post<T>(endpoint, body?, config?)
apiClient.put<T>(endpoint, body?, config?)
apiClient.patch<T>(endpoint, body?, config?)
apiClient.delete<T>(endpoint, config?)
```

### `RequestConfig` options

```ts
{
  params?:     Record<string, string | number | boolean | undefined | null>;
  headers?:    HeadersInit;
  timeout?:    number;          // default: DEFAULT_TIMEOUT
  tags?:       string[];        // Next.js cache tags
  revalidate?: number | false;  // Next.js revalidate
  retries?:    number;          // default: 0 — retries on 5xx/429/network errors
  skipAuth?:   boolean;         // skip Authorization header (e.g. login/register)
  cache?:      RequestCache;
}
```

### Response shapes

**Success:**

```ts
interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  timestamp?: string;
}
```

**Error (backend):**

```ts
type BackendError = {
  success: false;
  message: string;
  statusCode: number;
  errorType?: string;
  errorSources?: Array<{ path: string; message: string }>;
};
```

Thrown errors are wrapped in `ApiError` (from `src/lib/api/errors.ts`). Use `ApiError.isApiError(e)` and `ApiError.isUnauthorized(e)` for type-safe checks.

> **401 is terminal.** The middleware already attempted refresh before the request reached the Server Component. A 401 from the backend means the session is truly expired — never retry on 401. `getCurrentUser()` always returns `null` on any error (including 401) and never throws.

### Server Actions

Always wrap callees in `actionHandler()`:

```ts
import { actionHandler } from "@/lib/api/actionHandler";

const result = await actionHandler(() =>
  apiClient.post<ApiResponse<SomeType>>("/some/endpoint", payload),
);
// result is T | BackendError — check result.success
```

---

## 7. Form System

**Framework:** TanStack React Form v1 with custom field components.

Always import the form hook from `src/components/form/hooks.tsx`:

```ts
import { useAppForm } from "@/components/form/hooks";
```

### Available field components (registered in `useAppForm`)

| Component       | Usage                                   |
| --------------- | --------------------------------------- |
| `InputWithIcon` | Text / email inputs with a leading icon |
| `PasswordInput` | Password field with show/hide toggle    |
| `Checkbox`      | Checkbox (aliased from `FormCheckbox`)  |

Wrap fields with `FormBase` from `src/components/form/FormBase.tsx` to get automatic label, description, and validation error display.

### Validation schemas in `src/schema/`

- `LoginSchema` — email + password (min 6 chars)
- `RegisterSchema` — name (min 2) + email + password (min 8) + confirmPassword (must match)

---

## 8. Domain Types (`src/lib/types.ts`)

```ts
TaskPriority: LOW | MEDIUM | HIGH | URGENT;
TaskCategory: DELIVERY |
  CLEANING |
  REPAIR |
  TUTORING |
  GARDENING |
  MOVING |
  PET_CARE |
  TECH_SUPPORT |
  OTHER;
TaskStatus: OPEN | IN_PROGRESS | COMPLETED | CANCELLED | PAYMENT_PROCESSING;
```

Key interfaces: `Task`, `TaskDetails` (extends Task with `postedBy`), `TaskPoster`, `TaskDetailsResponse`, `PaginationMeta`.

Additional types used by the tasks browser:

- `FilterState` — `{ categories, priorities, search, sortField, sortOrder, page, limit }`
- `SortField` — `"createdAt" | "updatedAt" | "title"`
- `SortOrder` — `"asc" | "desc"`
- `TasksResponse` — paginated tasks API response

> **`Task.baseCompensation` is typed as `string`**, not `number`. Do not do arithmetic on it without parsing.

> **`/tasks` page is WIP** — `src/app/(main)/tasks/page.tsx` uses hardcoded `MOCK_TASKS` with a simulated 500 ms delay. When implementing real data fetching, replace the mock with `apiClient` calls.

---

## 9. UI & Styling Conventions

- **Tailwind CSS v4** — no `tailwind.config.js`; configured entirely via PostCSS (`postcss.config.mjs`).
- **shadcn/ui** components live in `src/components/ui/`. Config in `components.json`.
- **Color palette:** blue/emerald accents, slate base (dark sections use `bg-slate-900`).
- **Responsive:** mobile-first — `lg:` breakpoint separates mobile single-column from desktop two-column layouts.
- **Auth page layout pattern** — `<main className="h-screen flex">` with the left branding section (`hidden lg:flex lg:w-1/2 …`) fixed at viewport height and the right form section (`w-full lg:w-1/2 … overflow-y-auto`) scrolling internally.
- **Animations:** Framer Motion for complex sequences; Tailwind `tw-animate-css` for CSS-only transitions.
- **Icons:** Lucide React only.
- **Toasts:** Sonner — use the `<Toaster>` in root layout.

---

## 10. Key Conventions

- **Server-only modules:** `src/lib/config.ts` and `src/lib/api/tokens.ts` are server-only (import `server-only`). Never import them from `"use client"` files.
- **`"use server"` boundary:** All files in `src/actions/` are Server Actions. Always mark them `"use server"` at the top.
- **`cn()` utility:** Use `cn()` from `src/lib/utils.ts` (combines `clsx` + `tailwind-merge`) for all conditional Tailwind class composition.
- **Adding a new protected route:** Edit `protectedRoutes` in `src/lib/auth/routes-utils.ts` only. No middleware changes needed.
- **Adding a new API endpoint:** Call `apiClient` directly; wrap in `actionHandler()` inside a Server Action if triggered from a form.
- **Image domains:** Only `images.unsplash.com` is allowed in `next.config.ts`. Add new hostnames there if needed.
- **Markdown content:** Legal/static pages are rendered from `.md` files in `src/content/` using the `MarkdownArticle` component (`src/components/ui/MarkdownArticle.tsx`).
- **`const enum` is forbidden** — `tsconfig.json` sets `isolatedModules: true`. Use `const` objects with `as const` instead (all existing domain types follow this pattern).
- **`await searchParams` in page components** — Next.js 15+ requires `searchParams` (and `params`) to be awaited. Both auth pages already follow this pattern: `const { callbackUrl } = await searchParams;`
