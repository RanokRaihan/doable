# Doable — Agent Codebase Reference

## Recent Changes

- 2026-07-11 — Added demo-user one-click login: `DemoLogin.tsx` (client) renders two buttons on the login page, calling new `demoLoginAction` (wraps `LoginAction` with server-only credentials from `env.demoUsers` in config.ts, sourced from `DEMO_USER_1/2_EMAIL/PASSWORD` env vars)
- 2026-05-13 — Added title/description metadata to every page; root layout uses title template + OG image (public/og-image.png 1200×630); generateMetadata for tasks/[id] and users/[id]; noindex on auth/profile/private pages; fixed pre-existing FAQ import casing and WithdrawalMethodEditForm validator type cast
- 2026-05-11 — Added /api/auth/sign-out route handler; fixed ghost-user stuck-void bug in getCurrentUser.ts (401 + cookies present now force-clears session)
- 2026-05-10 — Resolved audit findings: C-1 (Cloudinary auth guard), C-2 (BACKEND_URL URL construction), H-1 (proxy cookie via response.cookies), H-2 (updateWithdrawalMethod optional fields), H-4 (cancel reason label), M-1 (removed 10 console.logs), M-3 (logout calls backend), L-1/L-2 (AGENTS.md stale docs); implemented deleteTaskAction (I-1)
- 2026-05-09 — Withdrawal module implemented: 11 server actions, 13 components, 10 pages/routes, 5 Zod schemas, types, and sidebar link added
- 2026-05-09 — Deleted api-contract.md; all three agent instruction files (CLAUDE.md, AGENTS.md, copilot-instructions.md) now point to api-contracts/ directory
- 2026-05-04 — Unified TaskCard: LandingTaskCard renamed/moved to src/components/common/TaskCard.tsx (replaces old card); used in landing, browse, and related tasks; related tasks now fetched from /task/:id/related via getRelatedTasksAction
- 2026-05-03 — Auth pages redesigned: dark editorial left panel (ticket cards, Instrument Serif headings, orange tokens), warm off-white right form panel; PasswordStrengthMeter added; register password now requires 1 letter + 1 number
- 2026-05-02 — Landing page redesigned: warm off-white/orange design system, Instrument Serif headings, 7 new section components; Navbar and Footer rewritten globally; all old landing components deleted
- 2026-05-02 — Added payment result pages (fail, cancel, refunded) and shared _components/paymentPageHelpers.tsx; all payment result pages now redirect based on session status
- 2026-05-02 — Updated TaskStatus enum (PAYMENT_PROCESSING → PAYMENT_PENDING + PAYMENT_INITIATED); added CLOSED to ApplicationStatus
- 2026-04-27 — Restructured context files; full directory map updated to reflect payments, wallet, commission-due, application, and profile areas; tasks page confirmed on real API data; mock tasks removed

---

A Next.js task-marketplace where users post tasks and workers accept them. This file is the authoritative directory map, tech stack reference, and architectural decision log for AI agents working in this repo.

Before working on anything that touches the backend (API calls, auth flow, types, response shapes), read the `api-contracts/` directory. Start with `api-contracts/index.md` for an overview, then open the relevant module file. Cross-cutting concerns live in `api-contracts/shared.md`.

---

## Tech Stack

| Tool                        | Version                          | Purpose                                |
| --------------------------- | -------------------------------- | -------------------------------------- |
| Next.js                     | `^16.2.0-canary.37` (App Router) | Framework                              |
| React / React DOM           | `19.2.3`                         | UI rendering                           |
| TypeScript                  | `^5` (strict mode)               | Type safety                            |
| Tailwind CSS                | `^4` via `@tailwindcss/postcss`  | Styling — no tailwind.config.js        |
| TanStack React Form         | `^1.28.2`                        | Form state management                  |
| Zod                         | `^4.3.6`                         | Schema validation                      |
| Framer Motion               | `^12.31.0`                       | Complex animations                     |
| Sonner                      | `^2.0.7`                         | Toast notifications                    |
| shadcn/ui (Radix UI)        | via `radix-ui ^1.4.3`            | UI component library                   |
| Lucide React                | `^0.563.0`                       | Icons                                  |
| `server-only`               | `^0.0.1`                         | Enforces server-side module boundaries |
| lodash                      | `^4.18.1`                        | Utility functions                      |
| react-datepicker            | `^9.1.0`                         | Date/time picker                       |
| react-easy-crop             | `^5.5.7`                         | Image cropping for avatar upload       |
| react-markdown + remark-gfm | `^10.1.0` / `^4.0.1`             | Renders .md content pages              |
| next-themes                 | `^0.4.6`                         | Theme management                       |
| tw-animate-css              | `^1.4.0`                         | CSS-only transition utilities          |

