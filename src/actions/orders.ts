"use server";

import { revalidatePath } from "next/cache";

import type { OrderStatus as DbOrderStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import { computeTotals, validateCoupon, type OrderTotals } from "@/lib/checkout";
import { placeOrderSchema, type PlaceOrderInput } from "@/lib/validations/checkout";
import { addOrder, setOrderStatus } from "@/lib/server-orders";
import { ORDER_STATUSES, type OrderRecord, type OrderStatus } from "@/lib/orders-shared";
import { sendOrderConfirmationEmail } from "@/lib/notifications/order-confirmation";

export interface PlaceOrderResult {
  ok: boolean;
  orderNumber?: string;
  totals?: OrderTotals;
  placedAt?: string;
  error?: string;
}

function generateOrderNumber(): string {
  const now = new Date();
  const stamp = `${now.getFullYear()}`.slice(2) +
    `${now.getMonth() + 1}`.padStart(2, "0") +
    `${now.getDate()}`.padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MEH-${stamp}-${rand}`;
}

/** Refresh admin surfaces that render order data. */
function revalidateOrders() {
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/[orderNumber]", "page");
}

/**
 * Place an order (COD). Validates input, recomputes totals authoritatively
 * (never trust client-sent prices), persists server-side — Postgres when
 * DATABASE_URL is set, the demo file store otherwise — and returns a
 * confirmation.
 */
export async function placeOrder(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  const parsed = placeOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid order details" };
  }

  const { customer, items } = parsed.data;

  // Authoritative subtotal from server-side line data.
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const couponResult = customer.couponCode
    ? validateCoupon(customer.couponCode, subtotal)
    : null;
  const coupon = couponResult?.ok ? couponResult.coupon : null;
  const totals = computeTotals(subtotal, coupon);
  const orderNumber = generateOrderNumber();
  const placedAt = new Date().toISOString();

  const record: OrderRecord = {
    orderNumber,
    placedAt,
    status: "Confirmed",
    paymentMethod: "cod",
    email: customer.email,
    fullName: `${customer.firstName} ${customer.lastName}`,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    province: customer.province,
    postalCode: customer.postalCode || undefined,
    notes: customer.notes || undefined,
    couponCode: coupon?.code,
    items: items.map((i) => ({ ...i, productId: i.productId ?? null })),
    totals,
  };

  if (isDbConfigured) {
    // Persist the order + line items. Products link where a match exists.
    await prisma.order.create({
      data: {
        orderNumber,
        status: "CONFIRMED",
        paymentMethod: "COD",
        email: customer.email,
        fullName: `${customer.firstName} ${customer.lastName}`,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        province: customer.province,
        postalCode: customer.postalCode || null,
        notes: customer.notes || null,
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        total: totals.total,
        couponCode: coupon?.code ?? null,
        items: {
          create: items.map((i) => ({
            // Snapshot only — avoids FK issues if the product later changes.
            productId: null,
            slug: i.slug,
            name: i.name,
            image: i.image,
            price: i.price,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
          })),
        },
      },
    });
    // TODO(inventory): decrement stock.
  } else {
    // Demo mode — persist to the server-side file store so the order
    // reaches the admin panel (a different browser than the customer's).
    addOrder(record);
  }

  // Notify AFTER the order is safely persisted; never fails the order.
  await sendOrderConfirmationEmail(record);
  // TODO(sms): send the COD confirmation SMS here once a gateway is set up.

  revalidateOrders();
  return { ok: true, orderNumber, totals, placedAt };
}

export interface OrderStatusResult {
  ok: boolean;
  error?: string;
}

/** Update an order's fulfilment status (admin). */
export async function updateOrderStatus(
  orderNumber: string,
  status: OrderStatus
): Promise<OrderStatusResult> {
  if (!ORDER_STATUSES.includes(status)) {
    return { ok: false, error: "Unknown status." };
  }
  try {
    if (!isDbConfigured) {
      if (!setOrderStatus(orderNumber, status)) {
        return { ok: false, error: "Order not found." };
      }
    } else {
      await prisma.order.update({
        where: { orderNumber },
        data: { status: status.toUpperCase() as DbOrderStatus },
      });
    }
    revalidateOrders();
    return { ok: true };
  } catch (err) {
    console.error("updateOrderStatus failed", err);
    return { ok: false, error: "Could not update the order." };
  }
}
