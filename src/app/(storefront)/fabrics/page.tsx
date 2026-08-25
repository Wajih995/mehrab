import type { Metadata } from "next";
import Link from "next/link";

import { InfoPage } from "@/components/shared/info-page";

export const metadata: Metadata = {
  title: "Fabrics & Craft",
  description:
    "The MEHRAB fabric library — Wash & Wear, Egyptian Cotton, Boski, Karandi and more. Choose the hand-feel and season that suits you.",
  alternates: { canonical: "/fabrics" },
};

const FABRICS = [
  {
    name: "Wash & Wear",
    season: "All Season",
    blurb:
      "Low-maintenance and crease-resistant — holds its press through a full working day.",
  },
  {
    name: "Egyptian Cotton",
    season: "All Season",
    blurb:
      "Long-staple, breathable, and softer with every wash. Our signature cloth.",
  },
  {
    name: "Boski",
    season: "Festive",
    blurb:
      "A silk-cotton blend with a quiet sheen. Reserved for occasion wear.",
  },
  {
    name: "Karandi",
    season: "Winter",
    blurb:
      "A textured, mid-weight weave built for cooler evenings and layering.",
  },
  {
    name: "Cottonel",
    season: "All Season",
    blurb:
      "A refined cotton blend with extra body — structure without stiffness.",
  },
  {
    name: "Linen",
    season: "Summer",
    blurb: "Airy and quick-drying, with the relaxed drape summer asks for.",
  },
] as const;

export default function FabricsPage() {
  return (
    <InfoPage
      eyebrow="The Material"
      title="Fabrics & Craft"
      intro="We start with the cloth. Every seam is hand-finished in our Lahore atelier — mother-of-pearl buttons, hand-set collars, colour-fast dyeing."
      wide
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FABRICS.map((f) => (
          <Link
            key={f.name}
            href={`/shop?fabric=${encodeURIComponent(f.name)}`}
            className="group rounded-lg border border-border bg-background p-6 transition-colors hover:border-brass"
          >
            <p className="text-2xs uppercase tracking-wide2 text-muted-foreground">
              {f.season}
            </p>
            <h2 className="mt-2 font-serif text-xl">{f.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {f.blurb}
            </p>
            <span className="mt-4 inline-block text-2xs uppercase tracking-wide2 text-brass">
              Shop {f.name} &rarr;
            </span>
          </Link>
        ))}
      </div>
    </InfoPage>
  );
}
