"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { useWishlist } from "@/hooks/use-wishlist";
import { useMounted } from "@/hooks/use-mounted";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

/**
 * The catalogue workhorse. Image hover-swap to the second shot, wishlist
 * toggle, badges, and a quiet price/rating block. Server-friendly data,
 * minimal client state.
 */
export function ProductCard({ product, priority, className }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const mounted = useMounted();
  const inWishlist = useWishlist((s) => s.ids.includes(product.id));
  const toggleWishlist = useWishlist((s) => s.toggle);

  const primary = product.images[0];
  const secondary = product.images[1] ?? product.images[0];
  const discount = product.compareAtPrice
    ? discountPercent(product.compareAtPrice, product.price)
    : 0;

  return (
    <article
      className={cn("group relative", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={primary.url}
            alt={primary.alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-opacity duration-500 ease-luxe",
              hovered && secondary !== primary ? "opacity-0" : "opacity-100"
            )}
          />
          {secondary !== primary && (
            <Image
              src={secondary.url}
              alt={secondary.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                "scale-105 object-cover transition-all duration-700 ease-luxe",
                hovered ? "scale-100 opacity-100" : "opacity-0"
              )}
            />
          )}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          {product.isNew && !discount && <Badge variant="brass">New</Badge>}
          {product.isBestSeller && !product.isNew && !discount && (
            <Badge variant="default">Best Seller</Badge>
          )}
          {!product.inStock && <Badge variant="muted">Sold Out</Badge>}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={mounted ? inWishlist : undefined}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/80 text-foreground opacity-0 shadow-soft backdrop-blur transition-all duration-300 ease-luxe hover:bg-background focus-visible:opacity-100 group-hover:opacity-100 max-lg:opacity-100"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              mounted && inWishlist && "fill-brass text-brass"
            )}
          />
        </button>

        {/* Quick add hint (visual affordance; full quick-view added later) */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 ease-luxe group-hover:translate-y-0 group-hover:opacity-100 max-lg:hidden">
          <Link
            href={`/products/${product.slug}`}
            className="block rounded-md bg-background/95 py-2.5 text-center text-2xs font-medium uppercase tracking-wide2 shadow-soft backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            View Product
          </Link>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-3.5 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-snug">
            <Link href={`/products/${product.slug}`} className="hover:text-brass">
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">{product.subtitle}</p>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm font-medium tabular-nums">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through tabular-nums">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
