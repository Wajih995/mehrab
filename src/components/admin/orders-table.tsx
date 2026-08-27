"use client";

import { useState } from "react";
import Link from "next/link";
import { Printer, Search, ShoppingBag } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUSES, type OrderRecord } from "@/lib/orders-shared";
import { formatPrice, formatDate } from "@/lib/utils";

export function OrdersTable({ orders }: { orders: OrderRecord[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

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
                  <th className="px-5 py-3 text-right font-medium">Bill</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr
                    key={o.orderNumber}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/orders/${o.orderNumber}`}
                        className="font-medium text-brass hover:underline"
                      >
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{o.fullName}</p>
                      <p className="text-xs text-muted-foreground">{o.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {formatDate(o.placedAt)}
                    </td>
                    <td className="px-5 py-3.5 uppercase">{o.paymentMethod}</td>
                    <td className="px-5 py-3.5">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium tabular-nums">
                      {formatPrice(o.totals.total)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        aria-label={`Generate bill for ${o.orderNumber}`}
                      >
                        <Link href={`/admin/orders/${o.orderNumber}/receipt`}>
                          <Printer className="size-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-muted-foreground"
                    >
                      No orders match that search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-xl border border-dashed border-border py-16 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-muted-foreground">
        <ShoppingBag className="size-6" />
      </div>
      <p className="mt-4 font-serif text-xl">No orders yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Orders placed through the storefront checkout will appear here.
      </p>
    </div>
  );
}
