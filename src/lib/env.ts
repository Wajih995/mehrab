/**
 * Runtime capability flags.
 *
 * The app runs in two modes so it stays usable throughout development:
 *  - **DB mode** (production / Vercel): DATABASE_URL is set → Prisma-backed
 *    catalogue, orders, and (with AUTH_SECRET) real Auth.js sessions.
 *  - **Demo mode** (no DATABASE_URL): falls back to the static catalogue and
 *    client-side stores, so `pnpm dev` works with zero setup.
 */
export const isDbConfigured = Boolean(process.env.DATABASE_URL);

export const isAuthConfigured =
  Boolean(process.env.AUTH_SECRET) && isDbConfigured;
