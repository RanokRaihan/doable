# Doable — v1.0

A full-featured task marketplace where people post tasks they need done and workers apply to complete them. The platform handles the full lifecycle — task posting, applications, worker assignment, completion, and payment (cash or online gateway).

---

## Features

- Browse and search tasks by category, priority, and keyword
- Post tasks with images, location, schedule, and compensation
- Apply to tasks with a custom message and proposed rate
- Task lifecycle management: assign, start, complete, review, dispute
- Payment flow: online gateway and cash with confirmation
- Wallet with full transaction history
- Withdrawal methods (bank / mobile banking) and withdrawal requests
- Commission tracking and payment to the platform
- User profiles with avatar upload and onboarding flow
- Role-based access control (`USER` / `ADMIN`)
- JWT auth with silent token refresh via Next.js middleware
- Email verification and onboarding gating for task posting
- Public user profiles and review system

---

## Tech Stack

| Category       | Tool                       | Version               |
| -------------- | -------------------------- | --------------------- |
| Framework      | Next.js 16 canary (App Router) | `^16.2.0-canary.37` |
| Language       | TypeScript (strict)        | `^5`                  |
| UI Library     | React                      | `19.2.3`              |
| Styling        | Tailwind CSS v4            | `^4`                  |
| Components     | shadcn/ui (Radix UI)       | `radix-ui ^1.4.3`     |
| Icons          | Lucide React               | `^0.563.0`            |
| Forms          | TanStack React Form        | `^1.28.2`             |
| Validation     | Zod                        | `^4.3.6`              |
| Animations     | Framer Motion              | `^12.31.0`            |
| Toasts         | Sonner                     | `^2.0.7`              |
| Date Picker    | react-datepicker           | `^9.1.0`              |
| Image Crop     | react-easy-crop            | `^5.5.7`              |
| Image Upload   | Cloudinary (signed widget) | —                     |
| Markdown       | react-markdown + remark-gfm | `^10.1.0` / `^4.0.1` |
| Themes         | next-themes                | `^0.4.6`              |
| HTTP Client    | Custom fetch wrapper       | —                     |

---

## Project Structure

```
doable/
├── public/                         # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout — AuthProvider + Toaster
│   │   ├── globals.css             # Tailwind v4 base + design tokens
│   │   ├── not-found.tsx           # 404 page
│   │   ├── api/
│   │   │   ├── cloudinary-signature/route.ts   # Signs Cloudinary upload params
│   │   │   └── auth/sign-out/route.ts          # Clears auth cookies, redirects to /login
│   │   ├── (auth)/                 # Login, register, forgot/reset password, unauthorized
│   │   └── (main)/                 # All main pages — shared Navbar + Footer
│   │       ├── page.tsx            # Landing page
│   │       ├── about/
│   │       ├── how-it-works/
│   │       ├── privacy/
│   │       ├── terms/
│   │       ├── complete-profile/
│   │       ├── verify-email/
│   │       ├── post-task/          # Onboarding-gated task posting
│   │       ├── tasks/              # Task browser + detail
│   │       ├── users/[id]/         # Public user profile
│   │       └── profile/            # Authenticated user area (USER | ADMIN)
│   │           ├── tasks/          # My posted tasks + edit + applications
│   │           ├── applications/   # My worker applications
│   │           ├── payments/       # Payment history + gateway result pages
│   │           ├── wallet/         # Wallet balance + transactions
│   │           ├── commission-due/ # Platform commission management
│   │           └── withdrawal/     # Withdrawal methods + requests (tabbed)
│   ├── actions/                    # Server Actions ("use server", one file per action)
│   │   ├── auth/                   # Login, register, logout
│   │   ├── task/                   # Post, edit, delete, apply, lifecycle transitions
│   │   ├── application/            # Approve, reject, withdraw
│   │   ├── payment/                # Init cash/online, confirm, decline, history
│   │   ├── wallet/                 # Wallet, transactions, commission
│   │   ├── user/                   # Profile update, avatar, public profile
│   │   └── withdrawal/             # Methods (CRUD + set-default) + requests (CRUD + cancel)
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitives
│   │   ├── form/                   # Shared form fields + useAppForm hook
│   │   ├── layout/                 # Navbar, Footer, NavigationProgress
│   │   ├── common/                 # TaskCard (unified, used across landing/browse/related)
│   │   ├── landing/                # Hero, HowItWorks, RecentTasks, Categories, Testimonials, FAQ, CTA
│   │   ├── tasks/                  # Browse filters, search, pagination, task detail subcomponents
│   │   └── profile/                # Profile sidebar + all profile-area components
│   ├── lib/
│   │   ├── api/                    # Fetch client, actionHandler, ApiError, types
│   │   ├── auth/                   # getCurrentUser, requireAuth, route utils, proxy utils
│   │   ├── form/                   # Form error helpers
│   │   ├── types/                  # Auth types (LoggedinUser, AuthContextType, …)
│   │   ├── config.ts               # Environment variables — SERVER-ONLY
│   │   ├── types.ts                # All domain types and enums
│   │   ├── taskStatusConfig.ts     # Status badge label/className map
│   │   └── utils.ts                # cn() utility
│   ├── providers/
│   │   └── AuthProvider.tsx        # Global auth context (client)
│   ├── schema/                     # Zod validation schemas (one per form)
│   ├── content/                    # Markdown for /privacy and /terms
│   └── proxy.ts                    # Next.js middleware: token refresh + route protection
├── api-contracts/                  # Backend API contract (source of truth for endpoints + shapes)
│   ├── index.md
│   ├── shared.md
│   ├── api-contract-auth.md
│   ├── api-contract-task.md
│   └── …
├── AGENTS.md                       # Full codebase reference for AI agents
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
- A running instance of the Doable backend API

### Installation

```bash
git clone https://github.com/RanokRaihan/doable-frontend.git
cd doable-frontend
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Required
BACKEND_URL=http://localhost:4000

# Optional
NEXT_PUBLIC_BACKEND_URL=
ACCESS_TOKEN_MAX_AGE=900       # seconds (default: 15 min)
REFRESH_TOKEN_MAX_AGE=604800   # seconds (default: 7 days)

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

Auth uses JWT access + refresh tokens stored in HTTP-only cookies. The Next.js middleware (`src/proxy.ts`) silently refreshes the access token before it expires — users stay logged in without re-authenticating. A 401 response from the backend means the session has truly expired; the frontend never retries on 401.

Route protection is role-based (`USER` / `ADMIN`) and configured in `src/lib/auth/routes-utils.ts`. Some routes additionally require a verified email and a completed profile (onboarding gating) — currently `/post-task` and `/my-tasks`.

---

## API

This is a frontend-only application. All data is fetched from an external backend API at `BACKEND_URL`. The full API contract — endpoint paths, request/response shapes, shared enums, cookie behavior, and Decimal type gotchas — is documented in the [`api-contracts/`](./api-contracts/) directory. Start with [`api-contracts/index.md`](./api-contracts/index.md) for an overview.

---

## Design System

The UI uses a warm off-white / orange design system:

- **Background:** `#fafaf7` (`--color-ds-bg`)
- **Accent:** `#f97316` orange (`--color-ds-accent`)
- **Ink:** dark slate for editorial sections (`--color-ds-ink`)
- **Headings:** Instrument Serif
- **Components:** shadcn/ui first; custom components only when no shadcn equivalent exists

---
