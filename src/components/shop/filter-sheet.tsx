"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterPanel } from "@/components/shop/filter-panel";
import { useShopParams } from "@/hooks/use-shop-params";
import type { Facets } from "@/lib/shop";

const FILTER_KEYS = [
  "fabric",
  "season",
  "collection",
  "size",
  "color",
  "min",
  "max",
  "availability",
  "q",
];

/** Mobile/tablet entry point to the filters, in a slide-out sheet. */
export function FilterSheet({
  facets,
  hideCollections,
}: {
  facets: Facets;
  hideCollections?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { searchParams, clearAll } = useShopParams();

  const count = FILTER_KEYS.reduce((n, key) => {
    const v = searchParams.get(key);
    if (!v) return n;
    if (["fabric", "season", "collection", "size", "color"].includes(key))
      return n + v.split(",").filter(Boolean).length;
    return n + 1;
  }, 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="size-4" />
          Filters
          {count > 0 && (
            <span className="ml-1 grid size-5 place-items-center rounded-full bg-brass text-[0.625rem] font-semibold text-brass-foreground">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[88%] max-w-sm p-0">
        <SheetHeader className="border-b">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <FilterPanel facets={facets} hideCollections={hideCollections} />
        </div>
        <SheetFooter className="flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              clearAll();
            }}
          >
            Clear all
          </Button>
          <SheetClose asChild>
            <Button className="flex-1">View results</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
