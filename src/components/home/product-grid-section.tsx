import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductGridSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  products: Product[];
  /** Collection page the "View All" button opens. */
  viewAllHref: string;
  viewAllLabel?: string;
  muted?: boolean;
}

/** How many cards a homepage row shows before deferring to the full page. */
const CARDS = 5;

/**
 * A homepage row of up to five product cards over a "View All" button that
 * opens the full collection.
 *
 * A grid rather than the horizontal `ProductRail`: five cards fit one desktop
 * row, so there is nothing to scroll to, and a static row keeps every product
 * visible to crawlers and to keyboard users.
 */
export function ProductGridSection({
  eyebrow,
  title,
  description,
  products,
  viewAllHref,
  viewAllLabel = "View All",
  muted,
}: ProductGridSectionProps) {
  const shown = products.slice(0, CARDS);
  if (shown.length === 0) return null;

  return (
    <section className={cn("section", muted && "bg-secondary/40")}>
      <div className="container">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <Stagger className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:mt-12 md:gap-x-4 lg:grid-cols-5">
          {shown.map((product, i) => (
            <Reveal key={product.id} variants={fadeUp}>
              <ProductCard product={product} priority={i < 2} />
            </Reveal>
          ))}
        </Stagger>

        <div className="mt-10 flex justify-center md:mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href={viewAllHref}>
              {viewAllLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
