/**
 * Central registry of eastern-wear imagery for MEHRAB.
 *
 * Every image here depicts men's shalwar kameez / kurta — NO western wear.
 * These are curated Unsplash placeholders; replace the `photo-…` ids below
 * with MEHRAB's own product photography when it's ready. Because every
 * component reads from this file, swapping the real shoot in later is a
 * one-file change.
 */

const UNSPLASH = "https://images.unsplash.com";

/** Base photo ids — each is a men's shalwar kameez / kurta shot. */
export const kameez = {
  /** LANDSCAPE editorial — charcoal shalwar kameez against a textured wall. Ideal for wide hero banners. */
  heroWide: "photo-1711385962104-a199043d7ad0",
  /** Black shalwar kameez, sunglasses — strong, editorial (portrait). */
  blackHero: "photo-1710624125523-3420db282dfe",
  /** White kurta, seated on a wall. */
  whiteWall: "photo-1734418038940-2e5ee6a1b478",
  /** White kurta with sunglasses. */
  whiteShades: "photo-1734418038517-ffc3a6a6751f",
  /** Crisp all-white formal kurta. */
  whiteFormal: "photo-1734418053756-aad1c16d3558",
  /** White kurta against a blue-green backdrop. */
  whiteBackdrop: "photo-1734418041662-ffd756053bb8",
  /** White kurta, relaxed stylish pose. */
  whitePose: "photo-1734418042215-a1b79c18698f",
  /** White kurta on an elevated ledge. */
  whiteLedge: "photo-1734418040900-e964f84e8abb",
  /** White kurta, elegant interior with soft accents. */
  whiteInterior: "photo-1734418051949-cfeb496fd81e",
  /** White kurta with red accents, formal shoot. */
  whiteAccent: "photo-1734418057609-7b28f889f66d",
  /** White kurta, seated at a table. */
  whiteSeated: "photo-1734418046848-6d168e211b45",
  /** White kurta, neutral earth tones. */
  whiteNeutral: "photo-1734418051356-9a8c398caaa1",
  /** Blue kurta and pants, traditional ethnic formal. */
  blueKurta: "photo-1770359993283-a2c2f386584e",
  /** Earth-tone embroidered kurta, traditional menswear. */
  earthKurta: "photo-1727835523550-18478cacefa2",
} as const;

export type KameezImageKey = keyof typeof kameez;

/** Build a sized, format-optimized Unsplash URL for a registry key. */
export function img(key: KameezImageKey, w = 900): string {
  return `${UNSPLASH}/${kameez[key]}?q=80&w=${w}&auto=format&fit=crop`;
}
