/**
 * Central registry of MEHRAB imagery.
 *
 * Every image is MEHRAB's own product photography, served from
 * `/public/brand`. Because every component reads from this file, swapping
 * in new shoots stays a one-file change.
 */

const CONTENT = "/brand/web-images-content";

/** Product shots — studio mannequin photography, portrait (4:5). */
export const kameez = {
  /** Black kameez — embroidered placket, chest detail. */
  blackDetail: `${CONTENT}/Black-1.png`,
  /** Black kameez — three-quarter crop. */
  blackQuarter: `${CONTENT}/Black-2.png`,
  /** Dark green suit — full length. */
  greenFull: `${CONTENT}/Green-1.png`,
  /** Dark green kameez — three-quarter crop. */
  greenQuarter: `${CONTENT}/Green-3.png`,
  /** White suit — full length. */
  whiteFull: `${CONTENT}/White-1.png`,
  /** White kameez — three-quarter angle crop. */
  whiteQuarter: `${CONTENT}/White-5.png`,
  /** White kameez — embroidered placket, chest detail. */
  whiteDetail: `${CONTENT}/White-8.png`,
  /** Navy suit — full length. */
  navyFull: `${CONTENT}/blue-1.png`,
  /** Navy kameez — three-quarter crop. */
  navyQuarter: `${CONTENT}/blue-3.png`,
  /** Grey kameez — pearl buttons, chest detail. */
  greyDetail: `${CONTENT}/grey-2.png`,
} as const;

export type KameezImageKey = keyof typeof kameez;

/** Resolve a registry key to its image URL. */
export function img(key: KameezImageKey): string {
  return kameez[key];
}

/**
 * Brand assets — MEHRAB's own artwork, served from `/public`.
 */
export const brand = {
  /** ULTRA-WIDE (~2.4:1) brand banner — logo lockup, atelier rail, folded fabrics. */
  heroBanner: "/brand/main-banner.jpeg",
} as const;
