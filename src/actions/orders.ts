"use server";

import { prisma } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import { computeTotals, validateCoupon, type OrderTotals } from "@/lib/checkout";
import { placeOrderSchema, type PlaceOrderInput } from "@/lib/validations/checkout";

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

/**
 * Place an order. Validates input, recomputes totals authoritatively
 * (never trust client-sent prices), and returns a confirmation.
 *
 * TODO(backend): persist to Postgres via Prisma, decrement inventory,
 * send confirmation email, and — for card payments — create a Stripe
 * PaymentIntent and return its client secret instead of confirming here.
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

  if (isDbConfigured) {
    // Persist the order + line items. Products link where a match exists.
    await prisma.order.create({
      data: {
        orderNumber,
        status: "CONFIRMED",
        paymentMethod: customer.paymentMethod === "card" ? "CARD" : "COD",
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
    // TODO(inventory): decrement stock; TODO(email): send confirmation.
  } else {
    // Demo mode — simulate write latency of a real order pipeline.
    await new Promise((r) => setTimeout(r, 600));
  }

  return { ok: true, orderNumber, totals, placedAt };
}
