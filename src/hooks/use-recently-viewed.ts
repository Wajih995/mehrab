"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedState {
  ids: string[];
  /** Record a product view, most-recent first, capped and de-duped. */
  add: (productId: string) => void;
  clear: () => void;
}

const MAX = 8;

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      ids: [],
      add: (productId) =>
        set((state) => ({
          ids: [productId, ...state.ids.filter((id) => id !== productId)].slice(
            0,
            MAX
          ),
        })),
      clear: () => set({ ids: [] }),
    }),
    { name: "mehrab-recently-viewed" }
  )
);
