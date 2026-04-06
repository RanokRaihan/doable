# API Contract — Get It Done

This file is the single source of truth for everything that crosses the frontend ↔ backend boundary.
When working in the **frontend repo**, attach this file for full API context.
When working in the **backend repo**, attach this file to verify responses match what the frontend expects.

---

## Base URL

```
Backend base URL → configured via BACKEND_URL (server-only) in src/lib/config.ts
All endpoints are prefixed with /api/v1
```

---

## Authentication

### Token delivery

| Token        | Delivered via           | Lifetime |
| ------------ | ----------------------- | -------- |
| accessToken  | Response **body**       | 15 min   |
| refreshToken | `Set-Cookie` (httpOnly) | 7 days   |

- Cookie name: `refreshToken`, `httpOnly`, `sameSite: lax`, secure in production.
- The frontend middleware (`src/proxy.ts`) reads the `accessToken` cookie it manages itself. The raw access token arrives in the login response body and must be stored as a cookie by the frontend.
- All protected requests must send: `Authorization: Bearer <accessToken>`

### Token refresh

The frontend middleware auto-refreshes before a request if the access token is missing, expired, or expiring soon.

```
POST /api/v1/auth/refresh-token
Cookie: refreshToken=<token>

→ 200: new accessToken in body
→ 401: session truly expired, redirect to login
```

After a successful refresh the middleware sets `x-refreshed-access-token` as a header so Server Components can read the new token before the cookie is visible.

**401 is always terminal on the frontend.** Never retry on 401 — the middleware has already attempted refresh.

### JWT payload shape (decoded by frontend middleware)

```ts
interface IJwtPayload {
  userId: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "MODERATOR";
  profileStatus: "INCOMPLETE" | "COMPLETE" | "SUSPENDED";
}
```

---

## Standard Response Shapes

### Success

```ts
interface ApiResponse<T> {
  success: true;
  message: string;
  statusCode: number;
  data: T;
  timestamp?: string;
}
```

### Error

```ts
interface BackendError {
  success: false;
  message: string;
  statusCode: number;
  errorType?: string;
  errorSources?: Array<{
    path: string;
    message: string;
  }>;
}
```

### Paginated response (wraps ApiResponse.data)

```ts
interface PaginatedResponse<T> {
  result: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## Shared Enums

These values are identical on both sides. Do not redefine them — import from `src/lib/types.ts` on the frontend.

```ts
// Roles
type UserRole = "USER" | "ADMIN" | "MODERATOR";

// Profile status
type UserProfileStatus = "INCOMPLETE" | "COMPLETE" | "SUSPENDED";

// Task
type TaskStatus =
  | "DRAFT"
  | "OPEN"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "PENDING_REVIEW"
  | "PAYMENT_PROCESSING"
  | "COMPLETED"
  | "PAYMENT_FAILED"
  | "DISPUTED"
  | "CANCELLED"
  | "EXPIRED"
  | "REFUNDED";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type TaskCategory =
  | "DELIVERY"
  | "CLEANING"
  | "REPAIR"
  | "TUTORING"
  | "GARDENING"
  | "MOVING"
  | "PET_CARE"
  | "TECH_SUPPORT"
  | "OTHER";

// Application
type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "WITHDRAWN";

// Payment
type PaymentMethod = "CASH" | "ONLINE";

// Auth provider
type Provider = "GOOGLE" | "CREDENTIALS";
```

> **`Task.baseCompensation` is typed as `string`** on the frontend. Do not do arithmetic on it without parsing first.

### Task status flow

```
DRAFT → OPEN → ASSIGNED → IN_PROGRESS → PENDING_REVIEW → PAYMENT_PROCESSING → COMPLETED
                                                       ↘ (revision) → IN_PROGRESS
                                                                              ↘ PAYMENT_FAILED
