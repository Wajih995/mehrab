"use client";

import { useEffect } from "react";

import { ProductRail } from "@/components/product/product-rail";
import { SectionHeading } from "@/components/shared/section-heading";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { useMounted } from "@/hooks/use-mounted";
import { getAllProducts } from "@/lib/data/products";

/**
 * Records the current product as viewed, then surfaces previously viewed
 * pieces (excluding the current one). Persists via localStorage.
 */
export function RecentlyViewed({ currentId }: { currentId: string }) {
  const mounted = useMounted();
  const ids = useRecentlyViewed((s) => s.ids);
  const add = useRecentlyViewed((s) => s.add);

  useEffect(() => {
    add(currentId);
  }, [currentId, add]);

  if (!mounted) return null;

  const all = getAllProducts();
  const products = ids
    .filter((id) => id !== currentId)
    .map((id) => all.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  if (products.length === 0) return null;

  return (
    <section className="section container">
      <SectionHeading eyebrow="Continue browsing" title="Recently viewed" />
      <div className="mt-10">
        <ProductRail products={products} withControls={false} />
      </div>
    </section>
  );
}
