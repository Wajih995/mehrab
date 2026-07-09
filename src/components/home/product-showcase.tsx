import { ProductRail } from "@/components/product/product-rail";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductShowcaseProps {
  eyebrow?: string;
  title: string;
  description?: string;
  products: Product[];
  link?: { label: string; href: string };
  muted?: boolean;
}

/** Titled, scroll-revealed product rail used across the homepage. */
export function ProductShowcase({
  eyebrow,
  title,
  description,
  products,
  link,
  muted,
}: ProductShowcaseProps) {
  if (products.length === 0) return null;

  return (
    <section className={cn("section", muted && "bg-secondary/40")}>
      <div className="container">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          link={link}
        />
        <Reveal className="mt-10 md:mt-12">
          <ProductRail products={products} />
        </Reveal>
      </div>
    </section>
  );
}
