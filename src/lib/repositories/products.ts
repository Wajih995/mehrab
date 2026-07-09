import "server-only";

import { prisma } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import * as demo from "@/lib/data/products";
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
      filter: (p) => !!p.isNew,
    },
    "best-sellers": {
      title: "Best Sellers",
      description: "The pieces our customers return for, again and again.",
      filter: (p) => !!p.isBestSeller,
    },
    "back-in-stock": {
      title: "Back in Stock",
      description: "Sought-after pieces, returned to the rail.",
      filter: (p) => p.inStock,
    },
    "weekly-drop": {
      title: "This Week's Drop",
      description: "A tightly curated edit, refreshed each week.",
      filter: (p) => !!p.isNew,
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
  if (!col) return null;
  return {
    slug,
    title: col.name,
    description: col.description,
    image: col.image,
    products: all.filter((p) => p.collectionSlugs.includes(slug)),
  };
}

export const allCollectionSlugs = demo.allCollectionSlugs;

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
