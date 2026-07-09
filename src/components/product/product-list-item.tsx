"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { useWishlist } from "@/hooks/use-wishlist";
import { useMounted } from "@/hooks/use-mounted";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

/** Horizontal product row for the list-view layout. */
export function ProductListItem({ product }: { product: Product }) {
  const mounted = useMounted();
  const inWishlist = useWishlist((s) => s.ids.includes(product.id));
  const toggleWishlist = useWishlist((s) => s.toggle);
  const discount = product.compareAtPrice
    ? discountPercent(product.compareAtPrice, product.price)
    : 0;

  return (
    <article className="group flex gap-4 border-b border-border py-5 sm:gap-6 sm:py-6">
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-40"
      >
        <Image
          src={product.images[0].url}
          alt={product.images[0].alt}
          fill
          sizes="(max-width: 640px) 112px, 160px"
          className="object-cover object-top transition-transform duration-500 ease-luxe group-hover:scale-105"
        />
        {discount > 0 && (
          <Badge variant="sale" className="absolute left-2 top-2">
            -{discount}%
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg leading-tight sm:text-xl">
              <Link
                href={`/products/${product.slug}`}
                className="hover:text-brass"
              >
                {product.name}
              </Link>
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {product.subtitle}
            </p>
          </div>
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label="Toggle wishlist"
            className="shrink-0 text-muted-foreground transition-colors hover:text-brass"
          >
            <Heart
              className={cn(
                "size-5",
                mounted && inWishlist && "fill-brass text-brass"
              )}
            />
          </button>
        </div>

        <div className="mt-2">
          <StarRating rating={product.rating} count={product.reviewCount} />
        </div>

        <p className="mt-2 hidden max-w-prose text-sm leading-relaxed text-muted-foreground sm:line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-medium tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through tabular-nums">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href={`/products/${product.slug}`}>View</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
