import type { Collection, Product, Review } from "../../types";
import { img } from "./images";

/**
 * Demo catalogue for MEHRAB — men's shalwar kameez only.
 * Typed to the domain model so it can be replaced by Prisma queries later
 * without touching any component. Imagery is sourced from the central
 * eastern-wear registry in `@/lib/data/images`.
 */

const NEUTRALS = [
  { name: "Charcoal", hex: "#26221f" },
  { name: "Sand", hex: "#cdbfa6" },
  { name: "Ivory", hex: "#f2ecdf" },
  { name: "Slate Blue", hex: "#4a5568" },
  { name: "Olive", hex: "#6b6b47" },
];

export const products: Product[] = [
  {
    id: "p-noor-charcoal",
    slug: "noor-signature-charcoal",
    name: "Noor Signature Kameez",
    subtitle: "Egyptian Cotton · Charcoal",
    description:
      "The Noor Signature is our defining silhouette — a clean, elongated kameez cut from long-staple Egyptian cotton with a hand-finished band collar and mother-of-pearl buttons. Tailored for a considered, modern drape that moves with you.",
    price: 12900,
    compareAtPrice: 15900,
    images: [
      { url: img("blackHero"), alt: "Noor Signature charcoal shalwar kameez, front", isPrimary: true },
      { url: img("whiteWall"), alt: "Noor Signature shalwar kameez, styled" },
      { url: img("whiteSeated"), alt: "Noor Signature shalwar kameez, collar detail" },
    ],
    fabric: "Egyptian Cotton",
    season: "All Season",
    collectionSlugs: ["signature", "premium", "new-arrivals"],
    colors: [NEUTRALS[0], NEUTRALS[2], NEUTRALS[3]],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.9,
    reviewCount: 214,
    badges: ["Best Seller", "Sale"],
    inStock: true,
    isBestSeller: true,
    isNew: true,
    specifications: {
      Fabric: "100% Egyptian Cotton, 120 GSM",
      Collar: "Hand-finished band collar",
      Fit: "Modern straight",
      Buttons: "Mother-of-pearl",
      Origin: "Handmade in Lahore, Pakistan",
    },
    careInstructions: [
      "Dry clean recommended for first wash",
      "Machine wash cold, gentle cycle",
      "Warm iron on reverse",
      "Do not bleach",
    ],
    createdAt: "2026-06-20",
  },
  {
    id: "p-heritage-sand",
    slug: "heritage-boski-sand",
    name: "Heritage Boski Suit",
    subtitle: "Pure Boski · Sand",
    description:
      "Woven from pure Boski silk-cotton, the Heritage suit carries a soft sheen and fluid fall reserved for occasion. A refined, understated statement in warm sand.",
    price: 18500,
    images: [
      { url: img("earthKurta"), alt: "Heritage Boski shalwar kameez in sand", isPrimary: true },
      { url: img("whiteNeutral"), alt: "Heritage Boski shalwar kameez fabric detail" },
    ],
    fabric: "Boski",
    season: "Festive",
    collectionSlugs: ["premium", "occasion", "winter-heritage"],
    colors: [NEUTRALS[1], NEUTRALS[2]],
    sizes: ["M", "L", "XL", "XXL"],
    rating: 4.8,
    reviewCount: 96,
    badges: ["Limited"],
    inStock: true,
    isNew: true,
    specifications: {
      Fabric: "Pure Boski (silk-cotton blend)",
      Fit: "Relaxed premium",
      Occasion: "Wedding & formal",
      Origin: "Handmade in Lahore, Pakistan",
    },
    createdAt: "2026-06-28",
  },
  {
    id: "p-everyday-ivory",
    slug: "everyday-wash-wear-ivory",
    name: "Everyday Wash & Wear",
    subtitle: "Wash & Wear · Ivory",
    description:
      "The essential you reach for daily. Crease-resistant Wash & Wear in a crisp ivory, built for effortless mornings and long days.",
    price: 6900,
    compareAtPrice: 8500,
    images: [
      { url: img("whiteFormal"), alt: "Everyday Wash & Wear shalwar kameez in ivory", isPrimary: true },
      { url: img("whiteLedge"), alt: "Everyday Wash & Wear shalwar kameez detail" },
    ],
    fabric: "Wash & Wear",
    season: "Summer",
    collectionSlugs: ["essentials", "new-arrivals"],
    colors: [NEUTRALS[2], NEUTRALS[0], NEUTRALS[4]],
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    rating: 4.7,
    reviewCount: 431,
    badges: ["Best Seller", "Sale"],
    inStock: true,
    isBestSeller: true,
    specifications: {
      Fabric: "Poly-viscose Wash & Wear",
      Fit: "Classic",
      Care: "Machine washable, minimal iron",
      Origin: "Handmade in Lahore, Pakistan",
    },
    createdAt: "2026-05-30",
  },
  {
    id: "p-karandi-slate",
    slug: "karandi-winter-slate",
    name: "Karandi Winter Kameez",
    subtitle: "Karandi · Slate Blue",
    description:
      "A textured Karandi weave with just enough weight for cooler evenings. The slate blue reads quietly sophisticated against the winter palette.",
    price: 11500,
    images: [
      { url: img("blueKurta"), alt: "Karandi Winter shalwar kameez in slate blue", isPrimary: true },
      { url: img("whiteInterior"), alt: "Karandi Winter shalwar kameez texture" },
    ],
    fabric: "Karandi",
    season: "Winter",
    collectionSlugs: ["winter-heritage", "signature"],
    colors: [NEUTRALS[3], NEUTRALS[0]],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviewCount: 158,
    badges: ["New"],
    inStock: true,
    isNew: true,
    specifications: {
      Fabric: "Karandi (textured wool-blend)",
      Fit: "Modern straight",
      Season: "Autumn / Winter",
      Origin: "Handmade in Lahore, Pakistan",
    },
    createdAt: "2026-07-01",
  },
  {
    id: "p-monochrome-black",
    slug: "monochrome-linen-charcoal",
    name: "Monochrome Linen Kameez",
    subtitle: "Pure Linen · Charcoal",
    description:
      "Breathable pure linen with a relaxed, architectural line. Part of the Monochrome edit — one colour, done exceptionally well.",
    price: 13900,
    images: [
      { url: img("blackHero"), alt: "Monochrome Linen shalwar kameez in charcoal", isPrimary: true },
      { url: img("whiteShades"), alt: "Monochrome Linen shalwar kameez detail" },
    ],
    fabric: "Linen",
    season: "Summer",
    collectionSlugs: ["monochrome", "premium", "new-arrivals"],
    colors: [NEUTRALS[0], NEUTRALS[2]],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.6,
    reviewCount: 73,
    badges: ["New"],
    inStock: true,
    isNew: true,
    createdAt: "2026-07-03",
  },
  {
    id: "p-signature-olive",
    slug: "signature-cotton-olive",
    name: "Signature Cotton Kameez",
    subtitle: "Egyptian Cotton · Olive",
    description:
      "The Signature cut in a muted olive — a quiet departure from neutrals that still lives comfortably in a considered wardrobe.",
    price: 12900,
    images: [
      { url: img("earthKurta"), alt: "Signature Cotton shalwar kameez in olive", isPrimary: true },
      { url: img("whiteNeutral"), alt: "Signature Cotton shalwar kameez detail" },
    ],
    fabric: "Egyptian Cotton",
    season: "All Season",
    collectionSlugs: ["signature", "essentials"],
    colors: [NEUTRALS[4], NEUTRALS[0]],
    sizes: ["M", "L", "XL", "XXL"],
    rating: 4.7,
    reviewCount: 121,
    inStock: true,
    createdAt: "2026-06-10",
  },
  {
    id: "p-premium-noir",
    slug: "premium-cottonel-noir",
    name: "Premium Cottonel Kameez",
    subtitle: "Cottonel · Noir",
    description:
      "A smooth, substantial Cottonel with a subtle matte finish. Tailored for those who prefer their black to be truly black.",
    price: 14500,
    compareAtPrice: 16900,
    images: [
      { url: img("blackHero"), alt: "Premium Cottonel shalwar kameez in noir", isPrimary: true },
      { url: img("whiteAccent"), alt: "Premium Cottonel shalwar kameez detail" },
    ],
    fabric: "Cottonel",
    season: "All Season",
    collectionSlugs: ["premium", "monochrome"],
    colors: [NEUTRALS[0]],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewCount: 187,
    badges: ["Best Seller", "Sale"],
    inStock: true,
    isBestSeller: true,
    createdAt: "2026-05-18",
  },
  {
    id: "p-festive-ivory",
    slug: "festive-boski-ivory",
    name: "Festive Boski Kameez",
    subtitle: "Pure Boski · Ivory",
    description:
      "An occasion piece with a gentle luminosity — ivory Boski finished with a tonal placket. Made for celebration.",
    price: 19900,
    images: [
      { url: img("whiteBackdrop"), alt: "Festive Boski shalwar kameez in ivory", isPrimary: true },
      { url: img("whitePose"), alt: "Festive Boski shalwar kameez detail" },
    ],
    fabric: "Boski",
    season: "Festive",
    collectionSlugs: ["occasion", "premium"],
    colors: [NEUTRALS[2], NEUTRALS[1]],
    sizes: ["M", "L", "XL", "XXL"],
    rating: 4.8,
    reviewCount: 64,
    badges: ["Limited"],
    inStock: false,
    createdAt: "2026-06-05",
  },
];