---

## Environment Variables

Defined and enforced in `src/lib/config.ts`. Missing required vars throw at startup.

| Variable                  | Side   | Required | Default           | Description                                     |
| ------------------------- | ------ | -------- | ----------------- | ----------------------------------------------- |
| `BACKEND_URL`             | Server | **Yes**  | —                 | Backend API base URL (server-only)              |
| `NEXT_PUBLIC_BACKEND_URL` | Client | No       | —                 | Backend URL for client-side fetches (if needed) |
| `NODE_ENV`                | Both   | No       | `"development"`   | Node environment                                |
| `ACCESS_TOKEN_MAX_AGE`    | Server | No       | `900` (15 min)    | Access token cookie max-age in seconds          |
| `REFRESH_TOKEN_MAX_AGE`   | Server | No       | `604800` (7 days) | Refresh token cookie max-age in seconds         |

Use `env.*` / `cookieConfig.*` from `src/lib/config.ts` — never read `process.env` directly on the server.

---

## Directory Map

```
src/
├── app/
│   ├── layout.tsx                  # Root layout — wraps with <AuthProvider>, mounts <Toaster>
│   ├── globals.css                 # Tailwind v4 base + global styles
│   ├── not-found.tsx               # 404 page
│   ├── api/
│   │   ├── cloudinary-signature/
│   │   │   └── route.ts            # API route: generates signed Cloudinary upload params
│   │   └── auth/
│   │       └── sign-out/
│   │           └── route.ts        # API route: clears auth cookies and redirects to /login (force-logout for ghost users)
│   ├── (auth)/                     # Auth pages — no shared layout beyond root
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── unauthorized/page.tsx
│   └── (main)/                     # All non-auth pages — shared Navbar + Footer layout
│       ├── layout.tsx              # Mounts Navbar, Footer, NavigationProgress
│       ├── page.tsx                # Landing page
│       ├── about/page.tsx
│       ├── how-it-works/page.tsx
│       ├── privacy/page.tsx
│       ├── terms/page.tsx
│       ├── complete-profile/page.tsx   # Onboarding: complete profile form
│       ├── verify-email/page.tsx       # Email verification flow
│       ├── post-task/page.tsx          # Post a new task (onboarding-gated)
│       ├── tasks/
│       │   ├── page.tsx            # Task browser — real API data, URL-based filters
│       │   └── [id]/
│       │       ├── page.tsx        # Task detail
│       │       └── loading.tsx
│       ├── users/
│       │   └── [id]/
│       │       ├── page.tsx        # Public user profile
│       │       └── loading.tsx
│       └── profile/                # Authenticated area — protected (USER | ADMIN)
│           ├── layout.tsx          # Profile layout with <ProfileSidebar>
│           ├── page.tsx            # Profile overview
│           ├── change-password/page.tsx
│           ├── update-information/page.tsx
│           ├── reviews/page.tsx
│           ├── tasks/
│           │   ├── page.tsx        # My posted tasks list
│           │   ├── loading.tsx
│           │   ├── edit/[id]/
│           │   │   ├── page.tsx    # Edit task form
│           │   │   └── loading.tsx
│           │   └── [taskId]/
│           │       ├── page.tsx    # Task detail (owner view)
│           │       ├── loading.tsx
│           │       ├── payment/
│           │       │   ├── page.tsx    # Initiate payment (cash or online)
│           │       │   └── loading.tsx
│           │       └── applications/
│           │           ├── page.tsx        # Applicants list for a task (owner view)
│           │           ├── loading.tsx
│           │           └── [applicationId]/page.tsx  # Approve / reject specific application
│           ├── applications/
│           │   ├── page.tsx            # My applications as a worker
│           │   ├── loading.tsx
│           │   └── [applicationId]/page.tsx  # Application detail + withdraw / actions
│           ├── payments/
│           │   ├── page.tsx            # Redirects to payment-made tab
│           │   ├── _components/
│           │   │   └── paymentPageHelpers.tsx  # Shared components + utilities for all payment result pages
│           │   ├── [paymentId]/
│           │   │   ├── page.tsx        # Payment detail
│           │   │   └── loading.tsx
│           │   ├── success/page.tsx    # Gateway success callback — validates COMPLETED status, redirects others
│           │   ├── cancel/page.tsx     # Gateway cancel callback — validates CANCELLED status, redirects others
│           │   ├── fail/page.tsx       # Gateway failure callback — validates FAILED status, redirects others
│           │   ├── refunded/page.tsx   # Refund confirmation — validates REFUNDED status, redirects others
│           │   └── (tabbed)/           # Route group for tabbed payments layout
│           │       ├── layout.tsx      # Mounts <PaymentsTabNav>
│           │       ├── payment-made/
│           │       │   ├── page.tsx    # Payments made by user
│           │       │   └── loading.tsx
│           │       └── payment-received/
│           │           ├── page.tsx    # Payments received by user
│           │           └── loading.tsx
│           ├── wallet/
│           │   ├── page.tsx            # Wallet balance + transaction list
│           │   ├── loading.tsx
│           │   └── [id]/
│           │       ├── page.tsx        # Wallet transaction detail
│           │       └── loading.tsx
│           ├── commission-due/
│           │   ├── page.tsx            # Commissions owed to platform
│           │   ├── loading.tsx
│           │   └── [dueId]/
│           │       ├── page.tsx        # Commission due detail + pay action
│           │       └── loading.tsx
│           └── withdrawal/
│               ├── page.tsx            # Redirects to /profile/withdrawal/methods
│               ├── (tabbed)/
│               │   ├── layout.tsx      # Mounts <WithdrawalTabNav> + page header
│               │   ├── methods/
│               │   │   ├── page.tsx    # Withdrawal methods list (WithdrawalMethodsClient)
│               │   │   └── loading.tsx
│               │   └── requests/
│               │       ├── page.tsx    # Withdrawal requests list; fetches requests + methods + wallet in parallel
│               │       └── loading.tsx
│               ├── methods/
│               │   ├── new/page.tsx    # Create withdrawal method form
│               │   └── [id]/
│               │       ├── page.tsx    # Method detail (WithdrawalMethodDetail)
│               │       ├── loading.tsx
│               │       └── edit/page.tsx  # Edit method form
│               └── requests/
│                   ├── new/page.tsx    # Create withdrawal request; shows info banner if no methods
│                   └── [id]/
│                       ├── page.tsx    # Request detail (WithdrawalRequestDetail)
│                       ├── loading.tsx
│                       └── edit/page.tsx  # Edit request (PENDING guard at page level)
│
├── actions/                        # Server Actions — "use server", one action per file
│   ├── auth/
│   │   └── authAction.ts           # LoginAction, RegisterAction, logoutAction
│   ├── common/
│   │   └── cookie.ts               # setCookie / clearCookie helpers
│   ├── application/
│   │   ├── approveApplicationAction.ts
│   │   ├── getApplicationDetailsAction.ts
│   │   ├── rejectApplicationAction.ts
│   │   └── withdrawApplicationAction.ts
│   ├── payment/
│   │   ├── confirmCashPaymentAction.ts
│   │   ├── declineCashPaymentAction.ts
│   │   ├── getPaymentDetailAction.ts
│   │   ├── getPaymentSessionAction.ts
│   │   ├── getPaymentsMadeAction.ts
│   │   ├── getPaymentsReceivedAction.ts
│   │   ├── initCashPaymentAction.ts
│   │   └── initOnlinePaymentAction.ts
│   ├── task/
│   │   ├── applyTaskAction.ts
│   │   ├── approveCompletionAction.ts
│   │   ├── deleteTaskAction.ts     # DELETE /task/delete-task/:taskId — soft-delete owned task
│   │   ├── markTaskCompletedAction.ts
│   │   ├── markTaskInProgressAction.ts
│   │   ├── requestRevisionAction.ts
│   │   └── taskAction.ts           # Post task, edit task, get tasks
│   ├── user/
│   │   ├── getPublicProfileAction.ts
│   │   └── userAction.ts           # Update profile, complete profile, change password, avatar
│   ├── wallet/
│   │   ├── getCommissionDueAction.ts
│   │   ├── getCommissionsDueAction.ts
│   │   ├── getMyWalletAction.ts
│   │   ├── getWalletTransactionAction.ts
│   │   ├── getWalletTransactionsAction.ts
│   │   └── payCommissionDueAction.ts
│   └── withdrawal/
│       ├── getWithdrawalMethodsAction.ts   # GET /withdrawal/my-methods (paginated + filterable)
│       ├── getWithdrawalMethodAction.ts    # GET /withdrawal/my-methods/:id
│       ├── createWithdrawalMethodAction.ts # POST /withdrawal/my-methods
│       ├── updateWithdrawalMethodAction.ts # PATCH /withdrawal/my-methods/:id
│       ├── setDefaultWithdrawalMethodAction.ts # PATCH /withdrawal/my-methods/:id/set-default
│       ├── deleteWithdrawalMethodAction.ts # DELETE /withdrawal/my-methods/:id
│       ├── getWithdrawalRequestsAction.ts  # GET /withdrawal/my-requests (paginated + filterable)
│       ├── getWithdrawalRequestAction.ts   # GET /withdrawal/my-requests/:id
│       ├── createWithdrawalRequestAction.ts # POST /withdrawal/my-requests
│       ├── editWithdrawalRequestAction.ts  # PATCH /withdrawal/my-requests/:id
│       └── cancelWithdrawalRequestAction.ts # PATCH /withdrawal/my-requests/:id/cancel
│
├── lib/
│   ├── config.ts                   # env + cookieConfig — SERVER-ONLY (imports server-only)
│   ├── types.ts                    # All domain types and enums (Task, Payment, Wallet, Commission…)
│   ├── taskStatusConfig.ts         # Badge label + Tailwind className map for every TaskStatusType
│   ├── utils.ts                    # cn() utility (clsx + tailwind-merge)
│   ├── api/
│   │   ├── client.ts               # Core fetch wrapper: retries, auth header, timeout
│   │   ├── errors.ts               # ApiError class — use .isApiError() / .isUnauthorized()
│   │   ├── actionHandler.ts        # Try/catch wrapper for Server Actions
│   │   ├── tokens.ts               # setTokens / clearTokens — SERVER-ONLY
│   │   ├── types.ts                # ApiResponse<T>, BackendError, RequestConfig
│   │   ├── utils.ts                # buildUrl, sleep, DEFAULT_TIMEOUT, RETRY_DELAY
│   │   └── index.ts                # Re-exports: apiClient, ApiResponse
│   ├── auth/
│   │   ├── getCurrentUser.ts       # React cache — fetches current user once per request; never throws
│   │   ├── getEmailVerificationStatus.ts  # Fetches email verification status (cache: no-store)
│   │   ├── requireAuth.ts          # Server Component guard — redirects to /login if unauthenticated
│   │   ├── routes-utils.ts         # isAuthRoute, isAuthenticatedRoute, getRequiredRoles, isOnboardingGatedRoute
│   │   └── proxy-utils.ts          # JWT decode, isTokenValid, isTokenExpiringSoon, refreshTokens
│   ├── form/
│   │   └── form-error.ts           # Helpers to extract and format server error messages for forms
│   └── types/
│       └── auth/index.ts           # LoggedinUser, RegisteredUser, AuthContextType, EmailVerificationStatus
│
├── components/
│   ├── ui/                         # shadcn/ui primitives — do not edit generated files directly
│   ├── form/                       # Shared form field components (registered in useAppForm)
│   │   ├── hooks.tsx               # useAppForm (TanStack), useFieldContext, useFormContext
│   │   ├── FormBase.tsx            # Label + description + error wrapper for any field
│   │   ├── FormCheckbox.tsx        # Checkbox field
│   │   ├── InputWithIcon.tsx       # Text/email input with leading icon
│   │   ├── PasswordInput.tsx       # Password field with show/hide toggle
│   │   ├── DateTimeField.tsx       # Date/time picker (wraps react-datepicker)
│   │   ├── NumberInputField.tsx    # Numeric input
│   │   ├── SelectField.tsx         # Select dropdown
│   │   ├── TextAreaField.tsx       # Textarea
│   │   └── ServerErrorDisplay.tsx  # Renders server-side errors inside a form
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── NavigationProgress.tsx  # Top loading bar during client-side navigation
│   ├── common/
│   │   └── TaskCard.tsx            # Unified task card (warm DS style) — used in landing, browse, and related tasks
│   ├── landing/                    # Landing page section components (redesigned 2026-05-02)
│   │   ├── hero/HeroSlider.tsx         # 5-slide hero carousel (client)
│   │   ├── howItWorks/HowItWorks.tsx   # Dark card with poster/helper tabs (client)
│   │   ├── recentTasks/RecentTasks.tsx # Recently posted tasks, fetches /task/recently-posted (server)
│   │   ├── categories/Categories.tsx   # 6-category grid linking to /tasks (server)
│   │   ├── testimonials/Testimonials.tsx   # 3-quote testimonials (server)
│   │   ├── faq/FAQ.tsx                 # 2-column FAQ accordion with shadcn Accordion (client)
│   │   └── cta/CTAStrip.tsx            # Dark CTA strip at bottom of landing (server)
│   ├── about/                      # About page section components
│   ├── howItWorks/                 # How It Works page section components
│   ├── login/                      # LoginForm, LoginFormContainer, LoginLeftSection, DemoLogin (demo-user quick login)
│   ├── register/                   # RegisterForm, RegisterFormContainer, RegisterLeftSection, PasswordStrengthMeter
│   ├── forgot-password/            # ForgotPasswordForm, container, left section
│   ├── reset-password/             # ResetPasswordForm, container, left section
│   ├── verify-email/               # VerifyEmailCheck, VerifyEmailPrompt
│   ├── post-task/                  # PostTaskForm, ImageUploader, LocationPicker
│   ├── tasks/
│   │   ├── TaskFilters.tsx         # Category + priority filter panel
│   │   ├── TaskSearch.tsx          # Search input
│   │   ├── TaskPagination.tsx      # Pagination controls
│   │   ├── TaskSort.tsx            # Sort field/order selector
│   │   ├── TaskSkeleton.tsx        # Loading skeleton for task cards
│   │   ├── ImageGallery.tsx        # Image gallery for task detail
│   │   ├── browse/                 # URL-driven controls: TasksControlBar, TasksUrlPagination, FiltersBarSkeleton
│   │   └── detail/                 # Task detail subcomponents: ApplyTaskDialog, TaskBadges, TaskInfoCard, etc.
│   └── profile/
│       ├── ProfileSidebar.tsx      # Left sidebar for profile area
│       ├── OnboardingBanner.tsx    # Banner prompting profile completion / email verification
│       ├── AvatarUploadDialog.tsx  # Avatar upload with crop (react-easy-crop + Cloudinary)
│       ├── ChangePasswordForm.tsx
│       ├── CompleteProfileForm.tsx
│       ├── UpdateInformationForm.tsx
│       ├── applications/           # Application management components (worker view)
│       ├── tasks/                  # My tasks management components (owner view)
│       ├── payments/               # Payment history components
│       ├── wallet/                 # Wallet + transaction components
│       ├── commission-due/         # Commission due management components
│       └── withdrawal/
│           ├── WithdrawalTabNav.tsx            # Tab nav: Methods / Requests (client, usePathname)
│           ├── WithdrawalStatusBadge.tsx       # Status badge for all 5 withdrawal statuses
│           ├── methods/
│           │   ├── WithdrawalMethodCard.tsx    # Compact method card (server) — links to detail
│           │   ├── WithdrawalMethodsClient.tsx # List client: filter, sort, pagination, empty state
│           │   ├── WithdrawalMethodDetail.tsx  # Full detail view with Set Default / Edit / Delete actions
│           │   ├── WithdrawalMethodForm.tsx    # Reusable create/edit form; bank fields shown conditionally
│           │   └── DeleteWithdrawalMethodDialog.tsx  # AlertDialog; handles "has pending requests" 400 error
│           └── requests/
│               ├── WithdrawalRequestCard.tsx   # Compact request card (server) — amount, status, method, date
│               ├── WithdrawalRequestsClient.tsx # List client: wallet balance display, status filter, sort, pagination
│               ├── WithdrawalRequestDetail.tsx  # Full detail view; rejection/cancellation info; PENDING-only actions
│               ├── WithdrawalRequestForm.tsx    # Reusable create/edit form; method selector hidden in edit mode
│               └── CancelWithdrawalRequestDialog.tsx # AlertDialog with optional reason textarea
│
├── providers/
│   └── AuthProvider.tsx            # Client context — holds LoggedinUser | null state
│
├── schema/                         # Zod validation schemas — one file per form
│   ├── loginValidation.ts
│   ├── registerValidation.ts
│   ├── forgotPasswordValidation.ts
│   ├── resetPasswordValidation.ts
│   ├── changePasswordValidation.ts
│   ├── completeProfileValidation.ts
│   ├── updateProfileValidation.ts
│   ├── postTaskValidation.ts
│   ├── applyTaskValidation.ts
│   ├── rejectApplicationValidation.ts
│   ├── withdrawApplicationValidation.ts
│   ├── createWithdrawalMethodValidation.ts   # BANK cross-field rule: bankName required when methodType=BANK
│   ├── updateWithdrawalMethodValidation.ts   # All fields optional; at least one required
│   ├── createWithdrawalRequestValidation.ts  # withdrawalMethodId + amount (min 10) + note?
│   ├── editWithdrawalRequestValidation.ts    # amount? + note?; at least one required
│   └── cancelWithdrawalRequestValidation.ts  # cancellationReason? (max 500)
│
├── content/
│   ├── privacy-policy.md           # Content for /privacy, rendered by <MarkdownArticle>
│   └── terms-of-service.md        # Content for /terms, rendered by <MarkdownArticle>
│
└── proxy.ts                        # Next.js middleware: token refresh + route protection
```

