"use client";

import { X } from "lucide-react";

import { useShopParams } from "@/hooks/use-shop-params";
import { formatPrice } from "@/lib/utils";
import type { Facets } from "@/lib/shop";

/** Removable chips summarising the currently applied filters. */
export function ActiveFilters({ facets }: { facets: Facets }) {
  const { searchParams, getList, toggleValue, setValue, clearKeys, clearAll } =
    useShopParams();

  const collectionName = (slug: string) =>
    facets.collections.find((c) => c.slug === slug)?.name ?? slug;

  const chips: { label: string; onRemove: () => void }[] = [];

  const q = searchParams.get("q");
  if (q) chips.push({ label: `"${q}"`, onRemove: () => setValue("q", null) });

  (["fabric", "season", "size", "color"] as const).forEach((key) => {
    getList(key).forEach((v) =>
      chips.push({ label: v, onRemove: () => toggleValue(key, v) })
    );
  });
  getList("collection").forEach((v) =>
    chips.push({
      label: collectionName(v),
      onRemove: () => toggleValue("collection", v),
    })
  );

  const min = searchParams.get("min");
  const max = searchParams.get("max");
  if (min || max)
    chips.push({
      label: `${min ? formatPrice(Number(min)) : "Min"} – ${max ? formatPrice(Number(max)) : "Max"}`,
      onRemove: () => clearKeys(["min", "max"]),
    });

  if (searchParams.get("availability") === "in-stock")
    chips.push({
      label: "In stock",
      onRemove: () => setValue("availability", null),
    });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip, i) => (
        <button
          key={`${chip.label}-${i}`}
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 py-1 pl-3 pr-2 text-xs text-foreground transition-colors hover:border-brass"
        >
          {chip.label}
          <X className="size-3 opacity-60" />
        </button>
      ))}
      <button
        onClick={clearAll}
        className="link-underline text-xs font-medium text-muted-foreground"
      >
        Clear all
      </button>
    </div>
  );
}
