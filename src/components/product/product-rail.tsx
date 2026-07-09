"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductRailProps {
  products: Product[];
  /** When true, shows prev/next controls on desktop. */
  withControls?: boolean;
  className?: string;
}

/**
 * Horizontal, snap-scrolling product rail — the primary way we surface
 * curated groups on the homepage without overwhelming the vertical rhythm.
 */
export function ProductRail({
  products,
  withControls = true,
  className,
}: ProductRailProps) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scroller}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0"
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            className="w-[62%] shrink-0 snap-start sm:w-[42%] md:w-[31%] lg:w-[23.5%]"
          >
            <ProductCard product={product} priority={i < 2} />
          </div>
        ))}
      </div>

      {withControls && products.length > 4 && (
        <div className="mt-6 hidden justify-end gap-2 md:flex">
          <RailButton dir="prev" onClick={() => scrollBy(-1)} />
          <RailButton dir="next" onClick={() => scrollBy(1)} />
        </div>
      )}
    </div>
  );
}

function RailButton({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous products" : "Next products"}
      className="grid size-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-brass hover:text-brass"
    >
      <Icon className="size-5" />
    </button>
  );
}
