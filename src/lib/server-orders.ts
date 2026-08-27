import "server-only";

import { loadJson, saveJson } from "@/lib/server-persist";
import type { OrderRecord, OrderStatus } from "@/lib/orders-shared";

/**
 * Server-side order store for DEMO mode (no DATABASE_URL).
 *
 * Orders MUST live on the server — a customer places an order in their
 * browser, and the admin reads it from a different one — so the client
 * zustand store alone can never work. Mirrors server-catalogue.ts:
 * one shared array on `globalThis`, mirrored to `.data/orders.json` so
 * orders survive dev-server restarts. With DATABASE_URL set, Prisma is
 * used instead and this module is never touched.
 */
const globalForOrders = globalThis as unknown as {
  __mehrabOrders?: OrderRecord[];
};

function ensure(): OrderRecord[] {
  if (!globalForOrders.__mehrabOrders) {
    globalForOrders.__mehrabOrders = loadJson<OrderRecord[]>("orders") ?? [];
  }
  return globalForOrders.__mehrabOrders;
}

function persist(): void {
  saveJson("orders", ensure());
}

export function readOrders(): OrderRecord[] {
  return ensure();
}

export function findOrder(orderNumber: string): OrderRecord | null {
  return ensure().find((o) => o.orderNumber === orderNumber) ?? null;
}

export function addOrder(order: OrderRecord): void {
  ensure().unshift(order);
  persist();
}

export function setOrderStatus(
  orderNumber: string,
  status: OrderStatus
): boolean {
  const order = ensure().find((o) => o.orderNumber === orderNumber);
  if (!order) return false;
  order.status = status;
  persist();
  return true;
}
