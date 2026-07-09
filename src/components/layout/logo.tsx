import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Rendered logo height. */
  size?: "sm" | "md" | "lg";
  /** "dark" for light backgrounds (default), "cream" for dark backgrounds. */
  tone?: "dark" | "cream";
  href?: string | null;
  priority?: boolean;
}

/** Intrinsic dimensions of the processed horizontal lockup. */
const INTRINSIC = { width: 1147, height: 280 };

const heights = {
  sm: "h-7",
  md: "h-9",
  lg: "h-11",
} as const;

const sources = {
  dark: "/brand/logo-horizontal-dark.png",
  cream: "/brand/logo-horizontal-cream.png",
} as const;

/**
 * MEHRAB horizontal logo — the arch mark, wordmark, and "Elevate Tradition".
 * Uses the brand's own artwork, keyed to transparency and tone-matched
 * to its background.
 */
export function Logo({
  className,
  size = "md",
  tone = "dark",
  href = "/",
  priority = false,
}: LogoProps) {
  const image = (
    <Image
      src={sources[tone]}
      alt="MEHRAB — Elevate Tradition"
      width={INTRINSIC.width}
      height={INTRINSIC.height}
      priority={priority}
      unoptimized
      className={cn("w-auto", heights[size], className)}
    />
  );

  if (href === null) return image;

  return (
    <Link href={href} aria-label="MEHRAB — home" className="inline-flex">
      {image}
    </Link>
  );
}
