import "server-only";

import { products as seed } from "@/lib/data/products";
import { loadJson, saveJson } from "@/lib/server-persist";
import type { Product } from "@/types";

/**
 * In-memory catalogue for DEMO mode (no DATABASE_URL).
 *
 * Stored on `globalThis` so every server bundle/module copy shares ONE array —
 * without this, a Server Action mutates a different instance than the one the
 * page renders from, and edits appear to vanish. Process-local; resets on
 * restart (fine for demo). In production `DATABASE_URL` is set, so this path is
 * never used — Prisma is.
 */
const globalForCatalogue = globalThis as unknown as {
  __mehrabCatalogue?: Product[];
};

function ensure(): Product[] {
  if (!globalForCatalogue.__mehrabCatalogue) {
    globalForCatalogue.__mehrabCatalogue =
      loadJson<Product[]>("catalogue") ?? seed.map((p) => ({ ...p }));
  }
  return globalForCatalogue.__mehrabCatalogue;
}

function persist(): void {
  saveJson("catalogue", ensure());
}

export function readCatalogue(): Product[] {
  return ensure();
}

export function findBySlug(slug: string): Product | null {
  return ensure().find((p) => p.slug === slug) ?? null;
}

export function findById(id: string): Product | null {
  return ensure().find((p) => p.id === id) ?? null;
}

export function addToCatalogue(product: Product): void {
  ensure().unshift(product);
  persist();
}

export function updateInCatalogue(id: string, product: Product): void {
  const c = ensure();
  const i = c.findIndex((p) => p.id === id);
  if (i >= 0) c[i] = product;
  else c.unshift(product);
  persist();
}

export function removeFromCatalogue(id: string): void {
  globalForCatalogue.__mehrabCatalogue = ensure().filter((p) => p.id !== id);
  persist();
}
