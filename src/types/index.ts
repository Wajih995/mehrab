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
  size: SizeCode;
  color: string;
  quantity: number;
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
