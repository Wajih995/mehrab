/**
 * Core domain types for MEHRAB.
 * These mirror the eventual Prisma models so UI can be built ahead of the DB
 * and swapped to live data without changing component contracts.
 */

export type Money = number; // whole PKR

export interface ProductImage {
  url: string;
  alt: string;
  /** Optional short looping video for the product (mp4/webm). */
  isPrimary?: boolean;
}

export interface ProductVariant {
  id: string;
  size: SizeCode;
  color: ColorOption;
  sku: string;
  stock: number;
}

export interface ColorOption {
  name: string;
  /** CSS color value for the swatch. */
  hex: string;
}

export type SizeCode = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "3XL";

/** Sentinel size for made-to-order pieces cut to the customer's numbers. */
export const CUSTOM_SIZE = "Custom";

/** The bottom garment a kameez is paired with. */
export const BOTTOM_STYLES = ["Shalwar", "Pajama"] as const;
export type BottomStyle = (typeof BOTTOM_STYLES)[number];

/** Made-to-order measurements, in inches. Keys match the size chart rows. */
export interface CustomMeasurements {
  collar: number;
  shoulder: number;
  chest: number;
  sleeveLength: number;
  length: number;
  shalwarLength: number;
}

export type FabricType =
  | "Wash & Wear"
  | "Cotton"
  | "Egyptian Cotton"
  | "Linen"
  | "Karandi"
  | "Boski"
  | "Cottonel"
  | "Premium Blended";

export type Season = "All Season" | "Summer" | "Winter" | "Festive";

export interface Product {
  id: string;
  slug: string;
  /** Manual article / style code (e.g. "MEH-KMZ-1024"), shown on the site. */
  articleNumber?: string;
  name: string;
  subtitle?: string;
  description: string;
  price: Money;
  compareAtPrice?: Money;
  images: ProductImage[];
  fabric: FabricType;
  season: Season;
  collectionSlugs: string[];
  colors: ColorOption[];
  sizes: SizeCode[];
  variants?: ProductVariant[];
  rating: number;
  reviewCount: number;
  badges?: ProductBadge[];
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  specifications?: Record<string, string>;
  careInstructions?: string[];
  /** SEO <title> override; falls back to "Name — Subtitle". */
  metaTitle?: string;
  /** SEO meta description override; falls back to the description. */
  metaDescription?: string;
  createdAt: string;
}

export type ProductBadge =
  | "New"
  | "Best Seller"
  | "Limited"
  | "Sale"
  | "Back in Stock";

export interface Collection {
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount?: number;
  season?: Season;
}

export interface Category {
  slug: string;
  name: string;
  description?: string;
}

export interface Review {
  id: string;
  author: string;
  location?: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: Money;
  /** A chart size, or CUSTOM_SIZE when `custom` is supplied. */
  size: SizeCode | typeof CUSTOM_SIZE;
  color: string;
  quantity: number;
  /** Shalwar or Pajama — the bottom the customer chose. */
  bottomStyle?: BottomStyle;
  /** Present only for made-to-order lines. */
  custom?: CustomMeasurements;
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface MegaMenuColumn {
  heading: string;
  items: NavItem[];
}

export interface MegaMenuSection {
  label: string;
  href: string;
  /** Render the item greyed-out and non-clickable (kept in the nav for later). */
  disabled?: boolean;
  columns?: MegaMenuColumn[];
  featured?: {
    title: string;
    href: string;
    image: string;
    cta: string;
  };
}
