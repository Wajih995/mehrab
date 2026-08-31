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
  /** Both take a `cartLineKey(item)` — see the note on that helper. */
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clear: () => void;
  setCoupon: (code: string | null) => void;
  openCart: () => void;
  closeCart: () => void;
  setOpen: (open: boolean) => void;
}

/** Stable signature for a made-to-order fit, so two different sets of
 *  measurements never collapse into one cart line. */
const customKey = (item: Pick<CartItem, "custom">) =>
  item.custom
    ? Object.entries(item.custom)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${v}`)
        .join("|")
    : "";

/**
 * Stable identity for a cart line.
 *
 * Everything that makes two lines distinct on the product page belongs here:
 * size, colour, bottom style and made-to-order measurements. Callers point at
 * a line with this one value rather than re-listing the variant fields, so a
 * new variant field can never leave a line unmatched (and unremovable).
 * Also safe as a React `key`.
 */
export const cartLineKey = (item: CartItem) =>
  [
    item.productId,
    item.size,
    item.color,
    item.bottomStyle ?? "",
    customKey(item),
  ].join("::");

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      coupon: null,

      addItem: (item) =>
        set((state) => {
          const key = cartLineKey(item);
          if (!state.items.some((i) => cartLineKey(i) === key)) {
            return { isOpen: true, items: [...state.items, item] };
          }
          return {
            isOpen: true,
            items: state.items.map((i) =>
              cartLineKey(i) === key
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          };
        }),

      removeItem: (lineKey) =>
        set((state) => ({
          items: state.items.filter((i) => cartLineKey(i) !== lineKey),
        })),

      updateQuantity: (lineKey, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => cartLineKey(i) !== lineKey)
              : state.items.map((i) =>
                  cartLineKey(i) === lineKey ? { ...i, quantity } : i
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
