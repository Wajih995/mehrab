import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CircleX,
  Package,
  PackageCheck,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import type { OrderRecord, OrderStatus } from "@/lib/orders-shared";

/** Timeline steps in fulfilment order (Cancelled is rendered separately). */
const STEPS: { status: OrderStatus; label: string; icon: typeof Check }[] = [
  { status: "Confirmed", label: "Confirmed", icon: Check },
  { status: "Packed", label: "Packed", icon: Package },
  { status: "Shipped", label: "On the way", icon: Truck },
  { status: "Delivered", label: "Delivered", icon: PackageCheck },
];

const HEADLINE: Record<OrderStatus, (name: string) => string> = {
  Confirmed: (n) => `Thank you, ${n}`,
  Packed: (n) => `Almost ready, ${n}`,
  Shipped: (n) => `It's on the way, ${n}`,
  Delivered: (n) => `Delivered — enjoy, ${n}`,
  Cancelled: (n) => `Order cancelled, ${n}`,
};

const STATUS_LINE: Record<OrderStatus, string> = {
  Confirmed: "is confirmed and our atelier is preparing it.",
  Packed: "is packed and ready to leave our atelier.",
  Shipped: "is with the courier — please keep the amount ready.",
  Delivered: "has been delivered. Free size exchange within 7 days.",
  Cancelled: "has been cancelled. Nothing is payable.",
};

/**
 * Live order status + summary. Rendered on the server from the same order
 * store the admin panel writes to, so a status change in admin is visible
 * to the customer on their next visit or refresh.
 */
export function OrderConfirmation({ order }: { order: OrderRecord }) {
  const firstName = order.fullName.split(" ")[0];
  const cancelled = order.status === "Cancelled";
  const reached = STEPS.findIndex((s) => s.status === order.status);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Hero */}
      <div className="flex flex-col items-center text-center">
        <div
          className={
            cancelled
              ? "grid size-16 place-items-center rounded-full bg-destructive/10 text-destructive"
              : "grid size-16 place-items-center rounded-full bg-brass/15 text-brass"
          }
        >
          {cancelled ? (
            <CircleX className="size-8" strokeWidth={2.5} />
          ) : (
            <Check className="size-8" strokeWidth={2.5} />
          )}
        </div>
        <p className="eyebrow mt-6">Order {order.status.toLowerCase()}</p>
        <h1 className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
          {HEADLINE[order.status](firstName)}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your order{" "}
          <span className="font-medium text-foreground">
            {order.orderNumber}
          </span>{" "}
          {STATUS_LINE[order.status]}
        </p>
      </div>

      {/* Timeline — driven by the live status */}
      {!cancelled && (
        <div className="mt-10 grid grid-cols-4 gap-2 text-center">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const active = i <= reached;
            return (
              <div key={step.status} className="flex flex-col items-center gap-2">
                <div
                  className={
                    active
                      ? "grid size-10 place-items-center rounded-full bg-brass text-brass-foreground"
                      : "grid size-10 place-items-center rounded-full border border-border text-muted-foreground"
                  }
                >
                  <Icon className="size-4" />
                </div>
                <span
                  className={
                    active
                      ? "text-2xs font-medium uppercase tracking-wide2 text-foreground"
                      : "text-2xs uppercase tracking-wide2 text-muted-foreground"
                  }
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

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
              key={`${item.slug}-${item.size}-${item.color}`}
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
                  {item.color} · Size {item.size}
                  {item.bottomStyle && ` · ${item.bottomStyle}`} · Qty{" "}
                  {item.quantity}
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
          <Row label="Delivery">
            {order.totals.freeShipping
              ? "Free"
              : formatPrice(order.totals.shipping)}
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

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href="/shop">Continue shopping</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Need help?</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{children}</span>
    </div>
  );
}
