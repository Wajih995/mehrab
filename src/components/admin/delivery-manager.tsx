"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveDeliverySettings } from "@/actions/delivery";
import { formatPrice } from "@/lib/utils";
import type { DeliverySettings } from "@/lib/delivery";

type ZoneDraft = { city: string; fee: string };

/**
 * Admin editor for delivery charges.
 *
 * MEHRAB ships from Karachi, so per-city rates matter: a listed city gets
 * its own charge, everything else falls back to the default.
 */
export function DeliveryManager({
  initial,
}: {
  initial: DeliverySettings;
}) {
  const router = useRouter();
  const [defaultFee, setDefaultFee] = useState(String(initial.defaultFee));
  const [threshold, setThreshold] = useState(
    String(initial.freeShippingThreshold)
  );
  const [zones, setZones] = useState<ZoneDraft[]>(() =>
    initial.zones.map((z) => ({ city: z.city, fee: String(z.fee) }))
  );
  const [pending, startTransition] = useTransition();

  const patchZone = (i: number, patch: Partial<ZoneDraft>) =>
    setZones((prev) => prev.map((z, n) => (n === i ? { ...z, ...patch } : z)));

  const addZone = () => setZones((prev) => [...prev, { city: "", fee: "" }]);
  const removeZone = (i: number) =>
    setZones((prev) => prev.filter((_, n) => n !== i));

  const handleSave = () => {
    const parsedZones = zones
      .filter((z) => z.city.trim() || z.fee.trim())
      .map((z) => ({ city: z.city.trim(), fee: Number(z.fee) }));

    if (parsedZones.some((z) => !z.city || !Number.isFinite(z.fee))) {
      toast.error("Every city needs a name and a charge");
      return;
    }

    const payload: DeliverySettings = {
      defaultFee: Number(defaultFee),
      freeShippingThreshold: Number(threshold),
      zones: parsedZones,
    };

    if (!Number.isFinite(payload.defaultFee)) {
      toast.error("Enter a default charge");
      return;
    }

    startTransition(async () => {
      const res = await saveDeliverySettings(payload);
      if (res.ok) {
        toast.success("Delivery rates saved");
        router.refresh();
      } else {
        toast.error(res.error ?? "Save failed");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Global rules */}
      <div className="rounded-xl border border-border bg-background p-5">
        <p className="font-serif text-lg">Standard rates</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="default-fee" className="text-xs text-muted-foreground">
              Rest of Pakistan
            </Label>
            <Input
              id="default-fee"
              inputMode="numeric"
              value={defaultFee}
              onChange={(e) => setDefaultFee(e.target.value.replace(/\D/g, ""))}
              className="mt-1"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Charged for any city not listed below.
            </p>
          </div>
          <div>
            <Label htmlFor="threshold" className="text-xs text-muted-foreground">
              Free delivery above
            </Label>
            <Input
              id="threshold"
              inputMode="numeric"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value.replace(/\D/g, ""))}
              className="mt-1"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {Number(threshold) > 0
                ? `Orders of ${formatPrice(Number(threshold))} or more ship free, everywhere.`
                : "Set to 0 to charge delivery on every order."}
            </p>
          </div>
        </div>
      </div>

      {/* Per-city rates */}
      <div className="rounded-xl border border-border bg-background p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-serif text-lg">City rates</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We ship from Karachi — give each city its own charge.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={addZone}>
            <Plus className="size-4" /> Add city
          </Button>
        </div>

        {zones.length === 0 ? (
          <p className="mt-5 text-sm text-muted-foreground">
            No city rates yet — every order uses the default charge.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            <div className="hidden gap-3 px-1 text-2xs uppercase tracking-wide2 text-muted-foreground sm:grid sm:grid-cols-[1fr_160px_44px]">
              <span>City</span>
              <span>Delivery charge</span>
              <span />
            </div>
            {zones.map((z, i) => (
              <div
                key={i}
                className="grid gap-3 sm:grid-cols-[1fr_160px_44px] sm:items-center"
              >
                <Input
                  value={z.city}
                  placeholder="Karachi"
                  aria-label={`City ${i + 1}`}
                  onChange={(e) => patchZone(i, { city: e.target.value })}
                />
                <Input
                  value={z.fee}
                  inputMode="numeric"
                  placeholder="150"
                  aria-label={`Charge for ${z.city || `city ${i + 1}`}`}
                  onChange={(e) =>
                    patchZone(i, { fee: e.target.value.replace(/\D/g, "") })
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${z.city || "city"}`}
                  onClick={() => removeZone(i)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* What the customer will see */}
      <div className="rounded-xl border border-border bg-secondary/30 p-5">
        <p className="flex items-center gap-2 text-2xs uppercase tracking-wide2 text-muted-foreground">
          <Truck className="size-4" /> Customer preview
        </p>
        <ul className="mt-3 space-y-1 text-sm">
          {zones
            .filter((z) => z.city.trim())
            .map((z, i) => (
              <li key={i} className="flex justify-between gap-4">
                <span>{z.city}</span>
                <span className="font-medium tabular-nums">
                  {z.fee ? formatPrice(Number(z.fee)) : "—"}
                </span>
              </li>
            ))}
          <li className="flex justify-between gap-4 border-t border-border pt-1 text-muted-foreground">
            <span>Everywhere else</span>
            <span className="font-medium tabular-nums">
              {formatPrice(Number(defaultFee) || 0)}
            </span>
          </li>
        </ul>
      </div>

      <Button onClick={handleSave} disabled={pending}>
        {pending ? "Saving…" : "Save delivery rates"}
      </Button>
    </div>
  );
}
