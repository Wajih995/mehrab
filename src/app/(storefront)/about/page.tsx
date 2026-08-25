import type { Metadata } from "next";
import Image from "next/image";

import { InfoPage, InfoSection } from "@/components/shared/info-page";
import { img } from "@/lib/data/images";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "MEHRAB crafts premium men's shalwar kameez in Lahore — heritage tailoring, considered fabrics, and a modern, minimal silhouette.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="Our Story"
      title="Elevate Tradition"
      intro="MEHRAB began with a simple conviction: the shalwar kameez deserves the same rigour as the finest tailoring anywhere."
      wide
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <InfoSection title="Heritage, re-cut">
            <p>
              Eastern menswear carries centuries of craft. We honour that
              inheritance — then refine it: a cleaner collar, a leaner sleeve,
              a silhouette that moves with a modern day.
            </p>
          </InfoSection>
          <InfoSection title="The Lahore atelier">
            <p>
              Every MEHRAB piece is cut and finished by hand in our Lahore
              atelier. Collars are hand-set, plackets are embroidered in-house,
              and each garment is pressed and inspected before it leaves.
            </p>
          </InfoSection>
          <InfoSection title="Cloth first">
            <p>
              We start with the fabric — long-staple Egyptian cotton, pure
              Boski, textured Karandi — selected for how it falls, feels, and
              lasts. The design follows the cloth, never the other way around.
            </p>
          </InfoSection>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
          <Image
            src={img("greenFull")}
            alt="MEHRAB dark green shalwar kameez, full suit"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </InfoPage>
  );
}
