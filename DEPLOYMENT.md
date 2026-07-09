# Deploying MEHRAB to Vercel

MEHRAB runs in two modes:

- **Demo mode** — no `DATABASE_URL`. Uses the static catalogue + client-side
  stores. `pnpm dev` works with zero setup. Great for previews.
- **Production mode** — `DATABASE_URL` set. Prisma-backed catalogue and orders;
  with `AUTH_SECRET`, real Auth.js sessions and server-side route protection.

This guide sets up **production mode on Vercel** with **Neon Postgres** (also
works with Vercel Postgres, Supabase, or any Postgres).

---

## 1. Create a Postgres database (Neon)

1. Create a project at <https://neon.tech> (free tier is fine).
2. Copy two connection strings from the Neon dashboard:
   - **Pooled** (host contains `-pooler`) → `DATABASE_URL`
   - **Direct** (no `-pooler`) → `DIRECT_URL`

> Vercel Postgres works too — it's Neon under the hood. Use its
> `POSTGRES_PRISMA_URL` for `DATABASE_URL` and `POSTGRES_URL_NON_POOLING` for
> `DIRECT_URL`.

## 2. Environment variables

Copy `.env.example` → `.env` locally, and add the same keys in
**Vercel → Project → Settings → Environment Variables**:

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Pooled connection (runtime) |
| `DIRECT_URL` | Direct connection (migrations) |
| `AUTH_SECRET` | `npx auth secret` or `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | e.g. `https://mehrab.vercel.app` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Optional seed overrides |

`AUTH_URL` is auto-detected on Vercel — leave it unset.

## 3. Push the schema + seed

From your machine (with `.env` filled in):

```bash
pnpm install
pnpm db:push        # create tables (or: pnpm db:migrate:dev to create a migration)
pnpm db:seed        # admin user, collections, products, coupons
```

`db:seed` creates the admin account (`admin@mehrab.pk` / `mehrab` by default —
change via the SEED_* env vars, then re-seed).

## 4. Deploy

Push to GitHub and import the repo in Vercel, **or**:

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

The build runs `prisma generate && next build` (already configured), and
`postinstall` regenerates the client on every install — no extra Vercel config
needed.

## 5. Verify

- `/` , `/shop`, `/products/...` render from the database.
- `/admin` → redirected to `/admin/login` by middleware; sign in with the seeded
  admin (role `ADMIN`) to reach the dashboard.
- Place a test order on the storefront → it appears under **Admin → Orders** and
  persists in Postgres.

---

## Migrations workflow

- **Local schema change:** edit `prisma/schema.prisma` →
  `pnpm db:migrate:dev --name <change>` (creates + applies a migration).
- **Production:** `pnpm db:migrate` (`prisma migrate deploy`) runs pending
  migrations. Add it to your deploy pipeline if you use migrations rather than
  `db push`.

## What's wired vs. still TODO

**Wired to the database**
- Catalogue reads (home, shop, collections, product pages, sitemap) via
  `src/lib/repositories/products.ts`.
- Order placement → `placeOrder` Server Action persists `Order` + `OrderItem`.
- Auth.js (Credentials + Prisma adapter, JWT sessions, `role` claim) and
  middleware protection for `/admin` (ADMIN) and `/account`.

**Still on client stores / TODO for a later pass**
- Admin product create/edit/delete currently writes to a local store
  (`use-admin-products`). Swap for Prisma-backed Server Actions to persist
  catalogue edits to the DB.
- Order status updates in the admin (currently client store) → Server Action.
- Wishlist / recently-viewed (client) → optionally sync to `WishlistItem`.
- Card payments → create a Stripe PaymentIntent inside `placeOrder` (the
  `PaymentMethod.CARD` path and env slots are already in place).
- Inventory decrement + confirmation email on order placement (marked with
  `TODO` in `src/actions/orders.ts`).

## Security notes

- The admin login screen still uses the demo client gate **in demo mode only**.
  In production mode (`AUTH_SECRET` + `DATABASE_URL` set), `middleware.ts`
  enforces the ADMIN role server-side before any `/admin` page renders.
- Passwords are hashed with bcrypt; sessions are JWT and signed with
  `AUTH_SECRET`. Rotate `AUTH_SECRET` to invalidate all sessions.