---

## Auth Pattern

### Cookie names

- `accessToken` — HTTP-only, path `/`, `sameSite: lax`, secure in production
- `refreshToken` — same settings

### Middleware (`src/proxy.ts`)

Runs on every request:

1. Reads `accessToken` / `refreshToken` from cookies.
2. Decodes + validates the access token via `proxy-utils.ts`.
3. If access token is missing, expired, or expiring soon **and** a refresh token exists → calls `refreshTokens()`.
4. On successful refresh, attaches new cookies to the response **and** forwards `x-refreshed-access-token` header so Server Components can read the new token before the cookie is visible.
5. **Auth routes** (`/login`, `/register`): redirects authenticated users to `/profile`.
6. **Authenticated-only routes** (`/change-password`, `/verify-email`, `/complete-profile`): redirects unauthenticated users to `/login?callbackUrl=<path>`.
7. **Protected routes** (role-based): checks role; redirects to `/unauthorized` on failure.
8. **Onboarding-gated routes** (`/post-task`, `/my-tasks`): additionally requires verified email + complete profile.

### Route protection map (`src/lib/auth/routes-utils.ts`)

```ts
// Role-protected
const protectedRoutes = {
  "/profile/*": ["USER", "ADMIN"],
  "/post-task": ["USER", "ADMIN"],
  "/my-tasks": ["USER", "ADMIN"],
  "/admin/*": ["ADMIN"],
};

// Login required, no role check
const authenticatedRoutes = [
  "/change-password",
  "/verify-email",
  "/complete-profile",
];

// Also require verified email + complete profile
const onboardingGatedRoutes = ["/post-task", "/my-tasks"];
```

