# Feature: Withdrawal Module — `/profile/withdrawal`

API source of truth: `api-contracts/api-contract-withdrawal.md`

Two sub-domains: **WithdrawalMethod** (where funds go) and **WithdrawalRequest** (the actual withdrawal transaction). Laid out as two tabs under a shared layout, mirroring the Payments feature pattern.

---

## Implementation Order

1. Types — `src/lib/types.ts`
2. Zod schemas — `src/schema/`
3. Server actions — `src/actions/withdrawal/`
4. Components — `src/components/profile/withdrawal/`
5. Pages — `src/app/(main)/profile/withdrawal/`
6. Sidebar link — `src/components/profile/ProfileSidebar.tsx`
7. AGENTS.md update

---

## Route Map

```
/profile/withdrawal                             → redirect to /profile/withdrawal/methods
/profile/withdrawal/(tabbed)/layout             → mounts <WithdrawalTabNav>
/profile/withdrawal/(tabbed)/methods            → methods list
/profile/withdrawal/(tabbed)/requests           → requests list
/profile/withdrawal/methods/new                 → create method form
/profile/withdrawal/methods/[id]                → method detail
/profile/withdrawal/methods/[id]/edit           → edit method form
/profile/withdrawal/requests/new                → create request form
/profile/withdrawal/requests/[id]               → request detail
/profile/withdrawal/requests/[id]/edit          → edit request form
```

Route protection: `/profile/*` is already mapped to `["USER", "ADMIN"]` in `src/lib/auth/routes-utils.ts`. No change needed.

---

## Step 1 — Types (`src/lib/types.ts`)

Append to the end of the file. Do not rename or move existing types.

**New enums (const objects `as const`):**

- `WithdrawalStatus` — `PENDING | APPROVED | COMPLETED | REJECTED | CANCELLED`
- `WithdrawalMethodType` — `BANK | MOBILE_BANKING`

**New sort field types:**

- `WithdrawalMethodSortField` — `"createdAt" | "updatedAt"`
- `WithdrawalRequestSortField` — `"amount" | "createdAt" | "updatedAt"`

**New interfaces:**

- `WithdrawalMethod` — mirrors the API contract shape exactly; `amount` typed `string` (Decimal)
- `WithdrawalRequest` — full shape per contract; `amount` typed `string`
- `WithdrawalRequestWithMethod` — extends `WithdrawalRequest` with nested `withdrawalMethod: WithdrawalMethod`

**New response types** (follow the same pattern as `MyWalletResponse`, `WalletTransactionsListResponse`):

- `WithdrawalMethodResponse` — single method
- `WithdrawalMethodsListResponse` — paginated list with `data` + `meta`
- `WithdrawalRequestResponse` — single request with nested method
- `WithdrawalRequestsListResponse` — paginated list with `data` + `meta`

> Reuse the existing `PaginationMeta` type for `meta` fields. Check it exists before adding.

---

## Step 2 — Zod Schemas (`src/schema/`)

One file per form. Naming: `{action}{Domain}Validation.ts`. Export both the schema (default) and the inferred `FormData` type as a named export.

### `createWithdrawalMethodValidation.ts`

Fields: `methodType` (enum), `accountNumber` (max 50), `accountName` (max 100), `bankName?` (max 100), `branchName?` (max 100), `routingNumber?` (max 50), `isDefault?` (boolean).
Cross-field rule: `bankName` is required when `methodType === "BANK"`. Use `superRefine` to attach the error to the `bankName` path.

### `updateWithdrawalMethodValidation.ts`

Same fields as create except `isDefault` is excluded (handled by the dedicated set-default endpoint). All fields optional. Add a `.refine` that at least one field is provided.

### `createWithdrawalRequestValidation.ts`

Fields: `withdrawalMethodId` (non-empty string), `amount` (positive number, min 10), `note?` (max 500).

### `editWithdrawalRequestValidation.ts`

Fields: `amount?` (positive number, min 10), `note?` (max 500). Add a `.refine` that at least one field is provided.

