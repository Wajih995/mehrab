import { cn } from "@/lib/utils";

/**
 * An Urdu pull-quote inside an otherwise English page.
 *
 * Carries its own `lang`/`dir` so screen readers switch voice and the text
 * lays out right-to-left, and generous leading because Nastaliq sits much
 * taller than the Latin body face.
 */
export function UrduLine({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      lang="ur"
      dir="rtl"
      className={cn(
        "border-r-2 border-brass/50 pr-4 font-urdu text-foreground/80",
        // Size and leading are paired: a bare `leading-*` is overridden by the
        // line-height that Tailwind's `md:text-base` carries with it.
        "text-sm/[2.4] md:text-base/[2.4]",
        className
      )}
    >
      {children}
    </p>
  );
}