Use `"/*"` suffix for prefix-matching; everything else is exact-match. To add a new protected route: edit only `routes-utils.ts`.

### Server Component auth guard

Use `requireAuth()` from `src/lib/auth/requireAuth.ts` in Server Components that need a user. Calls `getCurrentUser()` (React-cached) and redirects to `/login` if unauthenticated.

### Client-side auth state

`AuthProvider` (`src/providers/AuthProvider.tsx`) provides `user: LoggedinUser | null` via React context. Call `refreshUser()` after login/profile changes; `clearUser()` after logout; both trigger `router.refresh()`.

---

## State Management Pattern

No global client state manager (no Redux, Zustand, etc.).

- **Server state:** fetched in Server Components via `apiClient` or Server Actions; passed as props to client components.
- **Auth state:** `AuthProvider` context — updated by `refreshUser()` / `clearUser()`.
- **Form state:** TanStack React Form `useAppForm()` — local to each form component. Server errors surfaced via `ServerErrorDisplay`.
- **URL state:** filter, sort, and pagination for `/tasks` browser live in URL search params; read in Server Components and passed down.

---

## API Client

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

### Key `RequestConfig` options

```ts
{
  params?:     Record<string, string | number | boolean | undefined | null>;
  tags?:       string[];        // Next.js cache tags
  revalidate?: number | false;
  retries?:    number;          // 0 by default — retries on 5xx/429/network errors only
  skipAuth?:   boolean;         // omit Authorization header (login/register)
  cache?:      RequestCache;
}
```

