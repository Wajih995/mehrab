import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, Stagger } from "@/components/shared/reveal";
import { siteConfig } from "@/lib/site";
import { fadeUp } from "@/lib/motion";
import { img, type KameezImageKey } from "@/lib/data/images";

const posts: KameezImageKey[] = [
  "whiteFull",
  "blackDetail",
  "navyFull",
  "greenQuarter",
  "whiteDetail",
  "greyDetail",
];

/** Shoppable social feed placeholder — swap for the Instagram API later. */
export function InstagramGallery() {
  return (
    <section className="section container">
      <SectionHeading
        eyebrow="@mehrab"
        title="Styled by the community"
        description="Tag @mehrab to be featured. Real people, real drape."
        align="center"
      />

      <Stagger className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:mt-12 md:grid-cols-6 md:gap-3">
        {posts.map((key, i) => (
          <Reveal key={`${key}-${i}`} variants={fadeUp}>
            <Link
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-md bg-muted"
            >
              <Image
                src={img(key)}
                alt="MEHRAB shalwar kameez on Instagram"
                fill
                sizes="(max-width: 768px) 33vw, 16vw"
                className="object-cover object-top transition-transform duration-500 ease-luxe group-hover:scale-110"
              />
              <div className="absolute inset-0 grid place-items-center bg-charcoal-950/0 opacity-0 transition-all duration-300 group-hover:bg-charcoal-950/40 group-hover:opacity-100">
                <Instagram className="size-6 text-sand-50" />
              </div>
            </Link>
          </Reveal>
        ))}
      </Stagger>
    </section>
  );
}
