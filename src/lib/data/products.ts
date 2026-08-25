import type { Collection, Product, Review } from "../../types";
import { img } from "./images";

/**
 * Demo catalogue for MEHRAB — men's shalwar kameez only.
 * Typed to the domain model so it can be replaced by Prisma queries later
 * without touching any component. Imagery is sourced from the central
 * eastern-wear registry in `@/lib/data/images`.
 */

/**
 * The catalogue starts EMPTY — add products from the admin panel
 * (/admin/products). This array is only a fallback seed for demo mode
 * and for `pnpm db:seed`.
 */
export const products: Product[] = [];

export const collections: Collection[] = [
  {
    slug: "signature",
    name: "Signature Line",
    description: "Our defining silhouette — refined, versatile, unmistakably MEHRAB.",
    image: img("blackQuarter"),
    season: "All Season",
  },
  {
    slug: "premium",
    name: "Premium",
    description: "Elevated fabrics and finishing for the discerning wardrobe.",
    image: img("greyDetail"),
    season: "All Season",
  },
  {
    slug: "winter-heritage",
    name: "Winter Heritage",
    description: "Textured weaves and warm tones for the cooler season.",
    image: img("navyFull"),
    season: "Winter",
  },
  {
    slug: "monochrome",
    name: "Monochrome",
    description: "One colour, done exceptionally well.",
    image: img("whiteQuarter"),
    season: "All Season",
  },
  {
    slug: "occasion",
    name: "Wedding & Occasion",
    description: "Considered pieces for the moments that matter.",
    image: img("whiteDetail"),
    season: "Festive",
  },
  {
    slug: "essentials",
    name: "Everyday Essentials",
    description: "The dependable staples your week is built on.",
    image: img("whiteFull"),
    season: "All Season",
  },
];

export const reviews: Review[] = [];

/* ── Selectors (swap for DB queries later) ─────────────────── */

export const getAllProducts = () => products;

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getProductsByCollection = (slug: string) =>
  products.filter((p) => p.collectionSlugs.includes(slug));

export const getNewArrivals = () =>
  [...products].filter((p) => p.isNew).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const getBestSellers = () => products.filter((p) => p.isBestSeller);

export const getFeatured = (limit = 4) => products.slice(0, limit);

export const getRelated = (slug: string, limit = 4) => {
  const base = getProductBySlug(slug);
  if (!base) return products.slice(0, limit);
  return products
    .filter((p) => p.slug !== slug && p.collectionSlugs.some((c) => base.collectionSlugs.includes(c)))
    .slice(0, limit);
};

export interface CollectionView {
  slug: string;
  title: string;
  description: string;
  image?: string;
  products: Product[];
}

/** Resolve a collection slug — real collections plus curated "special" slugs. */
export function getCollectionView(slug: string): CollectionView | null {
  const special: Record<string, Omit<CollectionView, "slug">> = {
    "new-arrivals": {
      title: "New Arrivals",
      description: "The latest additions to the MEHRAB line, fresh from the atelier.",
      products: getNewArrivals(),
    },
    "best-sellers": {
      title: "Best Sellers",
      description: "The pieces our customers return for, again and again.",
      products: getBestSellers(),
    },
    "back-in-stock": {
      title: "Back in Stock",
      description: "Sought-after pieces, returned to the rail.",
      products: products.filter((p) => p.inStock),
    },
    "weekly-drop": {
      title: "This Week's Drop",
      description: "A tightly curated edit, refreshed each week.",
      products: getNewArrivals(),
    },
  };

  if (special[slug]) return { slug, ...special[slug] };

  const col = collections.find((c) => c.slug === slug);
  if (col)
    return {
      slug,
      title: col.name,
      description: col.description,
      image: col.image,
      products: getProductsByCollection(slug),
    };

  return null;
}

/** All resolvable collection slugs (for static generation). */
export const allCollectionSlugs = [
  ...collections.map((c) => c.slug),
  "new-arrivals",
  "best-sellers",
  "back-in-stock",
  "weekly-drop",
];