### Response shapes

```ts
interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  timestamp?: string;
}

type BackendError = {
  success: false;
  message: string;
  statusCode: number;
  errorType?: string;
  errorSources?: Array<{ path: string; message: string }>;
};
```

Use `ApiError.isApiError(e)` / `ApiError.isUnauthorized(e)` for type-safe checks. **401 is terminal — never retry.**

### Server Actions

```ts
import { actionHandler } from "@/lib/api/actionHandler";

const result = await actionHandler(() =>
  apiClient.post<ApiResponse<SomeType>>("/endpoint", payload),
);
// result.success → check before using result.data
```

---

## Form System

```ts
import { useAppForm } from "@/components/form/hooks";
```

### Registered field components

| Component          | Description                          |
| ------------------ | ------------------------------------ |
| `InputWithIcon`    | Text/email input with leading icon   |
| `PasswordInput`    | Password field with show/hide toggle |
| `Checkbox`         | Checkbox (alias of `FormCheckbox`)   |
| `DateTimeField`    | Date/time picker                     |
| `NumberInputField` | Numeric input                        |
| `SelectField`      | Select dropdown                      |
| `TextAreaField`    | Textarea                             |

Wrap fields with `FormBase` for automatic label, description, and error display. Display server errors with `ServerErrorDisplay`.

