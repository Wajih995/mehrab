import type { MegaMenuSection } from "@/types";

/**
 * A product category derived from the main navigation.
 *
 * Every menu leaf item that points to `/collections/<slug>` IS a category:
 * products can be assigned to it from the admin product form, and its page
 * resolves automatically (see `getCollectionView`) — so an admin can add a
 * menu item and immediately file products under it. Filter-style items
 * (`/shop?...`) are self-serving pages driven by product fields instead.
 */
export interface MenuCategory {
  label: string;
  slug: string;
}

const COLLECTION_HREF = /^\/collections\/([a-z0-9-]+)\/?$/i;

/** All categories reachable from the given nav (deduped, menu order). */
export function menuCategories(nav: MegaMenuSection[]): MenuCategory[] {
  const out: MenuCategory[] = [];
  const push = (label: string, href: string) => {
    const m = href.match(COLLECTION_HREF);
    if (!m) return;
    const slug = m[1].toLowerCase();
    if (!out.some((c) => c.slug === slug)) out.push({ label, slug });
  };
  for (const section of nav) {
    for (const col of section.columns ?? []) {
      for (const item of col.items) push(item.label, item.href);
    }
  }
  return out;
}
