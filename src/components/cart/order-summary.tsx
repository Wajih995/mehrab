"use client";

import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import { CouponForm } from "@/components/cart/coupon-form";
import { useCart, selectSubtotal } from "@/hooks/use-cart";
import { useMounted } from "@/hooks/use-mounted";
import { computeTotals, validateCoupon } from "@/lib/checkout";
import {
  DEFAULT_DELIVERY,
  deliveryFeeFor,
  findZone,
  type DeliverySettings,
} from "@/lib/delivery";
import { formatPrice } from "@/lib/utils";

interface OrderSummaryProps {
  /** Show the coupon entry (cart page) vs. read-only (checkout). */
  editableCoupon?: boolean;
  /** CTA rendered under the totals (e.g. checkout button). */
  footer?: ReactNode;
  title?: string;
  /** Live delivery rates from the admin panel. */
  delivery?: DeliverySettings;
  /** Destination city, once the customer has entered one. */
  city?: string;
}

/** Order totals panel — shared by the cart page and checkout. */
export function OrderSummary({
  editableCoupon = true,
  footer,
  title = "Order Summary",
  delivery = DEFAULT_DELIVERY,
  city,
}: OrderSummaryProps) {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.coupon);
  const subtotal = useCart(selectSubtotal);

  const coupon =
    couponCode && validateCoupon(couponCode, subtotal).ok
      ? validateCoupon(couponCode, subtotal).coupon
      : null;
  const zone = findZone(city, delivery);
  const totals = computeTotals(
    subtotal,
    coupon,
    deliveryFeeFor(city, delivery),
    delivery
  );

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-serif text-xl">{title}</h2>

      {editableCoupon && (
        <div className="mt-5">
          <CouponForm />
        </div>
      )}

      <div className="mt-5 space-y-3 text-sm">
        <Row label={`Subtotal (${items.reduce((n, i) => n + i.quantity, 0)} items)`}>
          {mounted ? formatPrice(totals.subtotal) : "—"}
        </Row>
        {totals.discount > 0 && (
          <Row label="Discount" accent>
            −{formatPrice(totals.discount)}
          </Row>
        )}
        <Row label={zone ? `Delivery — ${zone.city}` : "Delivery"}>
          {totals.freeShipping ? (
            <span className="text-brass">Free</span>
          ) : mounted ? (
            formatPrice(totals.shipping)
          ) : (
            "—"
          )}
        </Row>
        {!totals.freeShipping && !zone && mounted && (
          <p className="text-xs text-muted-foreground">
            Standard rate — enter your city at checkout for the exact charge.
          </p>
        )}
      </div>

      <Separator className="my-4" />

      <div className="flex items-baseline justify-between">
        <span className="font-medium">Total</span>
        <span className="font-serif text-2xl">
          {mounted ? formatPrice(totals.total) : "—"}
        </span>
      </div>
      <p className="mt-1 text-2xs text-muted-foreground">
        Inclusive of all taxes
      </p>

      {footer && <div className="mt-5">{footer}</div>}
    </div>
  );
}

function Row({
  label,
  children,
  accent,
}: {
  label: string;
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "font-medium text-brass" : "font-medium tabular-nums"}>
        {children}
      </span>
    </div>
  );
}
