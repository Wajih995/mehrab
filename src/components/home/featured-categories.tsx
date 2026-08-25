import Image from "next/image";
import Link from "next/link";

import { Reveal, Stagger } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { getMenuCategoryViews } from "@/lib/repositories/products";
import { fadeUp } from "@/lib/motion";

/**
 * The primary browse entry point — renders the LIVE menu categories
 * (admin-managed under /admin/menus), never a hard-coded list.
 */
export async function FeaturedCategories() {
  const categories = await getMenuCategoryViews();
  if (categories.length === 0) return null;

  return (
    <section className="section container">
      <SectionHeading
        eyebrow="Curated Collections"
        title="Find your register"
        description="Each category is a distinct expression of the MEHRAB line — choose the mood that suits the moment."
        link={{ label: "All Collections", href: "/collections" }}
      />

      <Stagger className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-12 md:gap-4 lg:grid-cols-5">
        {categories.slice(0, 5).map((cat) => (
          <Reveal key={cat.slug} variants={fadeUp}>
            <Link
              href={cat.href}
              className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-muted"
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover object-top transition-transform duration-700 ease-luxe group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/75 via-charcoal-950/10 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 text-sand-50">
                <h3 className="font-serif text-lg leading-tight md:text-xl">
                  {cat.label}
                </h3>
                <span className="mt-1.5 inline-block text-2xs uppercase tracking-wide2 text-sand-50/80 transition-colors group-hover:text-brass-soft">
                  Shop now &rarr;
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </Stagger>
    </section>
  );
}