```

---

## Query Parameters (Paginated Endpoints)

All list endpoints accept these standard query params:

| Param      | Type   | Description                             |
| ---------- | ------ | --------------------------------------- |
| page       | number | Page number (default: 1)                |
| limit      | number | Items per page                          |
| sortBy     | string | Field to sort by                        |
| sortOrder  | string | `asc` or `desc`                         |
| searchTerm | string | Full-text search across relevant fields |

Additional filter fields vary per endpoint (e.g., `status`, `category`, `priority` for tasks).

On the frontend, these map to `FilterState`:

```ts
type FilterState = {
  categories: TaskCategory[];
  priorities: TaskPriority[];
  search: string;
  sortField: "createdAt" | "updatedAt" | "title";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
};
```

---

## Endpoints

### Auth — `/api/v1/auth`

| Method | Path                       | Auth | Description                 |
| ------ | -------------------------- | ---- | --------------------------- |
| POST   | `/login`                   | —    | Login                       |
| POST   | `/logout`                  | —    | Clears refresh token cookie |
| POST   | `/refresh-token`           | —    | Issues new access token     |
| GET    | `/current-user`            | JWT  | Get authenticated user      |
| GET    | `/loggedin-user`           | JWT  | Alias for current-user      |
| POST   | `/update-password`         | JWT  | Change password             |
| POST   | `/forgot-password`         | —    | Send password reset email   |
| POST   | `/reset-password`          | —    | Reset password with token   |
| POST   | `/send-verification-email` | —    | Send email verification     |
| POST   | `/verify-email`            | —    | Verify email with token     |

#### POST `/login` — request body

```ts
{
  email: string;
  password: string;
}
```

#### POST `/login` — success response `data`

```ts
{
  accessToken: string; // store this as the accessToken cookie on the frontend
  user: LoggedinUser;
}
```

#### POST `/refresh-token` — success response `data`

```ts
{
  accessToken: string;
}
```

#### GET `/current-user` — success response `data`

```ts
LoggedinUser; // see Shared Types below
```

---

### User — `/api/v1/user`

| Method | Path                    | Auth | Roles | Description              |
| ------ | ----------------------- | ---- | ----- | ------------------------ |
| POST   | `/register/credentials` | —    | —     | Register with email/pass |
| GET    | `/my-profile`           | JWT  | USER  | Get own profile          |
| PATCH  | `/complete-profile`     | JWT  | USER  | Complete user profile    |
| GET    | `/:id`                  | —    | —     | Get user by ID           |
| PATCH  | `/update/:id`           | JWT  | USER  | Update user info         |
| PATCH  | `/update-avatar`        | JWT  | USER  | Update profile avatar    |
| DELETE | `/delete-account`       | JWT  | USER  | Soft-delete own account  |

#### POST `/register/credentials` — request body

```ts
{
  name: string; // min 2 chars
  email: string;
  password: string; // min 8 chars
}
```

---

### Task — `/api/v1/task`

| Method | Path                      | Auth | Roles | Description                    |
| ------ | ------------------------- | ---- | ----- | ------------------------------ |
| POST   | `/post-task`              | JWT  | USER  | Create a new task              |
| PATCH  | `/update-task/:id`        | JWT  | USER  | Update task details            |
| DELETE | `/delete-task/:id`        | JWT  | USER  | Soft-delete a task             |
| GET    | `/`                       | —    | —     | Get all tasks (with filtering) |
| GET    | `/:id`                    | —    | —     | Get task by ID                 |
| PATCH  | `/mark-in-progress/:id`   | JWT  | USER  | Mark task as in-progress       |
| PATCH  | `/mark-completed/:id`     | JWT  | USER  | Tasker marks task completed    |
| PATCH  | `/approve-completion/:id` | JWT  | USER  | Poster approves completion     |
| PATCH  | `/request-revision/:id`   | JWT  | USER  | Poster requests revision       |

> **`GET /api/v1/task/`** is what replaces the `MOCK_TASKS` in `src/app/(main)/tasks/page.tsx`.
> The response `data` is `PaginatedResponse<Task>`.

---

### Application — `/api/v1/application`

| Method | Path                       | Auth | Roles | Description                   |
| ------ | -------------------------- | ---- | ----- | ----------------------------- |
| POST   | `/:taskId`                 | JWT  | USER  | Submit application for a task |
| GET    | `/my-applications`         | JWT  | USER  | Get own applications          |
| GET    | `/task/:taskId`            | JWT  | USER  | Get all applications for task |
| GET    | `/:applicationId`          | JWT  | USER  | Get application by ID         |
| PATCH  | `/approve/:applicationId`  | JWT  | USER  | Approve an application        |
| PATCH  | `/reject/:applicationId`   | JWT  | USER  | Reject an application         |
| PATCH  | `/withdraw/:applicationId` | JWT  | USER  | Withdraw own application      |

---

### Payment — `/api/v1/payment`

| Method | Path                       | Auth | Description                           |
| ------ | -------------------------- | ---- | ------------------------------------- |
| POST   | `/cash/init/:taskId`       | JWT  | Initiate cash payment                 |
| PATCH  | `/cash/confirm/:paymentId` | JWT  | Confirm cash payment received         |
| PATCH  | `/cash/decline/:paymentId` | JWT  | Decline cash payment                  |
| POST   | `/online/init/:taskId`     | JWT  | Initiate online payment (SSLCommerz)  |
| POST   | `/online/ipn-validate/`    | —    | SSLCommerz IPN webhook (backend only) |
| GET    | `/user/payment-made`       | JWT  | Get payments made by user             |
| GET    | `/user/payment-received`   | JWT  | Get payments received by user         |
| GET    | `/:id`                     | JWT  | Get payment by ID                     |

#### POST `/online/init/:taskId` — success response `data`

```ts
{
  paymentUrl: string; // redirect user to this SSLCommerz URL
}
```

---

### Wallet — `/api/v1/wallet`

| Method | Path                         | Auth | Description                 |
| ------ | ---------------------------- | ---- | --------------------------- |
| GET    | `/my-wallet`                 | JWT  | Get wallet balance          |
| GET    | `/wallet-transactions`       | JWT  | Get all wallet transactions |
| GET    | `/wallet-transaction/:tnxId` | JWT  | Get transaction by ID       |
| GET    | `/commission-due`            | JWT  | Get pending commission dues |
| GET    | `/commission-due/:dueId`     | JWT  | Get commission due by ID    |
| PATCH  | `/commission-due/pay/:dueId` | JWT  | Pay a commission due        |

---

## Shared Types

These are the key interface shapes the frontend receives. Map them to/from `src/lib/types.ts`.

```ts
// User returned from /current-user, /login, /my-profile
interface LoggedinUser {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  profileStatus: UserProfileStatus;
}