### `cancelWithdrawalRequestValidation.ts`

Fields: `cancellationReason?` (max 500). No required fields — reason is optional per the API.

---

## Step 3 — Server Actions (`src/actions/withdrawal/`)

All files: `"use server"` at top, one exported default function per file, all calls wrapped in `actionHandler()`. Base URL prefix: `/withdrawal`.

| File                                  | Method | Endpoint                                 |
| ------------------------------------- | ------ | ---------------------------------------- |
| `getWithdrawalMethodsAction.ts`       | GET    | `/withdrawal/my-methods`                 |
| `getWithdrawalMethodAction.ts`        | GET    | `/withdrawal/my-methods/:id`             |
| `createWithdrawalMethodAction.ts`     | POST   | `/withdrawal/my-methods`                 |
| `updateWithdrawalMethodAction.ts`     | PATCH  | `/withdrawal/my-methods/:id`             |
| `setDefaultWithdrawalMethodAction.ts` | PATCH  | `/withdrawal/my-methods/:id/set-default` |
| `deleteWithdrawalMethodAction.ts`     | DELETE | `/withdrawal/my-methods/:id`             |
| `getWithdrawalRequestsAction.ts`      | GET    | `/withdrawal/my-requests`                |
| `getWithdrawalRequestAction.ts`       | GET    | `/withdrawal/my-requests/:id`            |
| `createWithdrawalRequestAction.ts`    | POST   | `/withdrawal/my-requests`                |
| `editWithdrawalRequestAction.ts`      | PATCH  | `/withdrawal/my-requests/:id`            |
| `cancelWithdrawalRequestAction.ts`    | PATCH  | `/withdrawal/my-requests/:id/cancel`     |

**Params for list actions:**

- `getWithdrawalMethodsAction` — `page`, `limit`, `sortBy`, `sortOrder`, `methodType?`
- `getWithdrawalRequestsAction` — `page`, `limit`, `sortBy`, `sortOrder`, `status?`

All params have sensible defaults (`page=1`, `limit=10`, `sortBy="createdAt"`, `sortOrder="desc"`).

---

## Step 4 — Components (`src/components/profile/withdrawal/`)

```
withdrawal/
├── WithdrawalTabNav.tsx
├── WithdrawalStatusBadge.tsx
├── methods/
│   ├── WithdrawalMethodCard.tsx
│   ├── WithdrawalMethodsClient.tsx
│   ├── WithdrawalMethodDetail.tsx
│   ├── WithdrawalMethodForm.tsx
│   └── DeleteWithdrawalMethodDialog.tsx
└── requests/
    ├── WithdrawalRequestCard.tsx
    ├── WithdrawalRequestsClient.tsx
    ├── WithdrawalRequestDetail.tsx
    ├── WithdrawalRequestForm.tsx
    └── CancelWithdrawalRequestDialog.tsx
```

---

use confirmation dialog before delete any payment method .

### `WithdrawalTabNav.tsx` — `"use client"`

Two tab links: **Withdrawal Methods** → `/profile/withdrawal/methods`, **Withdrawal Requests** → `/profile/withdrawal/requests`. Use `usePathname` + `startsWith` to highlight the active tab. Style identically to `PaymentsTabNav` (border-b underline, blue active state).

---

### `WithdrawalStatusBadge.tsx` — Server Component

Renders a shadcn `<Badge variant="outline">` for each `WithdrawalStatusType`. Color map:

- `PENDING` → yellow
- `APPROVED` → blue
- `COMPLETED` → green
- `REJECTED` → red
- `CANCELLED` → slate/muted

---

### `methods/WithdrawalMethodCard.tsx` — Server Component

Compact card for a single method in the list. Shows:

- Method type chip (`BANK` / `MOBILE_BANKING`)
- Account name (bold) + account number (muted, partially masked if desired)
- Bank name and branch (only for BANK type; omit section entirely for MOBILE_BANKING)
- Green **Default** badge when `isDefault === true`
- Link to detail page `/profile/withdrawal/methods/[id]`

