import Link from "next/link";

import { Reveal, Stagger } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { getProducts } from "@/lib/repositories/products";
import { fadeUp } from "@/lib/motion";

/** Editorial notes for known fabrics; unlisted fabrics get a generic line. */
const FABRIC_NOTES: Record<string, { note: string; season: string }> = {
  "Egyptian Cotton": {
    note: "Long-staple, breathable, softens with every wash.",
    season: "All Season",
  },
  Boski: {
    note: "A silk-cotton blend with a quiet sheen. Reserved for occasion.",
    season: "Festive",
  },
  Karandi: {
    note: "Textured, mid-weight weave built for cooler evenings.",
    season: "Winter",
  },
  "Wash & Wear": {
    note: "Crease-resistant and effortless. The everyday essential.",
    season: "Summer",
  },
  Cotton: {
    note: "Honest, breathable cotton — the daily workhorse.",
    season: "All Season",
  },
  Linen: {
    note: "Airy and quick-drying, with a relaxed summer drape.",
    season: "Summer",
  },
  Cottonel: {
    note: "A refined cotton blend with extra body and structure.",
    season: "All Season",
  },
  "Premium Blended": {
    note: "Our most considered blend — drape, recovery, and depth of colour.",
    season: "All Season",
  },
};

/**
 * Fabric-first discovery — shows only fabrics that exist in the LIVE
 * catalogue, so the homepage never advertises an empty shelf.
 */
export async function FeaturedFabrics() {
  const products = await getProducts();
  const fabrics = [...new Set(products.map((p) => p.fabric))].slice(0, 4);
  if (fabrics.length === 0) return null;

  return (
    <section className="section container">
      <SectionHeading
        eyebrow="The Material"
        title="Shop by fabric"
        description="We start with the cloth. Choose the hand-feel and season that suits you."
        link={{ label: "Explore Fabrics", href: "/fabrics" }}
      />

      <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:mt-12">
        {fabrics.map((name) => {
          const meta = FABRIC_NOTES[name] ?? {
            note: "Considered cloth, cut and finished in our Karachi atelier.",
            season: "All Season",
          };
          return (
            <Reveal key={name} variants={fadeUp}>
              <Link
                href={`/shop?fabric=${encodeURIComponent(name)}`}
                className="group flex h-full flex-col justify-between rounded-lg border border-border bg-card p-6 transition-all duration-300 ease-luxe hover:-translate-y-1 hover:border-brass/40 hover:shadow-lift"
              >
                <div>
                  <span className="eyebrow">{meta.season}</span>
                  <h3 className="mt-3 font-serif text-2xl leading-tight">
                    {name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {meta.note}
                  </p>
                </div>
                <span className="mt-6 inline-block text-2xs uppercase tracking-wide2 text-foreground transition-colors group-hover:text-brass">
                  Shop {name} &rarr;
                </span>
              </Link>
            </Reveal>
          );
        })}
      </Stagger>
    </section>
  );
}
