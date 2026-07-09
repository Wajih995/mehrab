"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

import { Input } from "@/components/ui/input";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrders, ORDER_STATUSES } from "@/hooks/use-orders";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice, formatDate } from "@/lib/utils";

export function OrdersTable() {
  const mounted = useMounted();
  const orders = useOrders((s) => s.orders);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  if (!mounted) return <div className="min-h-[40vh]" />;

  const filtered = orders.filter((o) => {
    const matchesQ =
      !q ||
      o.orderNumber.toLowerCase().includes(q.toLowerCase()) ||
      o.fullName.toLowerCase().includes(q.toLowerCase()) ||
      o.email.toLowerCase().includes(q.toLowerCase());
    const matchesStatus = status === "all" || o.status === status;
    return matchesQ && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search order #, name or email"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide2 text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((o) => (
                  <tr key={o.orderNumber} className="group transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/orders/${o.orderNumber}`}
                        className="font-medium text-foreground group-hover:text-brass"
                      >
                        {o.orderNumber}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {o.items.reduce((n, i) => n + i.quantity, 0)} items
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{o.fullName}</p>
                      <p className="text-xs text-muted-foreground">{o.city}</p>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {formatDate(o.placedAt)}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {o.paymentMethod === "cod" ? "COD" : "Card"}
                    </td>
                    <td className="px-5 py-3.5">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium tabular-nums">
                      {formatPrice(o.totals.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No orders match your filters.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-20 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-secondary text-muted-foreground">
        <ShoppingBag className="size-6" />
      </div>
      <p className="mt-4 font-serif text-xl">No orders yet</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Orders placed through the storefront checkout will appear here.
      </p>
    </div>
  );
}
