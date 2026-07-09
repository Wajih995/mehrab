"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  /** Delay in seconds before the animation begins. */
  delay?: number;
  as?: "div" | "section" | "li" | "ul" | "article";
}

/** Single element that fades/slides up when scrolled into view. */
export function Reveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "section";
}

/** Container that staggers its direct <Reveal>/motion children into view. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = "div",
}: StaggerProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={staggerContainer(stagger, delay)}
    >
      {children}
    </MotionTag>
  );
}