---

## Domain Types (`src/lib/types.ts`)

Key enums (all `const` objects `as const`):

- `TaskPriority`: `LOW | MEDIUM | HIGH | URGENT`
- `TaskCategory`: `DELIVERY | CLEANING | REPAIR | TUTORING | GARDENING | MOVING | PET_CARE | TECH_SUPPORT | OTHER`
- `TaskStatus`: `DRAFT | OPEN | ASSIGNED | IN_PROGRESS | PENDING_REVIEW | PAYMENT_PENDING | PAYMENT_INITIATED | COMPLETED | PAYMENT_FAILED | DISPUTED | CANCELLED | EXPIRED | REFUNDED`
- `ApplicationStatus`: `PENDING | APPROVED | REJECTED | WITHDRAWN`
- `PaymentMethod`: `ONLINE | CASH`
- `PaymentStatus`: `PENDING | COMPLETED | FAILED | CANCELLED | REFUNDED`
- `CashStatus`: `PAYER_CLAIMED | PAYEE_CONFIRMED | PAYEE_DISPUTED | ADMIN_VERIFIED`
- `CommissionDueStatus`: `DUE | PAID`
- `WalletTransactionType`: `CREDIT | DEBIT`
- `WalletTransactionCategory`: `TASK_PAYMENT | DIRECT_COMMISSION_DEDUCTION | COMMISSION_PAYMENT | WITHDRAWAL | REFUND | ADJUSTMENT`
- `WalletTransactionStatus`: `PENDING | COMPLETED | FAILED | REVERSED`
- `WithdrawalStatus`: `PENDING | APPROVED | COMPLETED | REJECTED | CANCELLED`
- `WithdrawalMethodType`: `BANK | MOBILE_BANKING`

