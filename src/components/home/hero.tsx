"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { brand } from "@/lib/data/images";
import { easeLuxe } from "@/lib/motion";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

type Slide = {
  id: string;
  src: string;
  alt: string;
  imageClassName: string;
};

const slides: Slide[] = [
  {
    id: "riwayat",
    src: brand.riwayatBanner,
    alt: "MEHRAB new collection Riwayat-e-Baaft — navy blue and white textured kameez shalwar with fabric swatches",
    imageClassName: "object-cover object-center",
  },
  {
    id: "lineup",
    src: brand.lineupBanner,
    alt: "MEHRAB Essentials — six kameez shalwar in white, grey, green, brown, navy and black on mannequins",
    imageClassName: "object-cover object-center",
  },
  {
    id: "atelier",
    src: brand.heroBanner,
    alt: "MEHRAB — Elevate Tradition: kameez on an atelier rail beside folded fabrics",
    imageClassName: "object-cover object-[center_30%]",
  },
];

/** Fullscreen hero carousel — the brand's first impression. */
export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + slides.length) % slides.length),
    [],
  );

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, go]);

  const slide = slides[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-charcoal-950 text-sand-50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* The banners carry their own typography; keep a heading for SEO & screen readers. */}
      <h1 className="sr-only">MEHRAB — Elevate Tradition. Eastern menswear, handmade in Pakistan.</h1>

      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${slides.length}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: easeLuxe }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1);
            else if (info.offset.x > 60) go(-1);
          }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className={slide.imageClassName}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Shared CTA */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: easeLuxe }}
          className="pointer-events-auto"
        >
          <Button asChild size="xl" variant="brass">
            <a href="#new-arrivals">Shop Mehrab Essentials</a>
          </Button>
        </motion.div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-sand-50/25 bg-charcoal-950/30 p-2.5 text-sand-50 backdrop-blur-sm transition hover:bg-charcoal-950/60 md:block"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-sand-50/25 bg-charcoal-950/30 p-2.5 text-sand-50 backdrop-blur-sm transition hover:bg-charcoal-950/60 md:block"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i === index ? "w-8 bg-brass-soft" : "w-3 bg-sand-50/40 hover:bg-sand-50/70",
            )}
          />
        ))}
      </div>
    </section>
  );
}
