import { cn } from "@/lib/utils";

/**
 * Centred brand loader for route-level `loading.tsx` fallbacks — shown while
 * a page's server data is still being fetched.
 *
 * The arch echoes the mehrab the house is named for: two strokes rotating
 * inside a quiet ring, rather than a generic spinner.
 */
export function PageLoader({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center gap-5",
        className
      )}
    >
      <span className="relative grid size-12 place-items-center">
        <span className="absolute inset-0 rounded-full border border-border" />
        <span className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-brass border-r-brass/40" />
        <span className="size-1.5 rounded-full bg-brass/70" />
      </span>
      <span className="text-2xs uppercase tracking-luxe text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
