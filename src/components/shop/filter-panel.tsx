"use client";

import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useShopParams } from "@/hooks/use-shop-params";
import { formatPrice, cn } from "@/lib/utils";
import type { Facets } from "@/lib/shop";

interface FilterPanelProps {
  facets: Facets;
  /** Hide the collection group (e.g. when already on a collection page). */
  hideCollections?: boolean;
}

export function FilterPanel({ facets, hideCollections }: FilterPanelProps) {
  const { searchParams, getList, toggleValue, setValue } = useShopParams();

  const groups = [
    { key: "fabric", label: "Fabric", values: facets.fabrics },
    { key: "season", label: "Season", values: facets.seasons },
    ...(hideCollections
      ? []
      : [
          {
            key: "collection",
            label: "Collection",
            values: facets.collections.map((c) => c.slug),
            labels: Object.fromEntries(
              facets.collections.map((c) => [c.slug, c.name])
            ),
          },
        ]),
  ];

  const defaultOpen = ["price", "fabric", "size", "color"];

  return (
    <Accordion type="multiple" defaultValue={defaultOpen} className="w-full">
      {/* Price — hidden when the catalogue has no price spread */}
      {facets.priceRange[0] < facets.priceRange[1] && (
        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <PriceFilter range={facets.priceRange} />
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Checkbox groups */}
      {groups.map((group) => {
        const selected = getList(group.key);
        return (
          <AccordionItem key={group.key} value={group.key}>
            <AccordionTrigger>{group.label}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {group.values.map((value) => {
                  const id = `${group.key}-${value}`;
                  const label =
                    "labels" in group && group.labels
                      ? group.labels[value]
                      : value;
                  return (
                    <div key={value} className="flex items-center gap-2.5">
                      <Checkbox
                        id={id}
                        checked={selected.includes(value)}
                        onCheckedChange={() => toggleValue(group.key, value)}
                      />
                      <Label
                        htmlFor={id}
                        className="cursor-pointer font-normal text-muted-foreground"
                      >
                        {label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}

      {/* Size */}
      <AccordionItem value="size">
        <AccordionTrigger>Size</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((size) => {
              const active = getList("size").includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleValue("size", size)}
                  aria-pressed={active}
                  className={cn(
                    "grid h-9 min-w-9 place-items-center rounded-md border px-2 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input text-foreground hover:border-brass"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Color */}
      <AccordionItem value="color">
        <AccordionTrigger>Colour</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-2.5">
            {facets.colors.map((color) => {
              const active = getList("color").includes(color.name);
              return (
                <button
                  key={color.name}
                  onClick={() => toggleValue("color", color.name)}
                  aria-pressed={active}
                  aria-label={color.name}
                  title={color.name}
                  className={cn(
                    "size-8 rounded-full border p-0.5 transition-all",
                    active
                      ? "border-brass ring-1 ring-brass"
                      : "border-border hover:border-brass"
                  )}
                >
                  <span
                    className="block size-full rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Availability */}
      <AccordionItem value="availability">
        <AccordionTrigger>Availability</AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="availability-in-stock"
              checked={searchParams.get("availability") === "in-stock"}
              onCheckedChange={(c) =>
                setValue("availability", c ? "in-stock" : null)
              }
            />
            <Label
              htmlFor="availability-in-stock"
              className="cursor-pointer font-normal text-muted-foreground"
            >
              In stock only
            </Label>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/** Dual-thumb price slider that commits both bounds in one navigation. */
function PriceFilter({ range }: { range: [number, number] }) {
  const { searchParams, setMany } = useShopParams();
  const [min, max] = range;
  const urlMin = Number(searchParams.get("min")) || min;
  const urlMax = Number(searchParams.get("max")) || max;
  const [local, setLocal] = useState<[number, number]>([urlMin, urlMax]);

  // Keep local slider synced when the URL changes elsewhere (e.g. clear all).
  useEffect(() => {
    setLocal([urlMin, urlMax]);
  }, [urlMin, urlMax]);

  const commit = ([lo, hi]: number[]) => {
    setMany({
      min: lo > min ? String(lo) : null,
      max: hi < max ? String(hi) : null,
    });
  };

  return (
    <div className="px-3 pt-1">
      <Slider
        value={local}
        min={min}
        max={max}
        step={500}
        minStepsBetweenThumbs={1}
        onValueChange={(v) => setLocal(v as [number, number])}
        onValueCommit={commit}
        aria-label="Price range"
      />
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatPrice(local[0])}</span>
        <span>{formatPrice(local[1])}</span>
      </div>
    </div>
  );
}