export const collections: Collection[] = [
  {
    slug: "signature",
    name: "Signature Line",
    description: "Our defining silhouette — refined, versatile, unmistakably MEHRAB.",
    image: img("blackHero", 1200),
    season: "All Season",
  },
  {
    slug: "premium",
    name: "Premium",
    description: "Elevated fabrics and finishing for the discerning wardrobe.",
    image: img("earthKurta", 1200),
    season: "All Season",
  },
  {
    slug: "winter-heritage",
    name: "Winter Heritage",
    description: "Textured weaves and warm tones for the cooler season.",
    image: img("blueKurta", 1200),
    season: "Winter",
  },
  {
    slug: "monochrome",
    name: "Monochrome",
    description: "One colour, done exceptionally well.",
    image: img("whiteShades", 1200),
    season: "All Season",
  },
  {
    slug: "occasion",
    name: "Wedding & Occasion",
    description: "Considered pieces for the moments that matter.",
    image: img("whiteAccent", 1200),
    season: "Festive",
  },
  {
    slug: "essentials",
    name: "Everyday Essentials",
    description: "The dependable staples your week is built on.",
    image: img("whiteFormal", 1200),
    season: "All Season",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    author: "Bilal A.",
    location: "Lahore",
    rating: 5,
    title: "Exceptional drape and finish",
    body: "The Egyptian cotton is unlike anything I've owned. Tailoring is precise and the collar holds beautifully all day.",
    date: "2026-06-30",
    verified: true,
  },
  {
    id: "r2",
    author: "Hamza R.",
    location: "Karachi",
    rating: 5,
    title: "My new default",
    body: "Ordered the Wash & Wear in ivory. Crisp, comfortable, and the fit was spot on. COD delivery in two days.",
    date: "2026-06-24",
    verified: true,
  },
  {
    id: "r3",
    author: "Usman K.",
    location: "Islamabad",
    rating: 4,
    title: "Premium feel, worth it",
    body: "The Boski suit felt genuinely luxurious. Sizing runs slightly relaxed — size down if you prefer fitted.",
    date: "2026-06-18",
    verified: true,
  },
  {
    id: "r4",
    author: "Ahmed S.",
    location: "Faisalabad",
    rating: 5,
    title: "Packaging and product both premium",
    body: "From the box to the fabric, everything felt considered. This is how eastern wear should be presented.",
    date: "2026-06-12",
    verified: true,
  },
];

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
