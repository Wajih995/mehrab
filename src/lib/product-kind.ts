import type { Product } from "@/types";

/** Slug of the unstitched category in the main nav. */
export const UNSTITCHED_SLUG = "unstitched";

/**
 * Whether a product is sold unstitched — fabric by the suit rather than a
 * finished garment.
 *
 * Membership is by explicit collection assignment only. `getCollectionView`
 * additionally matches a category label against `fabric`/`season`, but neither
 * union contains "Unstitched", so for this category that path is unreachable.
 *
 * Kept free of `server-only` imports so the product page can branch on it.
 */
export function isUnstitched(product: Product): boolean {
  return product.collectionSlugs.includes(UNSTITCHED_SLUG);
}
