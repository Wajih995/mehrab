import type { MegaMenuSection, NavItem } from "@/types";
import { img } from "@/lib/data/images";

/** Primary navigation with mega-menu content. */
export const mainNav: MegaMenuSection[] = [
  {
    label: "New In",
    href: "/collections/new-arrivals",
    columns: [
      {
        heading: "Latest",
        items: [
          { label: "New Arrivals", href: "/collections/new-arrivals" },
          { label: "This Week's Drop", href: "/collections/weekly-drop" },
          { label: "Back in Stock", href: "/collections/back-in-stock" },
        ],
      },
      {
        heading: "Shop By Fabric",
        items: [
          { label: "Wash & Wear", href: "/shop?fabric=Wash+%26+Wear" },
          { label: "Egyptian Cotton", href: "/shop?fabric=Egyptian+Cotton" },
          { label: "Boski", href: "/shop?fabric=Boski" },
          { label: "Karandi", href: "/shop?fabric=Karandi" },
        ],
      },
    ],
    featured: {
      title: "The Winter Heritage Collection",
      href: "/collections/winter-heritage",
      image: img("blueKurta", 800),
      cta: "Explore the collection",
    },
  },
  {
    label: "Shop",
    href: "/shop",
    columns: [
      {
        heading: "Collections",
        items: [
          { label: "Signature Line", href: "/collections/signature" },
          { label: "Premium", href: "/collections/premium" },
          { label: "Everyday Essentials", href: "/collections/essentials" },
          { label: "Festive", href: "/collections/festive" },
        ],
      },
      {
        heading: "By Season",
        items: [
          { label: "Summer", href: "/shop?season=Summer" },
          { label: "Winter", href: "/shop?season=Winter" },
          { label: "All Season", href: "/shop?season=All+Season" },
        ],
      },
      {
        heading: "Price",
        items: [
          { label: "Under Rs 8,000", href: "/shop?max=8000" },
          { label: "Rs 8,000 – 15,000", href: "/shop?min=8000&max=15000" },
          { label: "Premium — Rs 15,000+", href: "/shop?min=15000" },
        ],
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
          { label: "Winter Heritage", href: "/collections/winter-heritage" },
          { label: "The Noor Edit", href: "/collections/noor" },
          { label: "Monochrome", href: "/collections/monochrome" },
          { label: "Wedding & Occasion", href: "/collections/occasion" },
        ],
      },
    ],
    featured: {
      title: "Signature Line",
      href: "/collections/signature",
      image: img("blackHero", 800),
      cta: "Discover Signature",
    },
  },
  {
    label: "Fabrics",
    href: "/fabrics",
  },
  {
    label: "Our Story",
    href: "/about",
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