// Task (public list view — GET /task/)
interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  baseCompensation: string; // ← string, not number
  location?: string;
  images?: { url: string }[];
  createdAt: string; // ISO 8601
  updatedAt: string;
}

// TaskDetails (single task view — GET /task/:id)
interface TaskDetails extends Task {
  postedBy: TaskPoster;
  agreedCompensation?: string; // set once an application is approved
  approvedApplicationId?: string;
}

interface TaskPoster {
  id: string;
  name: string;
  email: string;
}
```

---

## Route Protection Map

This is what drives `src/lib/auth/routes-utils.ts` on the frontend. Keep in sync with backend `authorize([])` middleware usage.

```ts
const protectedRoutes = {
  "/profile": ["USER", "ADMIN"],
  "/post-task": ["USER", "ADMIN"],
  "/my-tasks": ["USER", "ADMIN"],
  "/admin/*": ["ADMIN"],
  "/change-password": [], // authenticated only, no role restriction
};
```

---

## Known Mismatches & Gotchas

| #   | Issue                            | Detail                                                                                                                                                                                                                                                          |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **TaskStatus mismatch**          | Backend has `DRAFT`, `ASSIGNED`, `PAYMENT_FAILED`, `DISPUTED`, `EXPIRED`, `REFUNDED` — the frontend `types.ts` currently only defines `OPEN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `PAYMENT_PROCESSING`. **Update frontend `TaskStatus` to match backend.** |
| 2   | **accessToken delivery**         | Backend sends `accessToken` in the response **body**, not a cookie. The frontend middleware is responsible for setting it as a cookie.                                                                                                                          |
| 3   | **baseCompensation is a string** | Never do math on it without `parseFloat()` or `Number()`.                                                                                                                                                                                                       |
| 4   | **Soft deletes**                 | `User` and `Task` records are never truly deleted — they have `isDeleted: true`. The frontend can treat a successful delete response as permanent removal from UI state.                                                                                        |
| 5   | **Tasks page is WIP**            | `src/app/(main)/tasks/page.tsx` uses `MOCK_TASKS`. Replace with `apiClient.get<ApiResponse<PaginatedResponse<Task>>>("/task", { params: filterState })`.                                                                                                        |
| 6   | **CORS**                         | Backend is currently hardcoded to `http://localhost:3000`. This matches the Next.js dev default. No action needed for local dev.                                                                                                                                |
| 7   | **IPN webhook**                  | `POST /payment/online/ipn-validate/` is called by SSLCommerz directly, not by the frontend. Do not call it from the frontend.                                                                                                                                   |
