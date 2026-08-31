import type { Review } from "@/types";

/**
 * Review domain shared by server and client. A product's rating is always
 * DERIVED from approved reviews — never a stored number, so a product with
 * no reviews cannot claim five stars.
 */

/** A review plus the moderation/ownership fields the admin needs. */
export interface ReviewRecord extends Review {
  productId: string;
  productName?: string;
  approved: boolean;
}

export interface RatingSummary {
  /** Mean of approved review ratings; 0 when there are none. */
  average: number;
  count: number;
  /** Counts per star, index 0 = 5★ … index 4 = 1★. */
  distribution: { star: number; count: number; pct: number }[];
}

export function summarise(reviews: { rating: number }[]): RatingSummary {
  const count = reviews.length;
  const average =
    count === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / count;
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const n = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, count: n, pct: count ? (n / count) * 100 : 0 };
  });
  return { average, count, distribution };
}

export const EMPTY_RATING: RatingSummary = summarise([]);
