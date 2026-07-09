import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Reveal, Stagger } from "@/components/shared/reveal";
import { getCollections } from "@/lib/repositories/products";
import { fadeUp } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore the MEHRAB collections of premium men's shalwar kameez — from the Signature Line to Wedding & Occasion.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const collections = await getCollections();
  return (
    <div className="container py-8 md:py-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Collections" }]}
        className="mb-6"
      />
      <div className="max-w-2xl">
        <p className="eyebrow mb-3">Curated Collections</p>
        <h1 className="font-serif text-3xl leading-tight md:text-4xl lg:text-[2.75rem]">
          Find your register
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          Each collection is a distinct expression of the MEHRAB line — choose
          the mood that suits the moment.
        </p>
      </div>

      <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
        {collections.map((c) => (
          <Reveal key={c.slug} variants={fadeUp}>
            <Link
              href={`/collections/${c.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-muted"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-700 ease-luxe group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/10 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 text-sand-50">
                <h2 className="font-serif text-2xl leading-tight">{c.name}</h2>
                <p className="mt-1.5 max-w-xs text-sm text-sand-50/80">
                  {c.description}
                </p>
                <span className="mt-3 inline-block text-2xs uppercase tracking-wide2 text-sand-50/90 transition-colors group-hover:text-brass-soft">
                  Explore &rarr;
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </Stagger>
    </div>
  );
}
