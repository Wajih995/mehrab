/**
 * Central site configuration — brand, navigation, contact, socials.
 * Single source of truth used by layout, SEO, footer, and nav.
 */

export const siteConfig = {
  name: "MEHRAB",
  tagline: "Elevate Tradition",
  description:
    "MEHRAB crafts premium men's Shalwar Kameez — heritage tailoring, considered fabrics, and a modern, minimal silhouette. Handmade in Pakistan.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "en_PK",
  currency: "PKR",
  contact: {
    email: "care@mehrab.pk",
    phone: "+92 300 1234567",
    whatsapp: "+92 300 1234567",
    address: "Studio 04, Fashion District, Lahore, Pakistan",
  },
  socials: {
    instagram: "https://instagram.com/mehrab",
    facebook: "https://facebook.com/mehrab",
    tiktok: "https://tiktok.com/@mehrab",
    youtube: "https://youtube.com/@mehrab",
  },
  announcements: [
    "Complimentary express shipping on orders over Rs 15,000",
    "New — The Winter Heritage Collection has arrived",
    "Free size exchange within 7 days · Cash on Delivery available",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
