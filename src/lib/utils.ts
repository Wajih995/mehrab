import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a PKR price. Amounts are stored in whole rupees. */
export function formatPrice(
  amount: number,
  opts: { withDecimals?: boolean; currency?: string } = {}
): string {
  const { withDecimals = false, currency = "PKR" } = opts;
  const formatted = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  }).format(amount);
  // en-PK renders "PKR 1,234" — keep it clean and consistent.
  return formatted.replace("PKR", "Rs").trim();
}

/** Percentage discount between original and sale price. */
export function discountPercent(original: number, sale: number): number {
  if (original <= 0 || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}

/** URL-friendly slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Truncate to a max length on a word boundary. */
export function truncate(text: string, max = 120): string {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max)).trimEnd() + "…";
}

/** Format a date consistently (server + client safe). */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Absolute URL helper for metadata / canonical / OG. */
export function absoluteUrl(path = ""): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