No mutation actions on the card itself — those live on the detail page.

---

### `methods/WithdrawalMethodsClient.tsx` — `"use client"`

Receives `methods`, `meta`, `currentFilters` from the page. Manages:

- **Filter bar** — method type dropdown (`All / Bank / Mobile Banking`), sort order selector
- **URL-based pagination** — use `useRouter` + `useSearchParams` to update params; mirrors the wallet transactions pattern
- **Add Method** button — navigates to `/profile/withdrawal/methods/new`
- Renders `WithdrawalMethodCard` grid; empty state when `methods.length === 0`

Empty state message: _"No withdrawal methods yet. Add a method to start withdrawing your earnings."_ with a CTA button to `/profile/withdrawal/methods/new`.

---

### `methods/WithdrawalMethodDetail.tsx` — `"use client"`

Renders the full method record. Sections:

- **Header** — method type badge, Default badge (if applicable), account name
- **Account info** — account number, bank name, branch, routing number (each field hidden if null)
- **Metadata** — created date, last updated date
- **Action bar** — three buttons:
  - **Set as Default** — visible only when `isDefault === false`; calls `setDefaultWithdrawalMethodAction` directly (no form needed), shows toast, calls `router.refresh()`
  - **Edit** — link to `/profile/withdrawal/methods/[id]/edit`
  - **Delete** — opens `DeleteWithdrawalMethodDialog`

Mark `"use client"` because of the Set Default button's async action and the delete dialog state.

---

### `methods/WithdrawalMethodForm.tsx` — `"use client"`

Reusable form used by both the create and edit pages. Accepts `defaultValues?` and `onSubmit` as props so the page controls whether it calls create or update action.

Fields (in order):

1. **Method Type** — `SelectField`: `Bank Transfer` / `Mobile Banking`. When changed, show/hide the bank-specific fields below.
2. **Account Name** — `InputWithIcon` with `User` icon
3. **Account Number** — `InputWithIcon` with `Hash` icon
4. **Bank Name** — `InputWithIcon` with `Building2` icon; rendered only when `methodType === "BANK"`; visually marked required
5. **Branch Name** — `InputWithIcon` with `MapPin` icon; optional; rendered only when `methodType === "BANK"`
6. **Routing Number** — `InputWithIcon` with `Route` icon; optional; rendered only when `methodType === "BANK"`
7. **Set as Default** — `Checkbox`; shown only on the create form (hidden on edit since set-default is a separate endpoint)

Uses `useAppForm()` with the appropriate schema (passed as a prop or selected internally based on mode). Display server errors with `ServerErrorDisplay`. Submit button label: **Add Method** / **Save Changes**.

---

### `methods/DeleteWithdrawalMethodDialog.tsx` — `"use client"`

shadcn `<AlertDialog>` triggered from the detail page. Shows the account name and number in the confirmation body. On confirm: calls `deleteWithdrawalMethodAction(id)`.

Error handling:

- `400` "Method has one or more PENDING withdrawal requests" → show Sonner error toast, keep dialog closed (do not re-open). Explain to the user they must cancel pending requests first.
- Success → Sonner success toast, then `router.push("/profile/withdrawal/methods")`.

---

### `requests/WithdrawalRequestCard.tsx` — Server Component

Compact card for a single request. Shows:

- Amount (formatted as `৳ X,XXX`) — large and prominent
- `WithdrawalStatusBadge`
- Method summary — type chip + last 4 characters of account number (e.g., `BANK ••••1234`)
- Created date
- Note preview (first 80 chars, truncated with ellipsis if longer)
- Link to detail page `/profile/withdrawal/requests/[id]`

No action buttons on the card.

---

### `requests/WithdrawalRequestsClient.tsx` — `"use client"`

Receives `requests`, `meta`, `currentFilters`, `walletBalance`, `methods` from the page. Manages:

