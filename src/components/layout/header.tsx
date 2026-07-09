"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Search, ShoppingBag, User } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Button } from "@/components/ui/button";
import { selectCartCount, useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const mounted = useMounted();
  const cartCount = useCart(selectCartCount);
  const openCart = useCart((s) => s.openCart);
  const wishlistCount = useWishlist((s) => s.ids.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300 ease-luxe",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-background"
      )}
    >
      <div className="container flex items-center justify-between gap-4">
        {/* Left cluster */}
        <div className="flex items-center gap-1 lg:flex-1">
          <MobileMenu />
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            asChild
            aria-label="Search"
          >
            <Link href="/search">
              <Search className="size-5" />
            </Link>
          </Button>
        </div>

        {/* Center: logo + nav */}
        <div className="flex items-center gap-10">
          <Logo size="md" priority />
        </div>

        {/* Right cluster */}
        <div className="flex items-center justify-end gap-1 lg:flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            asChild
            aria-label="Search"
          >
            <Link href="/search">
              <Search className="size-5" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            asChild
            aria-label="Account"
          >
            <Link href="/account">
              <User className="size-5" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative hidden sm:inline-flex"
            asChild
            aria-label="Wishlist"
          >
            <Link href="/account/wishlist">
              <Heart className="size-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute right-1 top-1 size-1.5 rounded-full bg-brass" />
              )}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
            aria-label={`Open bag, ${cartCount} items`}
          >
            <ShoppingBag className="size-5" />
            {mounted && cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-[1.15rem] place-items-center rounded-full bg-brass px-1 text-[0.625rem] font-semibold leading-none text-brass-foreground">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Secondary nav row (desktop) */}
      <div className="hidden border-t border-border/60 lg:block">
        <div className="container flex justify-center">
          <DesktopNav />
        </div>
      </div>
    </header>
  );
}
