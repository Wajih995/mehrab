import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { img } from "@/lib/data/images";

/** Split editorial banner spotlighting the Premium line. */
export function PremiumBanner() {
  return (
    <section className="section container">
      <div className="grid overflow-hidden rounded-xl bg-charcoal-950 text-sand-50 lg:grid-cols-2">
        <div className="relative min-h-[320px] lg:min-h-[520px]">
          <Image
            src={img("greenQuarter")}
            alt="MEHRAB Premium line shalwar kameez detail"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top"
          />
        </div>
        <Reveal className="flex flex-col justify-center gap-6 p-8 md:p-14 lg:p-16">
          <p className="text-2xs font-medium uppercase tracking-luxe text-brass-soft">
            The Premium Line
          </p>
          <h2 className="font-serif text-3xl leading-[1.1] md:text-4xl lg:text-[2.75rem]">
            Fabrics worth the wait, finishing worth the detail
          </h2>
          <p className="max-w-md text-sand-50/75 leading-relaxed">
            Long-staple Egyptian cotton, pure Boski, and textured Karandi —
            selected for how they fall, feel, and last. Every seam is
            hand-finished in our Lahore atelier.
          </p>
          <ul className="grid grid-cols-2 gap-4 py-2 text-sm">
            {[
              "Hand-finished collars",
              "Mother-of-pearl buttons",
              "Colour-fast dyeing",
              "Made to order sizing",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sand-50/80">
                <span className="size-1 rounded-full bg-brass" />
                {f}
              </li>
            ))}
          </ul>
          <div>
            <Button asChild size="lg" variant="brass">
              <Link href="/collections/premium">Discover Premium</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
