"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { brand } from "@/lib/data/images";
import { easeLuxe } from "@/lib/motion";

/** Fullscreen editorial hero — the brand's first impression. */
export function Hero() {
  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-charcoal-950 text-sand-50">
      <Image
        src={brand.heroBanner}
        alt="MEHRAB — Elevate Tradition: kameez on an atelier rail beside folded fabrics"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_30%] opacity-95"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-charcoal-950/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/60 to-transparent" />

      <div className="container relative flex h-full flex-col justify-end pb-16 md:justify-center md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeLuxe }}
          className="max-w-xl"
        >
          <p className="text-2xs font-medium uppercase tracking-luxe text-brass-soft">
            The Winter Heritage Collection
          </p>
          <h1 className="mt-5 font-serif text-display-sm font-light leading-[1.02] md:text-display-md lg:text-display-lg">
            The architecture of eastern menswear
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-sand-50/80">
            Heritage tailoring and considered fabrics, cut for a modern
            silhouette. Handmade in Pakistan, made to be lived in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="xl" variant="brass">
              <Link href="/collections/winter-heritage">Shop the Collection</Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="border-sand-50/30 bg-transparent text-sand-50 hover:bg-sand-50 hover:text-charcoal-950"
            >
              <Link href="/shop">Explore All</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute inset-x-0 bottom-6 hidden justify-center md:flex"
      >
        <span className="text-2xs uppercase tracking-luxe text-sand-50/60">
          Scroll to discover
        </span>
      </motion.div>
    </section>
  );
}
