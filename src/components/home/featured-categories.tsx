import Image from "next/image";
import Link from "next/link";

import { Reveal, Stagger } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { collections } from "@/lib/data/products";
import { fadeUp } from "@/lib/motion";

/** An editorial grid of collections — the primary browse entry point. */
export function FeaturedCategories() {
  const featured = collections.slice(0, 5);

  return (
    <section className="section container">
      <SectionHeading
        eyebrow="Curated Collections"
        title="Find your register"
        description="From everyday essentials to occasion-ready Boski, each collection is a distinct expression of the MEHRAB line."
        link={{ label: "All Collections", href: "/collections" }}
      />

      <Stagger className="mt-10 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-4 md:gap-4 lg:grid-cols-6 lg:grid-rows-2">
        {featured.map((collection, i) => (
          <Reveal
            key={collection.slug}
            variants={fadeUp}
            className={
              i === 0
                ? "col-span-2 row-span-2 lg:col-span-3"
                : i === 1
                  ? "lg:col-span-3"
                  : "lg:col-span-2"
            }
          >
            <Link
              href={`/collections/${collection.slug}`}
              className="group relative block h-full min-h-[220px] overflow-hidden rounded-lg bg-muted"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/75 via-charcoal-950/10 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 text-sand-50">
                <h3 className="font-serif text-xl leading-tight md:text-2xl">
                  {collection.name}
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
