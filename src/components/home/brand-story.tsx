import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { img } from "@/lib/data/images";

const stats = [
  { value: "12+", label: "Years of craft" },
  { value: "40k", label: "Garments delivered" },
  { value: "4.9", label: "Average rating" },
];

/** Brand narrative — establishes heritage and trust. */
export function BrandStory() {
  return (
    <section className="section container">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <p className="eyebrow mb-3">Our Story</p>
          <h2 className="font-serif text-3xl leading-[1.1] md:text-4xl lg:text-[2.75rem]">
            A house built on the arch — enduring, considered, precise  
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              MEHRAB takes its name from the mehrab — the arch that anchors a
              space and draws the eye. It is the idea we return to: form with
              intent, beauty without excess.
            </p>
            <p>
              We make one thing, exceptionally well. Every kameez is cut and
              hand-finished in our Karachi atelier from fabrics we select
              ourselves — because how a garment falls should never be left to
              chance.
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-serif text-3xl text-foreground">
                  {s.value}
                </dt>
                <dd className="mt-1 text-2xs uppercase tracking-wide2 text-muted-foreground">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>

          <Button asChild variant="outline" size="lg" className="mt-8">
            <Link href="/about">Read our story</Link>
          </Button>
        </Reveal>

        <Reveal className="order-1 lg:order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
            <Image
              src={img("greenFull")}
              alt="MEHRAB shalwar kameez, hand-finished in the atelier"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
