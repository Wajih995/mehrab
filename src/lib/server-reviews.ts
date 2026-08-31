import "server-only";

import { loadJson, saveJson } from "@/lib/server-persist";
import type { ReviewRecord } from "@/lib/reviews-shared";

/**
 * Review store for DEMO mode (no DATABASE_URL). Mirrors server-orders.ts:
 * shared on `globalThis`, persisted to `.data/reviews.json`.
 */
const globalForReviews = globalThis as unknown as {
  __mehrabReviews?: ReviewRecord[];
};

function ensure(): ReviewRecord[] {
  if (!globalForReviews.__mehrabReviews) {
    globalForReviews.__mehrabReviews =
      loadJson<ReviewRecord[]>("reviews") ?? [];
  }
  return globalForReviews.__mehrabReviews;
}

function persist(): void {
  saveJson("reviews", ensure());
}

export function readReviews(): ReviewRecord[] {
  return ensure();
}

export function addReview(review: ReviewRecord): void {
  ensure().unshift(review);
  persist();
}

export function setReviewApproved(id: string, approved: boolean): boolean {
  const r = ensure().find((x) => x.id === id);
  if (!r) return false;
  r.approved = approved;
  persist();
  return true;
}

export function removeReview(id: string): boolean {
  const before = ensure().length;
  globalForReviews.__mehrabReviews = ensure().filter((x) => x.id !== id);
  const removed = globalForReviews.__mehrabReviews.length < before;
  if (removed) persist();
  return removed;
}
