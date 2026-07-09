# MEHRAB — Premium Men's Shalwar Kameez

A production-ready, luxury e-commerce experience for a Pakistani men's eastern-wear
brand, built with the modern Next.js App Router stack.

> **Elevate Tradition** — heritage tailoring, considered fabrics, a modern silhouette.

## Tech stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS** + **shadcn/ui** + **Framer Motion** + **Lucide**
- **PostgreSQL** + **Prisma** (Neon / Vercel Postgres)
- **Auth.js v5** (Credentials + role-based access)
- **Zustand** · **React Hook Form** · **Zod** · **Server Actions**

## Features

- **Storefront** — editorial homepage, product listing with URL-based filters /
  sort / pagination, rich product pages (gallery + zoom, reviews, related,
  recently viewed), slide-out cart, coupons, guest checkout (COD), order
  confirmation.
- **Admin** (`/admin`) — dashboard, product management (create/edit/delete via
  Server Actions), order management with status updates. Role-gated.
- **SEO** — dynamic metadata, Open Graph, JSON-LD (Product + Breadcrumb),
  sitemap, robots.
- **Two-mode data layer** — runs with zero setup in **demo mode** (no database)
  and switches to **Postgres** when `DATABASE_URL` is set.

## Getting started

```bash
pnpm install
pnpm dev            # runs in demo mode with no database
```

Open <http://localhost:3000>. Admin console at `/admin`
(demo login: `admin@mehrab.pk` / `mehrab`).

## Production / database

Set `DATABASE_URL` (+ `DIRECT_URL`, `AUTH_SECRET`) and run:

```bash
pnpm db:push        # create tables
pnpm db:seed        # admin user + catalogue
pnpm build && pnpm start
```

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full Vercel + Neon Postgres guide.

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | `prisma generate` + production build |
| `pnpm db:push` / `db:migrate` | Sync / migrate the schema |
| `pnpm db:seed` | Seed admin user, collections, products, coupons |
| `pnpm typecheck` / `pnpm lint` | Type-check / lint |

---

Handmade in Pakistan. 🇵🇰
