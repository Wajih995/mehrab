import { BadgeCheck } from "lucide-react";

import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Product, Review } from "@/types";

interface ProductReviewsProps {
  product: Product;
  reviews: Review[];
}

export function ProductReviews({ product, reviews }: ProductReviewsProps) {
  // Rating distribution across the demo reviews.
  const dist = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, count, pct: reviews.length ? (count / reviews.length) * 100 : 0 };
  });

  return (
    <section id="reviews" className="scroll-mt-28">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-2">Reviews</p>
          <h2 className="font-serif text-2xl md:text-3xl">
            What customers say
          </h2>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
        {/* Summary */}
        <div>
          <div className="flex items-end gap-3">
            <span className="font-serif text-5xl leading-none">
              {product.rating.toFixed(1)}
            </span>
            <div className="pb-1">
              <StarRating rating={product.rating} />
              <p className="mt-1 text-xs text-muted-foreground">
                {product.reviewCount.toLocaleString()} reviews
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-1.5">
            {dist.map((d) => (
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

          <Button variant="outline" className="mt-6 w-full">
            Write a review
          </Button>
        </div>

        {/* List */}
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
                    <BadgeCheck className="size-3.5" /> Verified
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
