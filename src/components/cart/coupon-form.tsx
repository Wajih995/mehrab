"use client";

import { useState } from "react";
import { Check, Tag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart, selectSubtotal } from "@/hooks/use-cart";
import { validateCoupon } from "@/lib/checkout";

export function CouponForm() {
  const applied = useCart((s) => s.coupon);
  const setCoupon = useCart((s) => s.setCoupon);
  const subtotal = useCart(selectSubtotal);

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const apply = () => {
    const result = validateCoupon(code, subtotal);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
    setCoupon(result.coupon!.code);
    setCode("");
  };

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-md border border-brass/30 bg-brass/10 px-3.5 py-2.5 text-sm">
        <span className="inline-flex items-center gap-2 font-medium">
          <Check className="size-4 text-brass" />
          {applied} applied
        </span>
        <button
          onClick={() => setCoupon(null)}
          aria-label="Remove coupon"
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), apply())}
            placeholder="Promo code"
            className="pl-9 uppercase"
            aria-label="Promo code"
          />
        </div>
        <Button variant="outline" onClick={apply} disabled={!code.trim()}>
          Apply
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      <p className="mt-2 text-2xs text-muted-foreground">
        Try <span className="font-medium">WELCOME10</span> or{" "}
        <span className="font-medium">FREESHIP</span>
      </p>
    </div>
  );
}
