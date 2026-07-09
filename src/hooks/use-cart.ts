"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  /** Coupon code applied at cart level (validated server-side later). */
  coupon: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  clear: () => void;
  setCoupon: (code: string | null) => void;
  openCart: () => void;
  closeCart: () => void;
  setOpen: (open: boolean) => void;
}

/** Match an item by its full variant identity. */
const sameLine = (
  a: CartItem,
  productId: string,
  size: string,
  color: string
) => a.productId === productId && a.size === size && a.color === color;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      coupon: null,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, item.productId, item.size, item.color)
          );
          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.size, item.color)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { isOpen: true, items: [...state.items, item] };
        }),

      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !sameLine(i, productId, size, color)
          ),
        })),

      updateQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => !sameLine(i, productId, size, color))
              : state.items.map((i) =>
                  sameLine(i, productId, size, color) ? { ...i, quantity } : i
                ),
        })),

      clear: () => set({ items: [], coupon: null }),
      setCoupon: (code) => set({ coupon: code }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: "mehrab-cart",
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
    }
  )
);

/* ── Derived selectors ─────────────────────────────────────── */

export const selectCartCount = (s: CartState) =>
  s.items.reduce((n, i) => n + i.quantity, 0);

export const selectSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
