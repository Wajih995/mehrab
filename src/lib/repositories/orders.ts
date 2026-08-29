import "server-only";

import { prisma } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import { readOrders, findOrder } from "@/lib/server-orders";
import type { OrderRecord, OrderStatus } from "@/lib/orders-shared";
import type { BottomStyle, CustomMeasurements } from "@/types";

/* ── Prisma → domain mappers ───────────────────────────────── */

type DbOrder = Awaited<ReturnType<typeof queryOrders>>[number];

function queryOrders() {
  return prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

/** "CONFIRMED" → "Confirmed" (DB enum → display status). */
function mapStatus(s: string): OrderStatus {
  return (s.charAt(0) + s.slice(1).toLowerCase()) as OrderStatus;
}

function mapOrder(o: DbOrder): OrderRecord {
  return {
    orderNumber: o.orderNumber,
    placedAt: o.createdAt.toISOString(),
    status: mapStatus(o.status),
    paymentMethod: o.paymentMethod === "CARD" ? "card" : "cod",
    email: o.email,
    fullName: o.fullName,
    phone: o.phone,
    address: o.address,
    city: o.city,
    province: o.province,
    postalCode: o.postalCode ?? undefined,
    notes: o.notes ?? undefined,
    couponCode: o.couponCode ?? undefined,
    items: o.items.map((i) => ({
      productId: i.productId,
      slug: i.slug,
      name: i.name,
      image: i.image,
      price: i.price,
      size: i.size,
      color: i.color,
      quantity: i.quantity,
      bottomStyle: (i.bottomStyle as BottomStyle | null) ?? undefined,
      custom: (i.custom as CustomMeasurements | null) ?? undefined,
    })),
    totals: {
      subtotal: o.subtotal,
      discount: o.discount,
      shipping: o.shipping,
      total: o.total,
      freeShipping: o.shipping === 0 && o.subtotal > 0,
    },
  };
}

/* ── Public read API ───────────────────────────────────────── */

export async function getOrders(): Promise<OrderRecord[]> {
  if (!isDbConfigured) return readOrders();
  return (await queryOrders()).map(mapOrder);
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<OrderRecord | null> {
  if (!isDbConfigured) return findOrder(orderNumber);
  const o = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  return o ? mapOrder(o) : null;
}
