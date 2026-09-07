"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { PageLoader } from "@/components/shared/page-loader";
import { cn } from "@/lib/utils";

/**
 * Navigation feedback: a full-page loader over the whole viewport plus a
 * brass progress bar across the top, both shown while a page navigation is
 * in flight.
 *
 * App Router exposes no router events, so navigation START is taken from the
 * click that causes it (plus browser back/forward), and navigation END from
 * the committed pathname/search changing.
 *
 * The bar appears on the click itself, with no grace period: prefetched
 * routes commit in a few dozen milliseconds, and a delay long enough to
 * filter those out meant the loader was never seen at all. Instead, once
 * shown it stays for at least MIN_VISIBLE_MS — long enough to read as
 * deliberate feedback rather than a flicker.
 */

/** Once shown, hold the bar at least this long before running it out. */
const MIN_VISIBLE_MS = 500;
/** How long the filled bar takes to fade away. */
const FINISH_MS = 260;
/** Never leave the bar up forever if a navigation is abandoned. */
const SAFETY_MS = 15_000;

type Phase = "idle" | "loading" | "done";

function isPlainLeftClick(e: MouseEvent): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

/** Whether clicking this anchor will actually navigate this tab. */
function navigatesInThisTab(a: HTMLAnchorElement): boolean {
  if (a.target && a.target !== "_self") return false;
  if (a.hasAttribute("download")) return false;

  const href = a.getAttribute("href");
  if (!href || href.startsWith("#")) return false;

  let url: URL;
  try {
    url = new URL(a.href, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;

  // Same page — a hash jump or a no-op link has nothing to wait for.
  return (
    url.pathname !== window.location.pathname ||
    url.search !== window.location.search
  );
}

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [phase, setPhase] = useState<Phase>("idle");
  // Mirrors `phase` synchronously — the settle effect must know the current
  // phase without waiting for a re-render.
  const phaseRef = useRef<Phase>("idle");
  const startedAt = useRef(0);
  const timers = useRef<number[]>([]);

  const to = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const begin = useCallback(() => {
    clearTimers();
    startedAt.current = Date.now();
    to("loading");
    timers.current.push(window.setTimeout(() => to("idle"), SAFETY_MS));
  }, [clearTimers, to]);

  // Navigation committed — run the bar out, but not before it has been on
  // screen long enough to notice.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (phaseRef.current === "idle") return;

    clearTimers();
    const held = Date.now() - startedAt.current;
    timers.current.push(
      window.setTimeout(
        () => {
          to("done");
          timers.current.push(window.setTimeout(() => to("idle"), FINISH_MS));
        },
        Math.max(0, MIN_VISIBLE_MS - held)
      )
    );
  }, [pathname, searchParams, clearTimers, to]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || !isPlainLeftClick(e)) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (anchor && navigatesInThisTab(anchor as HTMLAnchorElement)) begin();
    };
    // Capture phase: React's own handlers may stop propagation.
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", begin);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", begin);
      clearTimers();
    };
  }, [begin, clearTimers]);

  const busy = phase === "loading";

  return (
    <>
      {/* Full-page loader. Covers the viewport so the outgoing page cannot be
          clicked again while the next one is on its way. */}
      <div
        aria-hidden={!busy}
        className={cn(
          "fixed inset-0 z-[65] grid place-items-center bg-background/85 backdrop-blur-[2px]",
          // Appears instantly — feedback must not wait on a transition — and
          // only fades on the way out.
          busy
            ? "opacity-100"
            : "pointer-events-none opacity-0 transition-opacity duration-200 ease-out"
        )}
      >
        {busy && <PageLoader className="min-h-0" />}
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]"
      >
        <div
          className={cn(
            "relative h-full bg-brass",
            phase === "idle" && "w-0 opacity-0",
            // The keyframes drive the width; it eases toward 90% and waits.
            phase === "loading" && "animate-nav-progress opacity-100",
            phase === "done" && "w-full opacity-100",
            phase !== "loading" && "transition-opacity duration-200 ease-out"
          )}
        >
          {/* Brighter leading edge, so the bar reads as moving. */}
          <span className="absolute right-0 top-0 h-full w-16 bg-gradient-to-r from-transparent to-brass shadow-[0_0_10px_2px_theme(colors.brass)]" />
        </div>
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {phase === "loading" ? "Loading page" : ""}
      </span>
    </>
  );
}
