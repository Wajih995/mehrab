import type { Product } from "@/types";

/** Raw Next.js searchParams shape. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

export const PAGE_SIZE = 9;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Alphabetical" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface ParsedFilters {
  q: string;
  fabric: string[];
  color: string[];
  size: string[];
  season: string[];
  collection: string[];
  min?: number;
  max?: number;
  inStockOnly: boolean;
  sort: SortValue;
  view: "grid" | "list";
  page: number;
}

const asString = (v: string | string[] | undefined): string =>
  Array.isArray(v) ? (v[0] ?? "") : (v ?? "");

/** Split a comma-joined multi-value param into a clean array. */
const asList = (v: string | string[] | undefined): string[] => {
  const raw = Array.isArray(v) ? v.join(",") : (v ?? "");
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const toNumber = (v: string | string[] | undefined): number | undefined => {
  const n = Number(asString(v));
  return Number.isFinite(n) && asString(v) !== "" ? n : undefined;
};

/** Parse URL search params into a typed, defaulted filter object. */
export function parseFilters(sp: RawSearchParams): ParsedFilters {
  const sort = asString(sp.sort) as SortValue;
  const view = asString(sp.view) === "list" ? "list" : "grid";
  const page = Math.max(1, toNumber(sp.page) ?? 1);
  return {
    q: asString(sp.q),
    fabric: asList(sp.fabric),
    color: asList(sp.color),
    size: asList(sp.size),
    season: asList(sp.season),
    collection: asList(sp.collection),
    min: toNumber(sp.min),
    max: toNumber(sp.max),
    inStockOnly: asString(sp.availability) === "in-stock",
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : "featured",
    view,
    page,
  };
}

/** Facets (available filter options) derived from the catalogue. */
export function buildFacets(
  products: Product[],
  collections: { slug: string; name: string }[]
) {
  const fabrics = new Set<string>();
  const colors = new Map<string, string>();
  const sizes = new Set<string>();
  const seasons = new Set<string>();
  let min = Infinity;
  let max = 0;

  for (const p of products) {
    fabrics.add(p.fabric);
    seasons.add(p.season);
    p.colors.forEach((c) => colors.set(c.name, c.hex));
    p.sizes.forEach((s) => sizes.add(s));
    min = Math.min(min, p.price);
    max = Math.max(max, p.price);
  }

  const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

  return {
    fabrics: [...fabrics].sort(),
    colors: [...colors.entries()].map(([name, hex]) => ({ name, hex })),
    sizes: [...sizes].sort(
      (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
    ),
    seasons: [...seasons].sort(),
    collections: collections.map((c) => ({ slug: c.slug, name: c.name })),
    priceRange: (products.length
      ? [Math.floor(min), Math.ceil(max)]
      : [0, 0]) as [number, number],
  };
}

export type Facets = ReturnType<typeof buildFacets>;

/** Apply filters + sort, then paginate. Pure, server-safe. */
export function filterProducts(products: Product[], f: ParsedFilters) {
  let items = products.slice();

  if (f.q) {
    const q = f.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (f.fabric.length)
    items = items.filter((p) => f.fabric.includes(p.fabric));
  if (f.season.length)
    items = items.filter((p) => f.season.includes(p.season));
  if (f.collection.length)
    items = items.filter((p) =>
      p.collectionSlugs.some((c) => f.collection.includes(c))
    );
  if (f.color.length)
    items = items.filter((p) =>
      p.colors.some((c) => f.color.includes(c.name))
    );
  if (f.size.length)
    items = items.filter((p) => p.sizes.some((s) => f.size.includes(s)));
  if (typeof f.min === "number")
    items = items.filter((p) => p.price >= f.min!);
  if (typeof f.max === "number")
    items = items.filter((p) => p.price <= f.max!);
  if (f.inStockOnly) items = items.filter((p) => p.inStock);

  switch (f.sort) {
    case "price-asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "rating":
      items.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      items.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // "featured" — best sellers first, then newest
      items.sort(
        (a, b) =>
          Number(!!b.isBestSeller) - Number(!!a.isBestSeller) ||
          b.createdAt.localeCompare(a.createdAt)
      );
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(f.page, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const paged = items.slice(start, start + PAGE_SIZE);

  return { items: paged, total, page, totalPages };
}

/** Count of active filters (for the mobile "Filters (n)" badge). */
export function countActiveFilters(f: ParsedFilters): number {
  return (
    f.fabric.length +
    f.color.length +
    f.size.length +
    f.season.length +
    f.collection.length +
    (typeof f.min === "number" ? 1 : 0) +
    (typeof f.max === "number" ? 1 : 0) +
    (f.inStockOnly ? 1 : 0) +
    (f.q ? 1 : 0)
  );
}
