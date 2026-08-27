import type { OrderTotals } from "@/lib/checkout";

/**
 * Order domain shared by server (repository, actions, receipt) and client
 * (admin tables, checkout confirmation). No "use client" here so server
 * modules can import values safely.
 */

export const ORDER_STATUSES = [
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** A purchased line — a snapshot, immune to later product edits. */
export interface OrderLine {
  productId: string | null;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

/** A placed order as the admin panel and receipt see it. */
export interface OrderRecord {
  orderNumber: string;
  placedAt: string; // ISO timestamp
  status: OrderStatus;
  paymentMethod: "cod" | "card";
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  notes?: string;
  couponCode?: string;
  items: OrderLine[];
  totals: OrderTotals;
}
