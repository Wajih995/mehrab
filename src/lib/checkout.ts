import type { Money } from "../types";
import { DEFAULT_DELIVERY, type DeliverySettings } from "./delivery";

/**
 * Legacy flat rate — kept only as a fallback for callers that have no
 * delivery settings to hand. Real pricing comes from the admin-managed
 * rates in `@/lib/delivery`.
 */
export const SHIPPING_FEE: Money = DEFAULT_DELIVERY.defaultFee;
export const FREE_SHIPPING_THRESHOLD: Money =
  DEFAULT_DELIVERY.freeShippingThreshold;

export type CouponType = "percent" | "fixed" | "shipping";

export interface Coupon {
  code: string;
  type: CouponType;
  value: number;
  label: string;
  minSubtotal?: Money;
}

/** Demo coupon book (server-validated later against the DB). */
export const COUPONS: Record<string, Coupon> = {
  WELCOME10: { code: "WELCOME10", type: "percent", value: 10, label: "10% off your first order" },
  MEHRAB500: {
    code: "MEHRAB500",
    type: "fixed",
    value: 500,
    label: "Rs 500 off",
    minSubtotal: 5000,
  },
  FREESHIP: { code: "FREESHIP", type: "shipping", value: 0, label: "Free shipping" },
};

export interface CouponResult {
  ok: boolean;
  coupon?: Coupon;
  message: string;
}

/** Validate a coupon code against the current subtotal. */
export function validateCoupon(code: string, subtotal: Money): CouponResult {
  const coupon = COUPONS[code.trim().toUpperCase()];
  if (!coupon) return { ok: false, message: "That code isn't valid." };
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal)
    return {
      ok: false,
      message: `Spend Rs ${coupon.minSubtotal.toLocaleString()} to use this code.`,
    };
  return { ok: true, coupon, message: coupon.label };
}

export interface OrderTotals {
  subtotal: Money;
  discount: Money;
  shipping: Money;
  total: Money;
  freeShipping: boolean;
}

/**
 * Authoritative totals calculation — shared by cart, checkout, and server.
 *
 * `deliveryFee` is the city's rate (see `deliveryFeeFor`); omit it and the
 * default rate applies. Free-shipping threshold and shipping coupons still
 * override it.
 */
export function computeTotals(
  subtotal: Money,
  coupon?: Coupon | null,
  deliveryFee?: Money,
  settings: DeliverySettings = DEFAULT_DELIVERY
): OrderTotals {
  let discount = 0;
  if (coupon) {
    if (coupon.type === "percent") discount = Math.round((subtotal * coupon.value) / 100);
    else if (coupon.type === "fixed") discount = Math.min(coupon.value, subtotal);
  }

  const threshold = settings.freeShippingThreshold;
  const qualifiesFree =
    (threshold > 0 && subtotal >= threshold) || coupon?.type === "shipping";
  const fee = deliveryFee ?? settings.defaultFee;
  const shipping = subtotal === 0 || qualifiesFree ? 0 : fee;

  return {
    subtotal,
    discount,
    shipping,
    total: Math.max(0, subtotal - discount + shipping),
    freeShipping: qualifiesFree,
  };
}
