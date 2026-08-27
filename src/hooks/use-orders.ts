"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem } from "@/types";
import type { OrderTotals } from "@/lib/checkout";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders-shared";

export { ORDER_STATUSES, type OrderStatus };

export interface PlacedOrder {
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  paymentMethod: "cod" | "card";
  items: CartItem[];
  totals: OrderTotals;
}

interface OrdersState {
  orders: PlacedOrder[];
  add: (order: Omit<PlacedOrder, "status"> & { status?: OrderStatus }) => void;
  updateStatus: (orderNumber: string, status: OrderStatus) => void;
  getByNumber: (orderNumber: string) => PlacedOrder | undefined;
}

/** Persists placed orders client-side so the confirmation + order-history
 *  pages have data to render before a real backend exists. */
export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      add: (order) =>
        set((state) => ({
          orders: [
            { status: "Confirmed" as const, ...order },
            ...state.orders,
          ].slice(0, 50),
        })),
      updateStatus: (orderNumber, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.orderNumber === orderNumber ? { ...o, status } : o
          ),
        })),
      getByNumber: (orderNumber) =>
        get().orders.find((o) => o.orderNumber === orderNumber),
    }),
    { name: "mehrab-orders" }
  )
);
