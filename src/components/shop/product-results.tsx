import { PackageOpen } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { ProductListItem } from "@/components/product/product-list-item";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface ProductResultsProps {
  products: Product[];
  view: "grid" | "list";
}

/** Renders the filtered products as a grid or list, or an empty state. */
export function ProductResults({ products, view }: ProductResultsProps) {
  if (products.length === 0) return <EmptyResults />;

  if (view === "list") {
    return (
      <div>
        {products.map((p) => (
          <ProductListItem key={p.id} product={p} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 3} />
      ))}
    </div>
  );
}

function EmptyResults() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-secondary text-muted-foreground">
        <PackageOpen className="size-6" />
      </div>
      <p className="mt-4 font-serif text-xl">No pieces match those filters</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try removing a filter or two — or explore the full collection.
      </p>
      <Button asChild variant="outline" className="mt-6">
        <a href="/shop">Clear filters</a>
      </Button>
    </div>
  );
}
