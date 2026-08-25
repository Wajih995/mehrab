import type { MegaMenuSection, NavItem } from "@/types";
import { img } from "@/lib/data/images";

/**
 * Default primary navigation with mega-menu content.
 *
 * NOTE: this is only the SEED. The live menu is served by
 * `@/lib/repositories/navigation` (admin-editable — demo store or DB),
 * so storefront components must receive nav via props, not import this.
 */
export const mainNav: MegaMenuSection[] = [
  {
    label: "New In",
    href: "/collections/new-arrivals",
    columns: [
      {
        heading: "Latest",
        items: [{ label: "New Arrivals", href: "/collections/new-arrivals" }],
      },
      {
        heading: "Shop By Fabric",
        items: [{ label: "Wash & Wear", href: "/collections/wash-and-wear" }],
      },
    ],
    featured: {
      title: "The Winter Heritage Collection",
      href: "/collections/winter-heritage",
      image: img("navyQuarter"),
      cta: "Explore the collection",
    },
  },
  {
    label: "Shop",
    href: "/shop",
    columns: [
      {
        heading: "Collections",
        items: [{ label: "Premium", href: "/collections/premium" }],
      },
      {
        heading: "By Season",
        items: [{ label: "Summer", href: "/collections/summer" }],
      },
      {
        heading: "Price",
        items: [{ label: "Under Rs 8,000", href: "/shop?max=8000" }],
      },
    ],
  },
  {
    label: "Collections",
    href: "/collections",
    columns: [
      {
        heading: "Featured",
        items: [
          { label: "Summer Heritage", href: "/collections/summer-heritage" },
        ],
      },
    ],
    featured: {
      title: "Signature Line",
      href: "/collections/signature",
      image: img("blackDetail"),
      cta: "Discover Signature",
    },
  },
  {
    label: "Our Story",
    href: "/about",
    disabled: true,
  },
];

/** Mobile bottom-navigation destinations. */
export const mobileNav: (NavItem & { icon: string })[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Shop", href: "/shop", icon: "shirt" },
  { label: "Search", href: "/search", icon: "search" },
  { label: "Wishlist", href: "/account/wishlist", icon: "heart" },
  { label: "Account", href: "/account", icon: "user" },
];

/** Footer link groups. */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Shop",
    items: [
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Best Sellers", href: "/collections/best-sellers" },
      { label: "All Products", href: "/shop" },
      { label: "Collections", href: "/collections" },
      { label: "Gift Cards", href: "/gift-cards" },
    ],
  },
  {
    heading: "Help",
    items: [
      { label: "Track Order", href: "/track-order" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Exchange", href: "/returns" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "Our Story", href: "/about" },
      { label: "Fabrics & Craft", href: "/fabrics" },
      { label: "Store Locator", href: "/stores" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Exchange Policy", href: "/returns" },
    ],
  },
];