Key type notes:

- **`Task.baseCompensation` is typed as `string`** — parse before arithmetic.
- **`taskStatusConfig`** in `src/lib/taskStatusConfig.ts` maps every `TaskStatusType` to `{ label, className }` — use it instead of switch statements for status badges.

Auth types (`src/lib/types/auth/index.ts`): `LoggedinUser` (has `profileStatus`, `emailVerified`, `provider`), `RegisteredUser`, `AuthContextType`, `EmailVerificationStatus`.

---

## UI & Styling Conventions

- **Tailwind v4** — no `tailwind.config.js`; configured via PostCSS (`postcss.config.mjs`).
- **shadcn/ui** in `src/components/ui/`. Config in `components.json`. Do not edit generated files directly.
- **Color palette:** blue/emerald accents, slate base (dark sections use `bg-slate-900`).
- **Responsive:** mobile-first — `lg:` breakpoint for desktop two-column layouts.
- **Auth page layout:** `<main className="h-screen flex">` — left branding (`hidden lg:flex lg:w-1/2`) fixed at viewport height; right form (`w-full lg:w-1/2 overflow-y-auto`) scrolls internally.
- **Animations:** Framer Motion for complex sequences; `tw-animate-css` for CSS-only transitions.
- **Markdown pages:** `<MarkdownArticle>` (`src/components/ui/MarkdownArticle.tsx`) renders `.md` files from `src/content/`.
- **Images:** `images.unsplash.com` and `res.cloudinary.com` are whitelisted in `next.config.ts`. Add new hosts there if needed.

