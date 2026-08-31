import "server-only";

import { prisma } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import { readReviews } from "@/lib/server-reviews";
import { summarise, type RatingSummary, type ReviewRecord } from "@/lib/reviews-shared";
import type { Review } from "@/types";

function toReview(r: ReviewRecord): Review {
  return {
    id: r.id,
    author: r.author,
    location: r.location,
    rating: r.rating,
    title: r.title,
    body: r.body,
    date: r.date,
    verified: r.verified,
  };
}

/** Approved reviews for a product, newest first. */
export async function getApprovedReviews(
  productId: string
): Promise<Review[]> {
  if (!isDbConfigured) {
    return readReviews()
      .filter((r) => r.productId === productId && r.approved)
      .map(toReview);
  }
  const rows = await prisma.review.findMany({
    where: { productId, approved: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    author: r.author,
    location: r.location ?? undefined,
    rating: r.rating,
    title: r.title,
    body: r.body,
    date: r.createdAt.toISOString(),
    verified: r.verified,
  }));
}

/** Rating derived from approved reviews. Zero when there are none. */
export async function getRatingSummary(
  productId: string
): Promise<RatingSummary> {
  const reviews = await getApprovedReviews(productId);
  return summarise(reviews);
}

/** Every review including pending ones — for admin moderation. */
export async function getAllReviews(): Promise<ReviewRecord[]> {
  if (!isDbConfigured) return readReviews();
  const rows = await prisma.review.findMany({
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    productId: r.productId,
    productName: r.product?.name,
    author: r.author,
    location: r.location ?? undefined,
    rating: r.rating,
    title: r.title,
    body: r.body,
    date: r.createdAt.toISOString(),
    verified: r.verified,
    approved: r.approved,
  }));
}
