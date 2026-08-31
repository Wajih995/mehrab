import { BadgeCheck, MessageSquare } from "lucide-react";

import { StarRating } from "@/components/shared/star-rating";
import { WriteReviewDialog } from "@/components/product/write-review-dialog";
import { formatDate } from "@/lib/utils";
import type { RatingSummary } from "@/lib/reviews-shared";
import type { Product, Review } from "@/types";

interface ProductReviewsProps {
  product: Product;
  reviews: Review[];
  /** Derived from the approved reviews — never a stored rating. */
  rating: RatingSummary;
}

export function ProductReviews({
  product,
  reviews,
  rating,
}: ProductReviewsProps) {
  const hasReviews = rating.count > 0;

  return (
    <section id="reviews" className="scroll-mt-28">
      <div className="mb-8">
        <p className="eyebrow mb-2">Reviews</p>
        <h2 className="font-serif text-2xl md:text-3xl">What customers say</h2>
      </div>

      <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
        {/* Summary */}
        <div>
          {hasReviews ? (
            <>
              <div className="flex items-end gap-3">
                <span className="font-serif text-5xl leading-none">
                  {rating.average.toFixed(1)}
                </span>
                <div className="pb-1">
                  <StarRating rating={rating.average} />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {rating.count.toLocaleString()}{" "}
                    {rating.count === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-1.5">
                {rating.distribution.map((d) => (
                  <div key={d.star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 tabular-nums text-muted-foreground">
                      {d.star}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-brass"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right tabular-nums text-muted-foreground">
                      {d.count}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-5 text-sm">
              <p className="font-medium">No reviews yet</p>
              <p className="mt-1 text-muted-foreground">
                Be the first to review this piece — your feedback helps other
                customers choose their size and fabric.
              </p>
            </div>
          )}

          <WriteReviewDialog
            productId={product.id}
            productSlug={product.slug}
            productName={product.name}
          />
        </div>

        {/* List */}
        {hasReviews ? (
          <ul className="divide-y divide-border">
            {reviews.map((r) => (
              <li key={r.id} className="py-6 first:pt-0">
                <div className="flex items-center justify-between gap-3">
                  <StarRating rating={r.rating} />
                  <time className="text-xs text-muted-foreground">
                    {formatDate(r.date)}
                  </time>
                </div>
                <p className="mt-3 font-medium">{r.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {r.body}
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{r.author}</span>
                  {r.location && <span>· {r.location}</span>}
                  {r.verified && (
                    <span className="ml-1 inline-flex items-center gap-1 text-brass">
                      <BadgeCheck className="size-3.5" /> Verified purchase
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg bg-secondary/30 py-14 text-center">
            <div className="grid size-12 place-items-center rounded-full bg-background text-muted-foreground">
              <MessageSquare className="size-5" />
            </div>
            <p className="mt-4 font-serif text-lg">
              This piece is waiting for its first review
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Bought it? Tell other customers how the fabric feels and how the
              fit came out.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
