"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

/**
 * Product image gallery — thumbnail rail + main image with desktop
 * hover-to-zoom (pan follows the cursor) and mobile swipe scrolling.
 */
export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const frameRef = useRef<HTMLDivElement>(null);

  const current = images[active] ?? images[0];

  const onMove = (e: React.MouseEvent) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto md:flex-col md:overflow-visible no-scrollbar">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-md bg-muted transition-all md:w-20",
                i === active
                  ? "ring-1 ring-brass ring-offset-2 ring-offset-background"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="80px"
                className="object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div
        ref={frameRef}
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={onMove}
        className="relative aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden rounded-xl bg-muted"
      >
        <Image
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ transformOrigin: origin }}
          className={cn(
            "object-cover object-top transition-transform duration-300 ease-luxe",
            zooming ? "scale-[1.8]" : "scale-100"
          )}
        />
      </div>
    </div>
  );
}
