"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useShopParams } from "@/hooks/use-shop-params";
import { cn } from "@/lib/utils";

/** Numeric pagination. Uses URL param `page`; scrolls to top on change. */
export function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const { setValue } = useShopParams();
  if (totalPages <= 1) return null;

  const go = (p: number) => {
    setValue("page", p <= 1 ? null : String(p));
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Compact page window around the current page.
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex items-center justify-center gap-1.5"
    >
      <PagerButton
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </PagerButton>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <PagerButton
            key={p}
            active={p === page}
            onClick={() => go(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </PagerButton>
        )
      )}

      <PagerButton
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </PagerButton>
    </nav>
  );
}

function PagerButton({
  children,
  active,
  disabled,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid h-10 min-w-10 place-items-center rounded-md px-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40",
        active
          ? "bg-primary text-primary-foreground"
          : "border border-input text-foreground hover:border-brass"
      )}
      {...props}
    >
      {children}
    </button>
  );
}
