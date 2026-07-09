"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShopParams } from "@/hooks/use-shop-params";
import { SORT_OPTIONS } from "@/lib/shop";

export function SortSelect() {
  const { searchParams, setValue } = useShopParams();
  const current = searchParams.get("sort") ?? "featured";

  return (
    <Select
      value={current}
      onValueChange={(v) => setValue("sort", v === "featured" ? null : v)}
    >
      <SelectTrigger className="h-10 w-[180px]" aria-label="Sort products">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
