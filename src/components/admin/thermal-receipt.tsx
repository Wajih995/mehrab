"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { CUSTOM_FIELDS } from "@/lib/data/size-chart";
import type { OrderRecord } from "@/lib/orders-shared";

/** "Rs 12,500" without relying on locale availability in the print context. */
function rs(n: number): string {
  return `Rs ${n.toLocaleString("en-PK")}`;
}

/**
 * POS bill for an 80mm thermal printer.
 *
 * The @page rule sizes the paper roll (80mm wide, height grows with
 * content); the sheet itself is 72mm — the printable area of a standard
 * 80mm roll. On screen it shows centred on a grey backdrop with a print
 * toolbar; in print, only the sheet renders.
 */
export function ThermalReceipt({ order }: { order: OrderRecord }) {
  const placed = new Date(order.placedAt);
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="min-h-dvh bg-neutral-200 py-8 print:min-h-0 print:bg-white print:py-0">
      <style>{`@media print { @page { size: 80mm auto; margin: 0; } }`}</style>

      {/* Toolbar — screen only */}
      <div className="mx-auto mb-5 flex w-[72mm] items-center justify-between print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/orders/${order.orderNumber}`}>
            <ArrowLeft className="size-4" /> Order
          </Link>
        </Button>
        <Button size="sm" onClick={() => window.print()}>
          <Printer className="size-4" /> Print bill
        </Button>
      </div>

      {/* The bill */}
      <div className="mx-auto w-[72mm] bg-white px-[4mm] py-[5mm] font-mono text-[10px] leading-[1.45] text-black shadow-md print:mx-0 print:shadow-none">
        {/* Header */}
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- print needs the raw asset, no optimizer */}
          <img
            src="/brand/mark-dark.png"
            alt=""
            className="mx-auto h-10 w-auto"
          />
          <p className="mt-1.5 text-[13px] font-bold tracking-[0.3em]">
            MEHRAB
          </p>
          <p className="text-[8px] uppercase tracking-[0.25em]">
            {siteConfig.tagline}
          </p>
          <p className="mt-2 text-[8px] leading-snug">
            {siteConfig.contact.address}
            <br />
            {siteConfig.contact.phone} · {siteConfig.contact.email}
          </p>
        </div>

        <Rule />

        {/* Order meta */}
        <table className="w-full">
          <tbody>
            <Meta k="Bill / Order" v={order.orderNumber} />
            <Meta
              k="Date"
              v={`${placed.toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}  ${placed.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}`}
            />
            <Meta k="Payment" v="CASH ON DELIVERY" />
            <Meta k="Status" v={order.status.toUpperCase()} />
          </tbody>
        </table>

        <Rule />

        {/* Customer */}
        <p className="font-bold">{order.fullName}</p>
        <p>{order.phone}</p>
        <p>
          {order.address}, {order.city}, {order.province}
          {order.postalCode ? ` ${order.postalCode}` : ""}
        </p>

        <Rule />

        {/* Items */}
        <table className="w-full">
          <thead>
            <tr className="text-left text-[8px] uppercase">
              <th className="pb-1 font-bold">Item</th>
              <th className="pb-1 text-center font-bold">Qty</th>
              <th className="pb-1 text-right font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={`${item.slug}-${item.size}-${item.color}`} className="align-top">
                <td className="py-0.5 pr-1">
                  {item.name}
                  <span className="block text-[8px]">
                    {item.color} / {item.size}
                    {item.bottomStyle ? ` / ${item.bottomStyle}` : ""} @{" "}
                    {rs(item.price)}
                  </span>
                  {item.custom && (
                    <span className="mt-0.5 block border-l-2 border-black pl-1 text-[8px] font-bold">
                      MADE TO ORDER
                      <span className="block font-normal">
                        {CUSTOM_FIELDS.map(
                          (f) => `${f.fullLabel} ${item.custom![f.key]}"`
                        ).join(" · ")}
                      </span>
                    </span>
                  )}
                </td>
                <td className="py-0.5 text-center tabular-nums">
                  {item.quantity}
                </td>
                <td className="py-0.5 text-right tabular-nums">
                  {rs(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Rule />

        {/* Totals */}
        <table className="w-full tabular-nums">
          <tbody>
            <Meta k={`Subtotal (${itemCount} item${itemCount === 1 ? "" : "s"})`} v={rs(order.totals.subtotal)} />
            {order.totals.discount > 0 && (
              <Meta
                k={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`}
                v={`-${rs(order.totals.discount)}`}
              />
            )}
            <Meta
              k="Delivery"
              v={order.totals.freeShipping ? "FREE" : rs(order.totals.shipping)}
            />
          </tbody>
        </table>
        <div className="mt-1 flex items-baseline justify-between border-y border-dashed border-black py-1.5 text-[13px] font-bold">
          <span>TOTAL</span>
          <span className="tabular-nums">{rs(order.totals.total)}</span>
        </div>
        <p className="mt-1 text-center text-[9px] font-bold uppercase">
          To collect on delivery: {rs(order.totals.total)}
        </p>

        <Rule />

        {/* Footer */}
        <div className="text-center text-[8px] leading-snug">
          <p>Free size exchange within 7 days.</p>
          <p>Keep this bill for exchange claims.</p>
          <p className="mt-2 text-[9px] font-bold tracking-widest">
            SHUKRIYA — THANK YOU
          </p>
          <p className="mt-1">{siteConfig.url.replace(/^https?:\/\//, "")}</p>
        </div>
      </div>
    </div>
  );
}

/** Dashed horizontal rule, in the classic receipt idiom. */
function Rule() {
  return <div className="my-2 border-t border-dashed border-black" />;
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <tr>
      <td className="py-px pr-2">{k}</td>
      <td className="py-px text-right font-bold">{v}</td>
    </tr>
  );
}
