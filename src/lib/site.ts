/**
 * Central site configuration — brand, navigation, contact, socials.
 * Single source of truth used by layout, SEO, footer, and nav.
 */

export const siteConfig = {
  name: "MEHRAB",
  tagline: "Elevate Tradition",
  description:
    "MEHRAB crafts premium men's Shalwar Kameez — heritage tailoring, considered fabrics, and a modern, minimal silhouette. Handmade in Pakistan.",
  // Customer-facing links (emails, WhatsApp, bills) always carry the real
  // domain — a localhost link must never reach a customer, even from a dev
  // machine. NEXT_PUBLIC_SITE_URL still overrides (e.g. a staging domain).
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mehrabessentials.com",
  locale: "en_PK",
  currency: "PKR",
  contact: {
    email: "mehrabessentials@gmail.com",
    phone: "+92 303 6347222",
    whatsapp: "+92 303 6347222",
    address: "Business Enclave, Dha phase 2, Ittehad Commercial, Karachi, Pakistan",
  },
  socials: {
    instagram: "https://instagram.com/mehrabessentials",
    facebook: "https://facebook.com/mehrabessentials",
    // tiktok: "https://tiktok.com/@mehrab",
    // youtube: "https://youtube.com/@mehrab",
  },
  announcements: [
    "Nationwide delivery from Karachi — Cash on Delivery available",
    "New — The Premium Heritage Collection has arrived",
    "Free size exchange within 7 days · Cash on Delivery available (all tags should be remain on article)",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
