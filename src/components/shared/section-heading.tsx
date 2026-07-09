import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { label: string; href: string };
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-serif text-3xl leading-[1.1] tracking-tight md:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        )}
      </div>

      {link && (
        <Link
          href={link.href}
          className="link-underline inline-flex shrink-0 items-center gap-1.5 text-2xs font-medium uppercase tracking-wide2 text-foreground"
        >
          {link.label}
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
