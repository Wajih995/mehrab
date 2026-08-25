import "server-only";

import { mainNav as seed } from "@/lib/navigation";
import { loadJson, saveJson } from "@/lib/server-persist";
import type { MegaMenuSection } from "@/types";

/**
 * In-memory main-nav store for DEMO mode (no DATABASE_URL).
 *
 * Mirrors `server-catalogue.ts`: kept on `globalThis` so every server
 * bundle/module copy shares ONE array, otherwise a Server Action would
 * mutate a different instance than the one layouts render from.
 * Process-local; resets to the seed on restart (fine for demo). With
 * DATABASE_URL set this path is never used — Prisma is.
 */
const globalForNav = globalThis as unknown as {
  __mehrabMainNav?: MegaMenuSection[];
};

function ensure(): MegaMenuSection[] {
  if (!globalForNav.__mehrabMainNav) {
    globalForNav.__mehrabMainNav =
      loadJson<MegaMenuSection[]>("main-nav") ?? structuredClone(seed);
  }
  return globalForNav.__mehrabMainNav;
}

export function readMainNav(): MegaMenuSection[] {
  return ensure();
}

export function writeMainNav(sections: MegaMenuSection[]): void {
  globalForNav.__mehrabMainNav = structuredClone(sections);
  saveJson("main-nav", globalForNav.__mehrabMainNav);
}