- **Filter bar** — status filter dropdown, sort field + order selectors
- **URL-based pagination**
- **Wallet balance display** — shown near the top (`Available: ৳ X,XXX`) so users know funds before acting
- **New Withdrawal** button — navigates to `/profile/withdrawal/requests/new`; disabled with tooltip if `methods.length === 0`
- Renders `WithdrawalRequestCard` list; empty state when `requests.length === 0`

Empty state: if no methods exist → _"Add a withdrawal method before making a withdrawal request."_ with CTA to `/profile/withdrawal/methods/new`. If methods exist but no requests → _"No withdrawal requests yet."_ with CTA to `/profile/withdrawal/requests/new`.

---

### `requests/WithdrawalRequestDetail.tsx` — `"use client"`

Full request record view. Sections:

- **Header** — amount (`৳ X,XXX`, large), `WithdrawalStatusBadge`, created date
- **Method info** — type, account name, account number, bank name / branch (if BANK)
- **Request details** — note, wallet transaction ID (`refWalletTnxId`, link to `/profile/wallet/[id]` if present), processed/cancelled/rejected dates (each shown only if non-null)
- **Rejection info** — rejection reason + rejected by (shown only when `status === "REJECTED"`)
- **Cancellation info** — cancellation reason (shown only when `status === "CANCELLED"`)
- **Action bar** — visible only when `status === "PENDING"`:
  - **Edit** — link to `/profile/withdrawal/requests/[id]/edit`
  - **Cancel** — opens `CancelWithdrawalRequestDialog`

Mark `"use client"` because of the cancel dialog state.

---

### `requests/WithdrawalRequestForm.tsx` — `"use client"`

Reusable form for create and edit. Props: `defaultValues?`, `methods: WithdrawalMethod[]`, `walletBalance: string`, `onSubmit`.

Fields:

1. **Withdrawal Method** — `SelectField`; options built from `methods` (`accountName — ****XXXX` format); disabled with helper text if `methods.length === 0`; hidden on the edit form (method cannot be changed after creation)
2. **Amount** — `NumberInputField`; description text shows `Available balance: ৳ {walletBalance}`; minimum 10
3. **Note** — `TextAreaField`; optional; max 500 chars

Surface 400 "Insufficient wallet balance" error from server via `ServerErrorDisplay`.

---

### `requests/CancelWithdrawalRequestDialog.tsx` — `"use client"`

shadcn `<AlertDialog>`. Body text: _"This withdrawal request will be cancelled and ৳ {amount} will be credited back to your wallet."_

Optional textarea for cancellation reason (max 500 chars). On confirm: calls `cancelWithdrawalRequestAction(id, { cancellationReason })`. On success: Sonner toast, `router.push("/profile/withdrawal/requests")`.

---

## Step 5 — Pages

All pages are Server Components. Use `requireAuth()` at the top. Await `params` and `searchParams` before use (Next.js 15+ requirement). Error handling: inline error block pattern (matches wallet and commission-due pages).

### Root redirect

`/profile/withdrawal/page.tsx` — `redirect("/profile/withdrawal/methods")`

### `(tabbed)/layout.tsx`

Mounts `<WithdrawalTabNav>` above `{children}`.

### `(tabbed)/methods/page.tsx`

Fetches `getWithdrawalMethodsAction({ page, limit, sortBy, sortOrder, methodType })`. Passes data + current filters to `WithdrawalMethodsClient`.

### `(tabbed)/methods/loading.tsx`

Skeleton — 3–4 card-shaped placeholders using shadcn `<Skeleton>`.

### `(tabbed)/requests/page.tsx`

Fetches three things in parallel via `Promise.all`:

1. `getWithdrawalRequestsAction(...)` — the paginated list
2. `getWithdrawalMethodsAction({ limit: 100 })` — all active methods for the "New Withdrawal" button's disabled state check
3. `getMyWalletAction()` — wallet balance to display

