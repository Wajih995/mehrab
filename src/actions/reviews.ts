"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import {
  addReview,
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
    if (!isDbConfigured) {
      if (!setReviewApproved(id, approved)) {
        return { ok: false, error: "Review not found." };
      }
    } else {
      await prisma.review.update({ where: { id }, data: { approved } });
    }
    revalidatePath("/admin/reviews");
    revalidatePath("/products/[slug]", "page");
    return { ok: true };
  } catch (err) {
    console.error("setReviewVisibility failed", err);
    return { ok: false, error: "Could not update the review." };
  }
}

/** Permanently delete a review (admin). */
export async function deleteReview(id: string): Promise<ReviewActionResult> {
  try {
    if (!isDbConfigured) {
      if (!removeReview(id)) {
        return { ok: false, error: "Review not found." };
      }
    } else {
      await prisma.review.delete({ where: { id } });
    }
    revalidatePath("/admin/reviews");
    revalidatePath("/products/[slug]", "page");
    return { ok: true };
  } catch (err) {
    console.error("deleteReview failed", err);
    return { ok: false, error: "Could not delete the review." };
  }
}
