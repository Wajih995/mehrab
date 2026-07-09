"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, ShoppingBag, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { selectCartCount, useCart } from "@/hooks/use-cart";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

type Tab =
  | { label: string; href: string; icon: LucideIcon; action?: never }
  | { label: string; icon: LucideIcon; action: "cart"; href?: never };

const tabs: Tab[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: Search },
  { label: "Bag", action: "cart", icon: ShoppingBag },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Account", href: "/account", icon: User },
];

/** Fixed bottom navigation for mobile — a hallmark of app-grade mobile UX. */
export function MobileTabBar() {
  const pathname = usePathname();
  const mounted = useMounted();
  const cartCount = useCart(selectCartCount);
  const openCart = useCart((s) => s.openCart);

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.href
            ? tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href)
            : false;

          const inner = (
            <span className="relative flex flex-col items-center gap-1 py-2.5">
              <Icon
                className={cn(
                  "size-5 transition-colors",
                  active ? "text-brass" : "text-muted-foreground"
                )}
              />
              {tab.action === "cart" && mounted && cartCount > 0 && (
                <span className="absolute right-4 top-1.5 grid min-w-[1rem] place-items-center rounded-full bg-brass px-1 text-[0.5625rem] font-semibold leading-none text-brass-foreground">
                  {cartCount}
                </span>
              )}
              <span
                className={cn(
                  "text-[0.625rem] font-medium tracking-wide",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
            </span>
          );

          return (
            <li key={tab.label}>
              {tab.action === "cart" ? (
                <button
                  onClick={openCart}
                  className="w-full"
                  aria-label={`Open bag, ${cartCount} items`}
                >
                  {inner}
                </button>
              ) : (
                <Link href={tab.href} className="block">
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