Passes all results to `WithdrawalRequestsClient`. Degrade gracefully if wallet fetch fails (pass `"0"` for balance, show a muted warning).

### `(tabbed)/requests/loading.tsx`

Skeleton list placeholders.

### `methods/new/page.tsx`

Heading: _"Add Withdrawal Method"_. Renders `WithdrawalMethodForm` (create mode). On success: redirect to `/profile/withdrawal/methods`.

### `methods/[id]/page.tsx`

Fetches `getWithdrawalMethodAction(id)`. Handles `403` / `404` with an inline error block. Renders `WithdrawalMethodDetail`.

### `methods/[id]/loading.tsx`

Skeleton detail card.

### `methods/[id]/edit/page.tsx`

Fetches `getWithdrawalMethodAction(id)` to pre-populate. Renders `WithdrawalMethodForm` (edit mode, `defaultValues` set). On success: redirect to `/profile/withdrawal/methods/[id]`.

### `requests/new/page.tsx`

Fetches in parallel: `getWithdrawalMethodsAction({ limit: 100 })` + `getMyWalletAction()`. Renders `WithdrawalRequestForm` (create mode). If no active methods, show an info banner instead of the form with a link to add a method. On success: redirect to `/profile/withdrawal/requests`.

### `requests/[id]/page.tsx`

Fetches `getWithdrawalRequestAction(id)`. Handles `403` / `404`. Renders `WithdrawalRequestDetail`.

### `requests/[id]/loading.tsx`

Skeleton detail card.

### `requests/[id]/edit/page.tsx`

Fetches `getWithdrawalRequestAction(id)`. If `status !== "PENDING"`, show an error block: _"This request can no longer be edited."_ with a back link. Otherwise renders `WithdrawalRequestForm` (edit mode, method selector hidden). On success: redirect to `/profile/withdrawal/requests/[id]`.

---

## Step 6 — Sidebar Link

In `src/components/profile/ProfileSidebar.tsx`, add an entry after the Wallet item:

- **Label:** `Withdrawal`
- **Icon:** `ArrowDownToLine` from lucide-react
- **href:** `/profile/withdrawal`

---

## Step 7 — AGENTS.md Updates

Add a `2026-MM-DD` entry to **Recent Changes**.

Extend the directory map under:

- `src/app/(main)/profile/` — add the full `withdrawal/` subtree
- `src/actions/` — add `withdrawal/` with all 11 action files
- `src/components/profile/` — add `withdrawal/` subtree
- `src/schema/` — add the 5 new validation files

Add to **Architectural Decisions:**

> Withdrawal module uses the (tabbed) route-group pattern (matching payments). Create/edit operations use dedicated form pages rather than dialogs. PENDING-only guard for edit/cancel is enforced in both UI (page-level check redirects or shows error block) and server (API returns 400).

---

## UX Checklist

- [ ] Amount always displayed as `৳ X,XXX` — parse the Decimal string, never do arithmetic on it raw
- [ ] Method type shown as a readable label (`Bank Transfer` / `Mobile Banking`), not the raw enum value
- [ ] `WithdrawalStatusBadge` used consistently on every card, detail, and heading area
- [ ] PENDING guard enforced at the page level for edit pages (not just hidden buttons)
- [ ] Set Default button hidden when already default; shown only on detail page (not list card)
- [ ] Delete blocked gracefully when pending requests exist — error toast, not a broken state
- [ ] Wallet balance visible on both the requests list and the request create/edit form
- [ ] New Withdrawal button disabled (with explanation) when user has no active methods
- [ ] `refWalletTnxId` on request detail links to the wallet transaction detail page when present
- [ ] Empty states on both list pages are actionable (CTA buttons, not just text)
- [ ] Loading skeletons on every list and detail page
- [ ] Mobile-first layout: cards stack vertically, action bars stack on small screens
- [ ] After Set Default on detail page: `router.refresh()` keeps the user on the same page with updated data
- [ ] Sonner toasts for every success and every server error that isn't surfaced inline
