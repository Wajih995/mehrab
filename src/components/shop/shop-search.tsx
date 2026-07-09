"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { useShopParams } from "@/hooks/use-shop-params";

/** Debounced free-text search bound to the `q` URL param. */
export function ShopSearch({ className }: { className?: string }) {
  const { searchParams, setValue } = useShopParams();
  const urlQ = searchParams.get("q") ?? "";
  const [value, setLocal] = useState(urlQ);

  // Sync when the param changes externally (e.g. cleared via chip).
  useEffect(() => setLocal(urlQ), [urlQ]);

  // Debounce writes to the URL.
  useEffect(() => {
    if (value === urlQ) return;
    const id = setTimeout(() => setValue("q", value || null), 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={className}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={value}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="Search shalwar kameez, fabric…"
          aria-label="Search products"
          className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brass focus:ring-1 focus:ring-brass [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            onClick={() => setLocal("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
