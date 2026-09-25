"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import { getProductById } from "@/lib/repositories/products";
import {
  addReview,
  readReviews,
  removeReview,
  setReviewApproved,
} from "@/lib/server-reviews";

export interface ReviewActionResult {
  ok: boolean;
  error?: string;
}

const reviewSchema = z.object({
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  author: z.string().trim().min(2, "Please enter your name").max(60),
  email: z.string().trim().email("Enter a valid email address"),
  location: z.string().trim().max(60).optional(),
  rating: z.number().int().min(1, "Choose a rating").max(5),
  title: z.string().trim().min(3, "Add a short headline").max(100),
  body: z
    .string()
    .trim()
    .min(10, "Tell us a little more (10 characters minimum)")
    .max(2000),
});

export type SubmitReviewInput = z.infer<typeof reviewSchema>;

/**
 * Drop the cached product page(s) so a moderation change shows up on the
 * storefront immediately.
 *
 * Product pages are statically prerendered, so they only change when their
 * cache entry is invalidated. The pattern form MUST include the `(storefront)`
 * route group — `revalidatePath("/products/[slug]", "page")` silently matches
 * nothing. The literal URL is revalidated too when the product is known.
 */
async function revalidateProductPage(productId?: string): Promise<void> {
  revalidatePath("/(storefront)/products/[slug]", "page");
  if (!productId) return;
  try {
    const product = await getProductById(productId);
    if (product) revalidatePath(`/products/${product.slug}`);
  } catch (err) {
    console.error("revalidateProductPage: product lookup failed", err);
  }
}

/**
 * Accept a customer review.
 *
 * Held for moderation (approved = false) because this endpoint is public.
 * If the reviewer's email matches a real order, the review is flagged as a
 * verified purchase — the email itself is never published.
 */
export async function submitReview(
  input: SubmitReviewInput
): Promise<ReviewActionResult> {
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check your review.",
    };
  }
  const d = parsed.data;

  try {
    if (!isDbConfigured) {
      addReview({
        id: `rev-${Date.now().toString(36)}`,
        productId: d.productId,
        author: d.author,
        location: d.location || undefined,
        rating: d.rating,
        title: d.title,
        body: d.body,
        date: new Date().toISOString(),
        verified: false,
        approved: false,
      });
    } else {
      // A matching order makes this a verified purchase.
      const purchased = await prisma.order.findFirst({
        where: { email: { equals: d.email, mode: "insensitive" } },
        select: { id: true },
      });
      await prisma.review.create({
        data: {
          productId: d.productId,
          author: d.author,
          location: d.location || null,
          rating: d.rating,
          title: d.title,
          body: d.body,
          verified: Boolean(purchased),
          approved: false,
        },
      });
    }
    revalidatePath(`/products/${d.productSlug}`);
    revalidatePath("/admin/reviews");
    return { ok: true };
  } catch (err) {
    console.error("submitReview failed", err);
    return { ok: false, error: "Could not submit your review. Please retry." };
  }
}

/** Publish or unpublish a review (admin). */
export async function setReviewVisibility(
  id: string,
  approved: boolean
): Promise<ReviewActionResult> {
  try {
    let productId: string | undefined;
    if (!isDbConfigured) {
      productId = readReviews().find((r) => r.id === id)?.productId;
      if (!setReviewApproved(id, approved)) {
        return { ok: false, error: "Review not found." };
      }
    } else {
      const row = await prisma.review.update({
        where: { id },
        data: { approved },
        select: { productId: true },
      });
      productId = row.productId;
    }
    revalidatePath("/admin/reviews");
    await revalidateProductPage(productId);
    return { ok: true };
  } catch (err) {
    console.error("setReviewVisibility failed", err);
    return { ok: false, error: "Could not update the review." };
  }
}

/** Permanently delete a review (admin). */
export async function deleteReview(id: string): Promise<ReviewActionResult> {
  try {
    let productId: string | undefined;
    if (!isDbConfigured) {
      productId = readReviews().find((r) => r.id === id)?.productId;
      if (!removeReview(id)) {
        return { ok: false, error: "Review not found." };
      }
    } else {
      const row = await prisma.review.delete({
        where: { id },
        select: { productId: true },
      });
      productId = row.productId;
    }
    revalidatePath("/admin/reviews");
    await revalidateProductPage(productId);
    return { ok: true };
  } catch (err) {
    console.error("deleteReview failed", err);
    return { ok: false, error: "Could not delete the review." };
  }
}
