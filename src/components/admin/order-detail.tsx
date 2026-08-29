"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { WhatsAppButton } from "@/components/admin/whatsapp-button";
import { updateOrderStatus } from "@/actions/orders";
import {
  ORDER_STATUSES,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/orders-shared";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  CHART_SIZES,
  CUSTOM_FIELDS,
  type ChartSize,
} from "@/lib/data/size-chart";

/** True when a size has a row in the published size chart. */
function chartMeasurements(size: string): boolean {
  return (CHART_SIZES as readonly string[]).includes(size);
}

export function OrderDetail({ order }: { order: OrderRecord }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleStatus = (status: OrderStatus) =>
    startTransition(async () => {
      const res = await updateOrderStatus(order.orderNumber, status);
      if (res.ok) {
        toast.success(`Order marked as ${status}`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Update failed");
      }
    });

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All orders
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl md:text-3xl">{order.orderNumber}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {formatDate(order.placedAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <WhatsAppButton order={order} />
          <Button asChild variant="outline">
            <Link href={`/admin/orders/${order.orderNumber}/receipt`}>
              <Printer className="size-4" /> Generate bill
            </Link>
          </Button>
          <Select
            value={order.status}
            disabled={pending}
            onValueChange={(v) => handleStatus(v as OrderStatus)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Items */}
        <div className="rounded-xl border border-border bg-background">
          <p className="border-b border-border p-5 font-serif text-lg">
            Items ({order.items.reduce((n, i) => n + i.quantity, 0)})
          </p>
          <ul className="divide-y divide-border">
            {order.items.map((item) => (
              <li key={`${item.slug}-${item.size}-${item.color}`} className="flex gap-4 p-5">
                <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover object-top" />
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    <span className="rounded bg-secondary px-1.5 py-0.5 font-medium text-foreground">
                      Size {item.size}
                    </span>
                    {item.bottomStyle && (
                      <span className="rounded border border-border px-1.5 py-0.5 font-medium text-foreground">
                        {item.bottomStyle}
                      </span>
                    )}
                    <span className="text-muted-foreground">
                      {item.color} · Qty {item.quantity}
                    </span>
                  </p>

                  {/* Standard size → the chart numbers, so the atelier has
                      the same detail a made-to-order line carries. */}
                  {!item.custom && chartMeasurements(item.size) && (
                    <div className="mt-2 rounded-md border border-border bg-secondary/40 p-3">
                      <p className="text-2xs font-medium uppercase tracking-wide2 text-muted-foreground">
                        Standard size {item.size} — chart measurements
                      </p>
                      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-3">
                        {CUSTOM_FIELDS.map((f) => (
                          <div key={f.key} className="flex justify-between gap-2">
                            <dt className="text-muted-foreground">
                              {f.fullLabel}
                            </dt>
                            <dd className="font-medium tabular-nums">
                              {f.values[item.size as ChartSize]}&Prime;
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {item.custom && (
                    <div className="mt-2 rounded-md border border-brass/40 bg-brass/5 p-3">
                      <p className="text-2xs font-medium uppercase tracking-wide2 text-brass">
                        Made to order — cut to these measurements
                      </p>
                      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-3">
                        {CUSTOM_FIELDS.map((f) => (
                          <div key={f.key} className="flex justify-between gap-2">
                            <dt className="text-muted-foreground">
                              {f.fullLabel}
                            </dt>
                            <dd className="font-medium tabular-nums">
                              {item.custom![f.key]}&Prime;
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  <span className="mt-auto pt-2 text-sm font-medium tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-border p-5 text-sm">
            <Row label="Subtotal">{formatPrice(order.totals.subtotal)}</Row>
            {order.totals.discount > 0 && (
              <Row label="Discount">−{formatPrice(order.totals.discount)}</Row>
            )}
            <Row label="Shipping">
              {order.totals.freeShipping ? "Free" : formatPrice(order.totals.shipping)}
            </Row>
            <Separator className="my-2" />
            <Row label="Total" strong>
              {formatPrice(order.totals.total)}
            </Row>
          </div>
        </div>

        {/* Customer */}
        <div className="space-y-4">
          <Panel title="Customer">
            <p className="font-medium">{order.fullName}</p>
            <p className="text-muted-foreground">{order.email}</p>
            <p className="text-muted-foreground">{order.phone}</p>
          </Panel>
          <Panel title="Shipping address">
            <p>{order.address}</p>
            <p className="text-muted-foreground">
              {order.city}, {order.province}
            </p>
            {order.notes && (
              <p className="mt-2 text-xs text-muted-foreground">
                Note: {order.notes}
              </p>
            )}
          </Panel>
          <Panel title="Payment">
            <p className="font-medium">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "Card / Wallet"}
            </p>
            {order.couponCode && (
              <p className="mt-1 text-xs text-muted-foreground">
                Coupon: {order.couponCode}
              </p>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
  strong,
}: {
  label: string;
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={strong ? "font-medium" : "text-muted-foreground"}>{label}</span>
      <span className={strong ? "font-serif text-lg" : "font-medium tabular-nums"}>
        {children}
      </span>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 text-sm">
      <p className="mb-2 text-2xs uppercase tracking-wide2 text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}
