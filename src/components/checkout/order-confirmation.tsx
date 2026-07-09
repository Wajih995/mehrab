"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Package, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "@/hooks/use-orders";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice, formatDate } from "@/lib/utils";

export function OrderConfirmation({ orderNumber }: { orderNumber: string }) {
  const mounted = useMounted();
  const order = useOrders((s) => s.orders.find((o) => o.orderNumber === orderNumber));

  if (!mounted) return <div className="min-h-[50vh]" />;

  if (!order) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <h1 className="font-serif text-3xl">Order not found</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          We couldn&apos;t find order{" "}
          <span className="font-medium text-foreground">{orderNumber}</span> on
          this device. If you just placed it, check your email for confirmation.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Hero */}
      <div className="flex flex-col items-center text-center">
        <div className="grid size-16 place-items-center rounded-full bg-brass/15 text-brass">
          <Check className="size-8" strokeWidth={2.5} />
        </div>
        <p className="eyebrow mt-6">Order confirmed</p>
        <h1 className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
          Thank you, {order.fullName.split(" ")[0]}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your order{" "}
          <span className="font-medium text-foreground">{order.orderNumber}</span>{" "}
          is confirmed. A receipt is on its way to {order.email}.
        </p>
      </div>

      {/* Timeline */}
      <div className="mt-10 grid grid-cols-3 gap-2 text-center">
        {[
          { icon: Check, label: "Confirmed", active: true },
          { icon: Package, label: "Packed", active: false },
          { icon: Truck, label: "On the way", active: false },
        ].map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={
                  step.active
                    ? "grid size-10 place-items-center rounded-full bg-brass text-brass-foreground"
                    : "grid size-10 place-items-center rounded-full border border-border text-muted-foreground"
                }
              >
                <Icon className="size-4" />
              </div>
              <span className="text-2xs uppercase tracking-wide2 text-muted-foreground">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Order details */}
      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg">Order summary</h2>
          <span className="text-xs text-muted-foreground">
            {formatDate(order.placedAt)}
          </span>
        </div>

        <ul className="mt-5 divide-y divide-border">
          {order.items.map((item) => (
            <li
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex gap-4 py-4"
            >
              <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.color} · Size {item.size} · Qty {item.quantity}
                </p>
                <span className="mt-auto text-sm font-medium tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <Separator className="my-4" />

        <div className="space-y-2 text-sm">
          <Row label="Subtotal">{formatPrice(order.totals.subtotal)}</Row>
          {order.totals.discount > 0 && (
            <Row label="Discount">−{formatPrice(order.totals.discount)}</Row>
          )}
          <Row label="Shipping">
            {order.totals.freeShipping ? "Free" : formatPrice(order.totals.shipping)}
          </Row>
        </div>
        <Separator className="my-4" />
        <div className="flex items-baseline justify-between">
          <span className="font-medium">Total</span>
          <span className="font-serif text-xl">
            {formatPrice(order.totals.total)}
          </span>
        </div>

        <Separator className="my-4" />

        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-2xs uppercase tracking-wide2 text-muted-foreground">
              Delivery to
            </p>
            <p className="mt-1.5 font-medium">{order.fullName}</p>
            <p className="text-muted-foreground">{order.address}</p>
            <p className="text-muted-foreground">
              {order.city}, {order.province}
            </p>
            <p className="text-muted-foreground">{order.phone}</p>
          </div>
          <div>
            <p className="text-2xs uppercase tracking-wide2 text-muted-foreground">
              Payment
            </p>
            <p className="mt-1.5 font-medium">
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Card / Wallet"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href="/shop">Continue shopping</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/account/orders">View my orders</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{children}</span>
    </div>
  );
}
