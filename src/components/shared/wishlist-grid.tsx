"use client";

import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { useMounted } from "@/hooks/use-mounted";
import type { Product } from "@/types";

/** Renders the visitor's saved pieces from the persisted wishlist store. */
export function WishlistGrid({ products }: { products: Product[] }) {
  const mounted = useMounted();
  const ids = useWishlist((s) => s.ids);

  if (!mounted) return null;

  const saved = products.filter((p) => ids.includes(p.id));

  if (saved.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center">
        <p className="font-serif text-xl">Nothing saved yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Tap the heart on any piece to keep it here.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">Browse the line</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {saved.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
