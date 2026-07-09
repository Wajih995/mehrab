import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
  showValue?: boolean;
}

export function StarRating({
  rating,
  count,
  size = "sm",
  className,
  showValue = false,
}: StarRatingProps) {
  const px = size === "sm" ? "size-3.5" : "size-4";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <Star
              key={i}
              className={cn(
                px,
                filled
                  ? "fill-brass text-brass"
                  : "fill-transparent text-sand-300"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium tabular-nums">
          {rating.toFixed(1)}
        </span>
      )}
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground">
          ({count.toLocaleString()})
        </span>
      )}
      <span className="sr-only">
        Rated {rating} out of 5{count ? ` from ${count} reviews` : ""}
      </span>
    </div>
  );
}
