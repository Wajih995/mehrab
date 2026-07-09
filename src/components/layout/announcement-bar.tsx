"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { siteConfig } from "@/lib/site";
import { easeLuxe } from "@/lib/motion";

/** Slim, sticky top bar that rotates through brand announcements. */
export function AnnouncementBar() {
  const messages = siteConfig.announcements;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % messages.length),
      4500
    );
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="relative z-50 bg-charcoal-950 text-sand-50">
      <div className="container flex h-9 items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: easeLuxe }}
            className="text-2xs font-medium uppercase tracking-wide2 text-center"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
