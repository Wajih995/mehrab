"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { mainNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { easeLuxe } from "@/lib/motion";

/** Desktop primary navigation with hover-driven mega menu. */
export function DesktopNav({ dark = false }: { dark?: boolean }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <nav
      className="hidden lg:block"
      onMouseLeave={() => setActive(null)}
      aria-label="Primary"
    >
      <ul className="flex items-center gap-8">
        {mainNav.map((section) => {
          const hasMenu = Boolean(section.columns || section.featured);
          const isActive = active === section.label;
          return (
            <li
              key={section.label}
              className="py-6"
              onMouseEnter={() => setActive(hasMenu ? section.label : null)}
            >
              <Link
                href={section.href}
                className={cn(
                  "group inline-flex items-center gap-1 text-2xs font-medium uppercase tracking-wide2 transition-colors",
                  dark ? "text-sand-50/90 hover:text-sand-50" : "text-foreground/80 hover:text-foreground",
                  isActive && (dark ? "text-sand-50" : "text-foreground")
                )}
              >
                {section.label}
                {hasMenu && (
                  <ChevronDown
                    className={cn(
                      "size-3 transition-transform duration-300",
                      isActive && "rotate-180"
                    )}
                  />
                )}
              </Link>

              <AnimatePresence>
                {hasMenu && isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.28, ease: easeLuxe }}
                    className="absolute inset-x-0 top-full z-40 border-t border-border bg-background shadow-lift"
                  >
                    <div className="container grid grid-cols-12 gap-10 py-10">
                      <div
                        className={cn(
                          "grid gap-10",
                          section.featured ? "col-span-8 grid-cols-3" : "col-span-12 grid-cols-4"
                        )}
                      >
                        {section.columns?.map((col) => (
                          <div key={col.heading}>
                            <p className="eyebrow mb-4">{col.heading}</p>
                            <ul className="space-y-2.5">
                              {col.items.map((item) => (
                                <li key={item.label}>
                                  <Link
                                    href={item.href}
                                    className="text-sm text-muted-foreground transition-colors hover:text-brass"
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {section.featured && (
                        <Link
                          href={section.featured.href}
                          className="group relative col-span-4 aspect-[4/3] overflow-hidden rounded-lg"
                        >
                          <Image
                            src={section.featured.image}
                            alt={section.featured.title}
                            fill
                            sizes="400px"
                            className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/10 to-transparent" />
                          <div className="absolute inset-x-5 bottom-5 text-sand-50">
                            <p className="font-serif text-lg leading-tight">
                              {section.featured.title}
                            </p>
                            <span className="mt-1 inline-block text-2xs uppercase tracking-wide2 text-sand-50/80 group-hover:text-sand-50">
                              {section.featured.cta} &rarr;
                            </span>
                          </div>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
