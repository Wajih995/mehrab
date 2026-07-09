"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import {
  useOrders,
  ORDER_STATUSES,
  type OrderStatus,
} from "@/hooks/use-orders";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice, formatDate } from "@/lib/utils";

export function OrderDetail({ orderNumber }: { orderNumber: string }) {
  const mounted = useMounted();
  const order = useOrders((s) => s.orders.find((o) => o.orderNumber === orderNumber));
  const updateStatus = useOrders((s) => s.updateStatus);

  if (!mounted) return <div className="min-h-[40vh]" />;

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="font-serif text-2xl">Order not found</p>
        <Link href="/admin/orders" className="mt-3 inline-block text-sm text-brass hover:underline">
          ← Back to orders
        </Link>
      </div>
    );
  }

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
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Update status</span>
          <Select
            value={order.status}
            onValueChange={(v) => {
              updateStatus(order.orderNumber, v as OrderStatus);
              toast.success(`Order marked as ${v}`);
            }}
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
              <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 p-5">
                <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover object-top" />
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
          </Panel>
          <Panel title="Payment">
            <p className="font-medium">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "Card / Wallet"}
            </p>
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
