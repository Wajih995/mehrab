"use client";

import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ORDER_STATUSES, type OrderRecord } from "@/lib/orders-shared";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import type { Product } from "@/types";

export function DashboardOverview({
  products,
  orders,
}: {
  products: Product[];
  orders: OrderRecord[];
}) {
  const active = orders.filter((o) => o.status !== "Cancelled");
  const revenue = active.reduce((sum, o) => sum + o.totals.total, 0);
  const outOfStock = products.filter((p) => !p.inStock);
  const avgOrder = active.length ? Math.round(revenue / active.length) : 0;

  const stats: { label: string; value: string; icon: LucideIcon; hint?: string }[] = [
    { label: "Revenue", value: formatPrice(revenue), icon: TrendingUp, hint: "Excl. cancelled" },
    { label: "Orders", value: String(orders.length), icon: ShoppingBag },
    { label: "Products", value: String(products.length), icon: Package },
    {
      label: "Out of stock",
      value: String(outOfStock.length),
      icon: AlertTriangle,
      hint: outOfStock.length ? "Needs attention" : "All in stock",
    },
  ];

  const statusCounts = ORDER_STATUSES.map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }));
  const maxCount = Math.max(1, ...statusCounts.map((s) => s.count));

  const recent = orders.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-background p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide2 text-muted-foreground">
                  {s.label}
                </span>
                <Icon className="size-4 text-brass" />
              </div>
              <p className="mt-3 font-serif text-2xl md:text-3xl">{s.value}</p>
              {s.hint && (
                <p className="mt-1 text-2xs text-muted-foreground">{s.hint}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <div className="rounded-xl border border-border bg-background lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-serif text-lg">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-medium text-brass hover:underline"
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No orders yet. Place a test order from the storefront to see it here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((o) => (
                <li key={o.orderNumber}>
                  <Link
                    href={`/admin/orders/${o.orderNumber}`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {o.orderNumber}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {o.fullName} · {formatDate(o.placedAt)}
                      </p>
                    </div>
                    <OrderStatusBadge status={o.status} />
                    <span className="w-24 text-right text-sm font-medium tabular-nums">
                      {formatPrice(o.totals.total)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Orders by status */}
        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="font-serif text-lg">Orders by status</h2>
          <div className="mt-5 space-y-3">
            {statusCounts.map((s) => (
              <div key={s.status}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{s.status}</span>
                  <span className="font-medium tabular-nums">{s.count}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-brass transition-all"
                    style={{ width: `${(s.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
            Avg. order value{" "}
            <span className="font-medium text-foreground">
              {formatPrice(avgOrder)}
            </span>
          </div>
        </div>
      </div>

      {/* Inventory alerts */}
      {outOfStock.length > 0 && (
        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-lg">
            <AlertTriangle className="size-4 text-destructive" /> Inventory alerts
          </h2>
          <ul className="flex flex-wrap gap-2">
            {outOfStock.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/products/${p.id}`}>
                  <Badge variant="outline" className="hover:border-brass">
                    {p.name} — out of stock
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
