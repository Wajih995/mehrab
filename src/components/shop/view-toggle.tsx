"use client";

import { LayoutGrid, Rows3 } from "lucide-react";

import { useShopParams } from "@/hooks/use-shop-params";
import { cn } from "@/lib/utils";

export function ViewToggle() {
  const { searchParams, setValue } = useShopParams();
  const view = searchParams.get("view") === "list" ? "list" : "grid";

  const options = [
    { value: "grid", icon: LayoutGrid, label: "Grid view" },
    { value: "list", icon: Rows3, label: "List view" },
  ] as const;

  return (
    <div className="hidden items-center rounded-md border border-input sm:flex">
      {options.map((o) => {
        const Icon = o.icon;
        const active = view === o.value;
        return (
          <button
            key={o.value}
            onClick={() => setValue("view", o.value === "grid" ? null : o.value)}
            aria-label={o.label}
            aria-pressed={active}
            className={cn(
              "grid size-10 place-items-center transition-colors first:rounded-l-md last:rounded-r-md",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
