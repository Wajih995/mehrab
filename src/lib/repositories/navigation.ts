import "server-only";

import { prisma } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import { mainNav as defaults } from "@/lib/navigation";
import { readMainNav } from "@/lib/server-navigation";
import type { MegaMenuSection } from "@/types";

export const MAIN_NAV_KEY = "main-nav";

/**
 * The live primary navigation.
 *  - Demo mode: in-memory store seeded from `@/lib/navigation`.
 *  - DB mode: `SiteMenu` row (falls back to the seed until first save).
 */
export async function getMainNav(): Promise<MegaMenuSection[]> {
  if (!isDbConfigured) return readMainNav();
  const row = await prisma.siteMenu.findUnique({
    where: { key: MAIN_NAV_KEY },
  });
  if (!row) return defaults;
  return row.data as unknown as MegaMenuSection[];
}
