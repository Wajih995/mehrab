import "server-only";

import { prisma } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import * as demo from "@/lib/data/products";
import { getMainNav } from "@/lib/repositories/navigation";
import { menuCategories } from "@/lib/menu-categories";
import { kameez } from "@/lib/data/images";
import {
  readCatalogue,
  findBySlug as catalogueFindBySlug,
  findById as catalogueFindById,
} from "@/lib/server-catalogue";
import type {
  Collection,
  ColorOption,
  Product,
  ProductBadge,
  ProductImage,
  Review,
  SizeCode,
} from "@/types";

/* ── Prisma → domain mappers ───────────────────────────────── */

type DbProduct = Awaited<ReturnType<typeof queryProducts>>[number];

function queryProducts() {
  return prisma.product.findMany({
    include: {
      images: { orderBy: { position: "asc" } },
      collections: { select: { slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

function mapProduct(p: DbProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    articleNumber: p.articleNumber ?? undefined,
    name: p.name,
    subtitle: p.subtitle ?? undefined,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? undefined,
    images: p.images.map(
      (img): ProductImage => ({
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary,
      })
    ),
    fabric: p.fabric as Product["fabric"],
    season: p.season as Product["season"],
    collectionSlugs: p.collections.map((c) => c.slug),
    colors: (p.colors as unknown as ColorOption[]) ?? [],
    sizes: p.sizes as SizeCode[],
    rating: p.rating,
    reviewCount: p.reviewCount,
    badges: p.badges as ProductBadge[],
    inStock: p.inStock,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    specifications:
      (p.specifications as unknown as Record<string, string>) ?? undefined,
    careInstructions: p.careInstructions,
    metaTitle: p.metaTitle ?? undefined,
    metaDescription: p.metaDescription ?? undefined,
    createdAt:
      p.createdAt instanceof Date
        ? p.createdAt.toISOString().slice(0, 10)
        : String(p.createdAt),
  };
}

/* ── Public read API (used by server components) ───────────── */

export async function getProducts(): Promise<Product[]> {
  if (!isDbConfigured) return readCatalogue();
  return (await queryProducts()).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isDbConfigured) return catalogueFindBySlug(slug);
  const p = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      collections: { select: { slug: true } },
    },
  });
  return p ? mapProduct(p) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isDbConfigured) return catalogueFindById(id);
  const p = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      collections: { select: { slug: true } },
    },
  });
  return p ? mapProduct(p) : null;
}

export async function getCollections(): Promise<Collection[]> {
  if (!isDbConfigured) return demo.collections;
  const rows = await prisma.collection.findMany({ orderBy: { name: "asc" } });
  return rows.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    image: c.image,
    season: (c.season as Collection["season"]) ?? undefined,
  }));
}

export async function getNewArrivals(): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.isNew)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getBestSellers(): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.isBestSeller);
}

export async function getRelated(slug: string, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const base = all.find((p) => p.slug === slug);
  if (!base) return all.slice(0, limit);
  return all
    .filter(
      (p) =>
        p.slug !== slug &&
        p.collectionSlugs.some((c) => base.collectionSlugs.includes(c))
    )
    .slice(0, limit);
}

export interface CollectionView {
  slug: string;
  title: string;
  description: string;
  image?: string;
  products: Product[];
}

