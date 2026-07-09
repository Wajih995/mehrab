import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion presets — kept subtle and luxe.
 * Import these instead of redefining variants per component.
 */

export const easeLuxe: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeLuxe },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: easeLuxe } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeLuxe } },
};

/** Parent stagger — children should use `fadeUp` (or similar). */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Common viewport config for scroll-triggered reveals. */
export const viewportOnce = { once: true, amount: 0.2 } as const;