---

## Architectural Decisions

- **Auth page design system:** Login/register pages use the same warm off-white/orange tokens as the landing page. Left panel is dark (`bg-ds-ink`) with editorial ticket cards and Instrument Serif headings; right panel is `bg-ds-bg` with no Card wrapper. Submit buttons styled via CSS descendant selector override on the container `[&_button[type=submit]]:*`.
- **Frontend-only architecture:** All persistence delegated to a separate backend API at `BACKEND_URL`. This frontend never writes to a database directly.
- **HTTP-only cookie auth:** JWT tokens stored in HTTP-only cookies (not localStorage) to prevent XSS token theft. Refresh handled in Next.js middleware before requests reach Server Components.
- **`x-refreshed-access-token` header:** On token refresh, middleware forwards the new token as a response header so Server Components can use it within the same request cycle before the cookie propagates to the client.
- **Server Components by default:** `"use client"` is added only where necessary to keep data-fetching on the server and minimize bundle size.
- **`actionHandler()` wrapper:** All Server Actions wrap API calls in `actionHandler()` to normalize error handling and prevent unhandled rejections from reaching the client.
- **React cache for `getCurrentUser()`:** Deduplicated per request — multiple Server Components on the same page call it without extra network requests.
- **`const enum` forbidden:** `isolatedModules: true` in tsconfig. All enums are `const` objects `as const`.
- **Onboarding gating:** `/post-task` and `/my-tasks` require verified email + complete profile (checked in middleware via `isOnboardingGatedRoute`), in addition to role protection.
- **Landing page design system (2026-05-02):** Full redesign to warm off-white (#fafaf7) background, orange (#f97316) accent, Instrument Serif headings. Design tokens added to `globals.css` `@theme inline` block as `--color-ds-*` (prefixed to avoid conflict with shadcn's `--accent` and other variables). Navbar and Footer rewritten globally to match — warm glass navbar replaces previous dark/blue scheme. `TaskCard` in `src/components/common/TaskCard.tsx` is the single unified card (warm DS style) used across landing, browse, and related tasks sections.
- **Cloudinary for image uploads:** Task images and avatars are uploaded directly from the client via a signed Cloudinary widget. The signature is generated server-side at `src/app/api/cloudinary-signature/route.ts`.
- **URL-state for task browser:** Filters, sort, and pagination for `/tasks` are stored in URL search params — enables server-side rendering and shareable URLs without client state.
- **shadcn/ui mandatory first:** Custom UI components are only created when a shadcn component does not exist for the use case.
- **Demo-user login (2026-07-11):** `demoLoginAction` (`src/actions/auth/authAction.ts`) is a thin wrapper around `LoginAction` — it resolves credentials server-side from `env.demoUsers` (config.ts, backed by `DEMO_USER_1/2_EMAIL/PASSWORD`) and never sends them to the client; the client component only sends which demo user key was clicked. Missing/unset credentials degrade gracefully (button click returns a "not configured" error) rather than crashing the app.
- **Withdrawal module (2026-05-09):** Uses the `(tabbed)` route-group pattern (matching payments) for the Methods / Requests list views. Create/edit/detail operations use dedicated pages outside the tabbed group (no tab nav on those pages). PENDING-only guard for edit/cancel is enforced at the page level (shows an error block if status ≠ PENDING) — not just by hiding buttons. `amount` fields are typed `string` (Decimal) from the API and parsed to `number` only inside form components before validation. Delete is blocked gracefully when pending requests exist — the 400 error is caught and shown as a Sonner toast without re-opening the dialog.