/** Resolve a collection slug (real collections + curated special slugs). */
export async function getCollectionView(
  slug: string
): Promise<CollectionView | null> {
  const all = await getProducts();

  const special: Record<string, Omit<CollectionView, "slug" | "products"> & { filter: (p: Product) => boolean }> = {
    "new-arrivals": {
      title: "New Arrivals",
      description: "The latest additions to the MEHRAB line, fresh from the atelier.",
      filter: (p) => !!p.isNew || p.collectionSlugs.includes("new-arrivals"),
    },
    "best-sellers": {
      title: "Best Sellers",
      description: "The pieces our customers return for, again and again.",
      filter: (p) => !!p.isBestSeller || p.collectionSlugs.includes("best-sellers"),
    },
    "back-in-stock": {
      title: "Back in Stock",
      description: "Sought-after pieces, returned to the rail.",
      filter: (p) => p.inStock || p.collectionSlugs.includes("back-in-stock"),
    },
    "weekly-drop": {
      title: "This Week's Drop",
      description: "A tightly curated edit, refreshed each week.",
      filter: (p) => !!p.isNew || p.collectionSlugs.includes("weekly-drop"),
    },
  };

  if (special[slug]) {
    const s = special[slug];
    return {
      slug,
      title: s.title,
      description: s.description,
      products: all.filter(s.filter),
    };
  }

  const collections = await getCollections();
  const col = collections.find((c) => c.slug === slug);
  if (col) {
    return {
      slug,
      title: col.name,
      description: col.description,
      image: col.image,
      products: all.filter((p) => p.collectionSlugs.includes(slug)),
    };
  }

  // Menu-derived virtual category: any nav item pointing at /collections/<slug>
  // resolves to a page, so admin-created menu items work with zero extra setup.
  // Products match by explicit assignment, or by fabric/season equal to the
  // menu label (so e.g. "Wash & Wear" is populated out of the box).
  const cat = menuCategories(await getMainNav()).find((c) => c.slug === slug);
  if (!cat) return null;
  return {
    slug,
    title: cat.label,
    description: `${cat.label} — from the MEHRAB line.`,
    products: all.filter(
      (p) =>
        p.collectionSlugs.includes(slug) ||
        p.fabric === cat.label ||
        p.season === cat.label
    ),
  };
}

export const allCollectionSlugs = demo.allCollectionSlugs;

/** A menu category resolved against the live catalogue — for browse UIs. */
export interface MenuCategoryView {
  slug: string;
  label: string;
  href: string;
  image: string;
  count: number;
}

/** Placeholder imagery for categories that have no products yet. */
const CATEGORY_FALLBACKS = [
  kameez.blackQuarter,
  kameez.greyDetail,
  kameez.navyFull,
  kameez.whiteQuarter,
  kameez.greenFull,
  kameez.whiteDetail,
];

/**
 * Every category in the live main nav, with its product count and a cover
 * image. This is what homepage/collections browse sections should render, so
 * they always mirror the admin-managed menu.
 *
 * Categories overlap — one kameez can sit in New Arrivals, Wash & Wear and
 * Premium at once — so taking each category's first product image showed the
 * same photo on several cards. Cover images are therefore claimed card by
 * card: each takes the first image no earlier card has used, preferring a
 * different garment over a second shot of one already shown.
 *
 * The choice is deterministic rather than random so a card keeps the same
 * cover between renders and requests; a per-request random pick would change
 * the page on every load and could still repeat.
 */
export async function getMenuCategoryViews(): Promise<MenuCategoryView[]> {
  const nav = await getMainNav();
  const cats = menuCategories(nav);
  const views = await Promise.all(cats.map((c) => getCollectionView(c.slug)));

  const claimed = new Set<string>();

  return cats.map((c, i) => {
    const view = views[i];
    const products = view?.products ?? [];

    // One shot per garment first, then the spare shots of each.
    const candidates = [
      ...products.map((p) => p.images[0]?.url),
      ...products.flatMap((p) => p.images.slice(1).map((img) => img.url)),
    ].filter((url): url is string => Boolean(url));

    const image =
      candidates.find((url) => !claimed.has(url)) ??
      candidates[0] ??
      (view?.image || CATEGORY_FALLBACKS[i % CATEGORY_FALLBACKS.length]);

    claimed.add(image);

    return {
      slug: c.slug,
      label: c.label,
      href: `/collections/${c.slug}`,
      image,
      count: products.length,
    };
  });
}

export async function getProductReviews(
  productId: string,
  limit = 4
): Promise<Review[]> {
  if (!isDbConfigured) return demo.reviews.slice(0, limit);
  const rows = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  if (rows.length === 0) return demo.reviews.slice(0, limit);
  return rows.map((r) => ({
    id: r.id,
    author: r.author,
    location: r.location ?? undefined,
    rating: r.rating,
    title: r.title,
    body: r.body,
    date: r.createdAt.toISOString().slice(0, 10),
    verified: r.verified,
  }));
}
