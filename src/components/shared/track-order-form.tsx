"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Looks an order up by number and opens its confirmation/status page. */
export function TrackOrderForm() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = orderNumber.trim();
    if (n) router.push(`/checkout/confirmation/${encodeURIComponent(n)}`);
  };

  return (
    <form onSubmit={submit} className="max-w-md space-y-3">
      <Label htmlFor="order-number" className="text-xs text-muted-foreground">
        Order number
      </Label>
      <div className="flex gap-2">
        <Input
          id="order-number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="e.g. MHB-240815-1234"
          required
        />
        <Button type="submit">
          <Search className="size-4" /> Track
        </Button>
      </div>
    </form>
  );
}
