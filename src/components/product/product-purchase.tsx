"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Heart, Minus, Plus, Share2, Truck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useMounted } from "@/hooks/use-mounted";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductPurchase({ product }: { product: Product }) {
  const mounted = useMounted();
  const addItem = useCart((s) => s.addItem);
  const inWishlist = useWishlist((s) => s.ids.includes(product.id));
  const toggleWishlist = useWishlist((s) => s.toggle);

  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const addBtnRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  // Reveal the sticky mobile bar once the inline button scrolls out of view.
  useEffect(() => {
    const el = addBtnRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { rootMargin: "0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const discount = product.compareAtPrice
    ? discountPercent(product.compareAtPrice, product.price)
    : 0;

  const handleAdd = () => {
    if (!product.inStock) return;
    if (!size) {
      setSizeError(true);
      toast.error("Please select a size");
      document
        .getElementById("size-selector")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0].url,
      price: product.price,
      size: size as never,
      color,
      quantity: qty,
    });
    toast.success(`${product.name} added to your bag`, {
      description: `${color} · Size ${size} · Qty ${qty}`,
    });
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* user dismissed share sheet — no-op */
    }
  };

  return (
    <>
      <div className="flex flex-col">
        {/* Title + price */}
        <div>
          {product.badges?.includes("Best Seller") && (
            <Badge variant="soft" className="mb-3">
              Best Seller
            </Badge>
          )}
          <h1 className="font-serif text-3xl leading-tight md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {product.subtitle}
          </p>
          <div className="mt-3">
            <StarRating
              rating={product.rating}
              count={product.reviewCount}
              showValue
            />
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-serif text-2xl">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <Badge variant="sale">-{discount}%</Badge>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Inclusive of all taxes
          </p>
        </div>

        {/* Colour */}
        {product.colors.length > 0 && (
          <div className="mt-7">
            <div className="mb-2.5 flex items-center gap-2 text-sm">
              <span className="font-medium">Colour</span>
              <span className="text-muted-foreground">— {color}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  title={c.name}
                  className={cn(
                    "grid size-9 place-items-center rounded-full border p-0.5 transition-all",
                    color === c.name
                      ? "border-brass ring-1 ring-brass"
                      : "border-border hover:border-brass"
                  )}
                >
                  <span
                    className="block size-full rounded-full"
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size */}
        <div id="size-selector" className="mt-7">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-sm font-medium">
              Size{" "}
              {sizeError && !size && (
                <span className="text-destructive">— required</span>
              )}
            </span>
            <Link
              href="/size-guide"
              className="link-underline text-xs text-muted-foreground"
            >
              Size guide
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSize(s);
                  setSizeError(false);
                }}
                aria-pressed={size === s}
                className={cn(
                  "grid h-11 min-w-11 place-items-center rounded-md border px-3 text-sm font-medium transition-colors",
                  size === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input text-foreground hover:border-brass",
                  sizeError && !size && "border-destructive/60"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity + actions */}
        <div ref={addBtnRef} className="mt-7 flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex items-center rounded-md border border-input">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid size-11 place-items-center text-muted-foreground hover:text-foreground"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                aria-label="Increase quantity"
                className="grid size-11 place-items-center text-muted-foreground hover:text-foreground"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <Button
              onClick={handleAdd}
              size="lg"
              className="flex-1"
              disabled={!product.inStock}
            >
              {product.inStock ? "Add to Bag" : "Sold Out"}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-12 px-0"
              onClick={() => toggleWishlist(product.id)}
              aria-label="Add to wishlist"
              aria-pressed={mounted ? inWishlist : undefined}
            >
              <Heart
                className={cn(
                  "size-5",
                  mounted && inWishlist && "fill-brass text-brass"
                )}
              />
            </Button>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 self-start text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Share2 className="size-3.5" />
            Share
          </button>
        </div>

        {/* Stock + delivery reassurance */}
        <div className="mt-6 space-y-2 rounded-lg border border-border bg-secondary/40 p-4 text-sm">
          <p className="flex items-center gap-2">
            <Check className="size-4 text-brass" />
            {product.inStock ? (
              <span>In stock — ready to ship</span>
            ) : (
              <span className="text-muted-foreground">
                Currently out of stock
              </span>
            )}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Truck className="size-4 text-brass" />
            Free express shipping over Rs 15,000 · COD available
          </p>
        </div>
      </div>

      {/* Sticky mobile add-to-cart */}
      <div
        className={cn(
          "fixed inset-x-0 z-30 border-t border-border bg-background/95 px-5 py-3 backdrop-blur-md transition-transform duration-300 ease-luxe lg:hidden",
          showSticky ? "translate-y-0" : "translate-y-full"
        )}
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 3.75rem)" }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">{product.name}</p>
            <p className="text-sm font-medium tabular-nums">
              {formatPrice(product.price)}
            </p>
          </div>
          <Button
            onClick={handleAdd}
            className="ml-auto flex-1"
            disabled={!product.inStock}
          >
            {product.inStock ? "Add to Bag" : "Sold Out"}
          </Button>
        </div>
      </div>
    </>
  );
}
