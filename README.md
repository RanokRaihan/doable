# Doable

A full-featured task marketplace where people post tasks they need done and workers apply to complete them. The platform handles the full lifecycle — task posting, applications, worker assignment, completion, and payment (cash or online gateway).

---

## Features

- Browse and search tasks by category, priority, and keyword
- Post tasks with images, location, schedule, and compensation
- Apply to tasks with a custom message and proposed rate
- Task lifecycle management: assign, start, complete, review, dispute
- Payment flow: online gateway and cash with confirmation
- Wallet with full transaction history
- Commission tracking and payment to the platform
- User profiles with avatar upload and onboarding flow
- Role-based access control (USER / ADMIN)
- JWT auth with silent token refresh via Next.js middleware

---

## Tech Stack

| Category     | Tool                 | Version             |
| ------------ | -------------------- | ------------------- |
| Framework    | Next.js (App Router) | `^16.2.0-canary.37` |
| Language     | TypeScript (strict)  | `^5`                |
| UI Library   | React                | `19.2.3`            |
| Styling      | Tailwind CSS v4      | `^4`                |
| Components   | shadcn/ui (Radix UI) | `radix-ui ^1.4.3`   |
| Icons        | Lucide React         | `^0.563.0`          |
| Forms        | TanStack React Form  | `^1.28.2`           |
| Validation   | Zod                  | `^4.3.6`            |
| Animations   | Framer Motion        | `^12.31.0`          |
| Toasts       | Sonner               | `^2.0.7`            |
| Image Upload | Cloudinary           | —                   |
| HTTP Client  | Custom fetch wrapper | —                   |

---

## Project Structure

```
doable/
├── public/                         # Static assets
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── (auth)/                 # Login, register, forgot/reset password, unauthorized
│   │   ├── (main)/                 # All main pages with shared Navbar + Footer
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── tasks/              # Task browser + detail
│   │   │   ├── post-task/          # Post a new task
│   │   │   ├── users/[id]/         # Public user profile
│   │   │   └── profile/            # Authenticated user area
│   │   │       ├── tasks/          # My posted tasks + edit + applications
│   │   │       ├── applications/   # My worker applications
│   │   │       ├── payments/       # Payment history (tabbed: made / received)
│   │   │       ├── wallet/         # Wallet balance + transactions
│   │   │       └── commission-due/ # Platform commission management
│   │   └── api/
│   │       └── cloudinary-signature/ # Signs Cloudinary upload requests
│   ├── actions/                    # Server Actions ("use server")
│   │   ├── auth/                   # Login, register, logout
│   │   ├── task/                   # Post, edit, delete, apply, lifecycle
│   │   ├── application/            # Approve, reject, withdraw
│   │   ├── payment/                # Init cash/online, confirm, decline
│   │   ├── wallet/                 # Wallet + commission queries
│   │   └── user/                   # Profile update, avatar, public profile
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitives
│   │   ├── form/                   # Shared form fields (useAppForm hook)
│   │   ├── layout/                 # Navbar, Footer, NavigationProgress
│   │   ├── common/                 # TaskCard (shared across views)
│   │   ├── tasks/                  # Browse + detail components
│   │   ├── profile/                # All profile-area components
│   │   ├── landing/                # Landing page sections
│   │   └── [feature]/              # Auth page components by feature
│   ├── lib/
│   │   ├── api/                    # Fetch client, actionHandler, error types
│   │   ├── auth/                   # getCurrentUser, requireAuth, route utils
│   │   ├── form/                   # Form error helpers
│   │   ├── types/                  # Auth types
│   │   ├── config.ts               # Environment variables (server-only)
│   │   ├── types.ts                # All domain types and enums
│   │   ├── taskStatusConfig.ts     # Status badge label/className map
│   │   └── utils.ts                # cn() utility
│   ├── providers/
│   │   └── AuthProvider.tsx        # Global auth context
│   ├── schema/                     # Zod validation schemas (one per form)
│   ├── content/                    # Markdown for /privacy and /terms
│   └── proxy.ts                    # Next.js middleware: auth + token refresh
├── AGENTS.md                       # Full codebase reference for AI agents
├── api-contract.md                 # Backend API contract and shared types
├── CLAUDE.md                       # Coding conventions and constraints
├── components.json                 # shadcn/ui config
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the [Doable backend API](https://github.com/)

### Installation

```bash
git clone https://github.com/your-username/doable.git
cd doable
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Required
BACKEND_URL=http://localhost:4000

# Optional
NEXT_PUBLIC_BACKEND_URL=
ACCESS_TOKEN_MAX_AGE=900
REFRESH_TOKEN_MAX_AGE=604800

# Cloudinary (required for image upload features)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Running

```bash
npm run dev      # Development server → http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

> There is no test framework in this project.

---

## Authentication

Auth uses JWT access + refresh tokens stored in HTTP-only cookies. The Next.js middleware (`src/proxy.ts`) silently refreshes the access token before it expires, so users stay logged in without re-authenticating. A 401 from the backend means the session has truly expired.

Route protection is role-based (`USER` / `ADMIN`) and configured in `src/lib/auth/routes-utils.ts`. Some routes additionally require a verified email and a completed profile (onboarding gating).

---

## API

This is a frontend-only application. All data is fetched from an external backend API at `BACKEND_URL`. The full API contract — endpoint paths, request/response shapes, shared enums, and cookie behavior — is documented in [`api-contract.md`](./api-contract.md).

---
