"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OrderSummary } from "@/components/cart/order-summary";
import { useCart } from "@/hooks/use-cart";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice } from "@/lib/utils";

export function CartPageView() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  // Avoid a hydration flash of the empty state before the store rehydrates.
  if (!mounted) {
    return <div className="min-h-[40vh]" />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-secondary text-muted-foreground">
          <ShoppingBag className="size-7" />
        </div>
        <h1 className="mt-5 font-serif text-2xl">Your bag is empty</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Discover our latest arrivals and signature pieces.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/shop">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
      {/* Line items */}
      <div>
        <ul className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex gap-4 py-5 sm:gap-6"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-28"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="112px"
                  className="object-cover object-top"
                />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium leading-snug hover:text-brass"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.color} · Size {item.size}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      removeItem(item.productId, item.size, item.color)
                    }
                    aria-label={`Remove ${item.name}`}
                    className="h-fit text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-md border border-input">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity - 1
                        )
                      }
                      aria-label="Decrease quantity"
                      className="grid size-9 place-items-center text-muted-foreground hover:text-foreground"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                      aria-label="Increase quantity"
                      className="grid size-9 place-items-center text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="font-medium tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/shop">← Continue shopping</Link>
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary
          footer={
            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          }
        />
        <p className="mt-4 text-center text-2xs uppercase tracking-wide2 text-muted-foreground">
          Secure checkout · Cash on Delivery available
        </p>
      </div>
    </div>
  );
}
