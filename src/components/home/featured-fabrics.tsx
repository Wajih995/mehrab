import Link from "next/link";

import { Reveal, Stagger } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { fadeUp } from "@/lib/motion";

const fabrics = [
  {
    name: "Egyptian Cotton",
    note: "Long-staple, breathable, softens with every wash.",
    season: "All Season",
  },
  {
    name: "Boski",
    note: "A silk-cotton blend with a quiet sheen. Reserved for occasion.",
    season: "Festive",
  },
  {
    name: "Karandi",
    note: "Textured, mid-weight weave built for cooler evenings.",
    season: "Winter",
  },
  {
    name: "Wash & Wear",
    note: "Crease-resistant and effortless. The everyday essential.",
    season: "Summer",
  },
];

/** Fabric-first discovery — how discerning buyers actually shop eastern wear. */
export function FeaturedFabrics() {
  return (
    <section className="section container">
      <SectionHeading
        eyebrow="The Material"
        title="Shop by fabric"
        description="We start with the cloth. Choose the hand-feel and season that suits you."
        link={{ label: "Explore Fabrics", href: "/fabrics" }}
      />

      <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:mt-12">
        {fabrics.map((fabric) => (
          <Reveal key={fabric.name} variants={fadeUp}>
            <Link
              href={`/shop?fabric=${encodeURIComponent(fabric.name)}`}
              className="group flex h-full flex-col justify-between rounded-lg border border-border bg-card p-6 transition-all duration-300 ease-luxe hover:-translate-y-1 hover:border-brass/40 hover:shadow-lift"
            >
              <div>
                <span className="eyebrow">{fabric.season}</span>
                <h3 className="mt-3 font-serif text-2xl leading-tight">
                  {fabric.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {fabric.note}
                </p>
              </div>
              <span className="mt-6 inline-block text-2xs uppercase tracking-wide2 text-foreground transition-colors group-hover:text-brass">
                Shop {fabric.name} &rarr;
              </span>
            </Link>
          </Reveal>
        ))}
      </Stagger>
    </section>
  );
}
