# BestTech ERP Core

A warehouse/inventory-oriented ERP web application. **Phase 1** delivers the
project skeleton, authentication, full user CRUD with role-based access, and a
dashboard shell — the foundation the inventory, CRM, and logistics modules
described in the long-term product vision will be built on top of later.

See [docs/DECISIONS.md](docs/DECISIONS.md) for why this repo departs from the
original Node/MySQL/Namecheap brief in a few places (Postgres instead of
MySQL, roles matching the client's requirements doc, deployment deferred).

## Tech stack

- **Backend:** Node 20+, Express, TypeScript, Prisma ORM, PostgreSQL
- **Auth:** JWT in an httpOnly cookie
- **Frontend:** React 18, TypeScript, Vite, React Router, Axios
- **Tests:** Jest + Supertest (backend)

## Prerequisites

- Node.js 18+ and npm
- A local PostgreSQL instance (any recent Postgres 13+ works)

## Local setup

```bash
git clone <this-repo-url>
cd BestTech-ERP-Core
```

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env: set DATABASE_URL to your local Postgres connection string,
# and set JWT_SECRET to any long random string.
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

The API listens on `http://localhost:4000` by default (`PORT` in `.env`).

### 2. Frontend

In a second terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The app opens on `http://localhost:5173` and talks to the API via `VITE_API_URL`.

## Seeded admin login

The seed script creates one admin account and prints these credentials to the
console when it finishes:

```
Email:    admin@besttech.com
Password: Admin@123
```

It also seeds 5 sample **staff** users and 5 sample **client** users
(password: `Password@123`) so the users table has search/filter/pagination to
show off. See [docs/DECISIONS.md](docs/DECISIONS.md) for why the roles are
`super_admin` / `admin` / `staff` / `client` rather than the generic
`admin`/`manager`/`operator`/`viewer` set in the original brief.

## Available scripts

**server/**

| Script | Purpose |
| --- | --- |
| `npm run dev` | Run the API with hot reload (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled API (`dist/server.js`) |
| `npm test` | Run the Jest test suite |
| `npm run prisma:migrate` | Create/apply a dev migration |
| `npm run prisma:seed` | Seed roles, permissions, and sample users |
| `npm run prisma:studio` | Open Prisma Studio |

**client/**

| Script | Purpose |
| --- | --- |
| `npm run dev` | Run the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |

## Project structure

```
BestTech-ERP-Core/
├── server/
│   ├── app.js                # Plain-JS entry point (see docs/DECISIONS.md)
│   ├── prisma/
│   │   ├── schema.prisma     # Users/roles/permissions + future-module tables
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/           # env, Prisma client
│   │   ├── constants/        # role names
│   │   ├── controllers/
│   │   ├── middleware/       # auth, RBAC, rate limiting, error handling
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/       # zod schemas
│   │   ├── app.ts            # Express app factory
│   │   └── server.ts         # dev/prod bootstrap
│   └── tests/
├── client/
│   └── src/
│       ├── api/              # centralized Axios client + per-resource calls
│       ├── components/
│       │   ├── layout/       # AppShell, Sidebar, Topbar
│       │   └── ui/           # Button, Modal, FormField, DataTable, ...
│       ├── context/          # AuthContext
│       ├── pages/
│       │   └── users/        # list, create, edit, detail
│       └── types/
├── docs/
│   └── DECISIONS.md
├── API.md
└── DEPLOYMENT.md
```

## Phase 1 vs. roadmap

**Built in Phase 1:**
- Login/logout, session handling via JWT cookie, protected routes
- Full user CRUD (search, role/status filters, sort, pagination, soft delete)
- Role-based access control (`super_admin`, `admin` manage users; `staff` has
  dashboard-only access; `client` is a future portal role, not yet wired to
  any login surface)
- Dashboard shell with real user counts and placeholder module cards
- Own-profile editing and password change

**Explicitly out of scope for now** (nav items are visible but marked "Coming
soon"; database tables already exist for some of these so the schema doesn't
need a rewrite later):
- Barcode scanning
- Inventory / products / warehouses (schema exists, no UI/business logic)
- CRM, logistics/shipments, invoicing/accounts (from the client's requirements
  doc — no schema or UI yet, see docs/DECISIONS.md)
- Reports, analytics, exports
- Email sending, file uploads
- The public marketing website (besttcherpcore.netlify.app) — this repo is
  the internal application only
