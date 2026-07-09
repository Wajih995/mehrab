"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Helpers for reading and mutating the shop's URL-based filter state.
 * Every mutation resets pagination to page 1 (except paging itself).
 */
export function useShopParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const commit = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  /** Current comma-list values for a multi-select key. */
  const getList = useCallback(
    (key: string) =>
      (searchParams.get(key) ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    [searchParams]
  );

  /** Add/remove a single value within a multi-select key. */
  const toggleValue = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      const current = getList(key);
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (updated.length) next.set(key, updated.join(","));
      else next.delete(key);
      next.delete("page");
      commit(next);
    },
    [commit, getList, searchParams]
  );

  /** Set (or clear when empty) a single-value key. */
  const setValue = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
      if (key !== "page") next.delete("page");
      commit(next);
    },
    [commit, searchParams]
  );

  /** Set several keys at once in a single navigation (null clears a key). */
  const setMany = useCallback(
    (entries: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(entries)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      next.delete("page");
      commit(next);
    },
    [commit, searchParams]
  );

  /** Remove specific keys entirely. */
  const clearKeys = useCallback(
    (keys: string[]) => {
      const next = new URLSearchParams(searchParams.toString());
      keys.forEach((k) => next.delete(k));
      next.delete("page");
      commit(next);
    },
    [commit, searchParams]
  );

  /** Clear all filters, preserving view + sort. */
  const clearAll = useCallback(() => {
    const next = new URLSearchParams();
    const view = searchParams.get("view");
    const sort = searchParams.get("sort");
    if (view) next.set("view", view);
    if (sort) next.set("sort", sort);
    commit(next);
  }, [commit, searchParams]);

  return {
    searchParams,
    getList,
    toggleValue,
    setValue,
    setMany,
    clearKeys,
    clearAll,
  };
}
