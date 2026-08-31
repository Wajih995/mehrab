"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { selectSubtotal, cartLineKey, useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

/** Global slide-out cart, driven by the Zustand store's `isOpen`. */
export function CartDrawer() {
  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isOpen);
  const setOpen = useCart((s) => s.setOpen);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart(selectSubtotal);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="p-0">
        <SheetHeader className="flex-row items-center justify-between border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            Your Bag
            <span className="text-sm font-normal text-muted-foreground">
              ({items.reduce((n, i) => n + i.quantity, 0)})
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyCart onClose={() => setOpen(false)} />
        ) : (
          <>

            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {items.map((item) => (
                <li key={cartLineKey(item)} className="flex gap-4 py-5">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative aspect-[3/4] h-28 shrink-0 overflow-hidden rounded-md bg-muted"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-medium leading-snug hover:text-brass"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.color} · {item.size}
                          {item.bottomStyle && ` · ${item.bottomStyle}`}
                          {item.custom && (
                            <span className="mt-0.5 block text-2xs text-brass">
                              Made to order
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(cartLineKey(item))}
                        aria-label={`Remove ${item.name}`}
                        className="h-fit text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-input">
                        <button
                          onClick={() => updateQuantity(cartLineKey(item), item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="grid size-8 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(cartLineKey(item), item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="grid size-8 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-medium tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <SheetFooter>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-serif text-lg">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-2xs uppercase tracking-wide2 text-muted-foreground">
                Shipping &amp; taxes calculated at checkout
              </p>
              <Button asChild size="lg" className="mt-1 w-full">
                <Link href="/checkout" onClick={() => setOpen(false)}>
                  Proceed to Checkout
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full"
              >
                <Link href="/cart" onClick={() => setOpen(false)}>
                  View full bag
                </Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-secondary text-muted-foreground">
        <ShoppingBag className="size-7" />
      </div>
      <div>
        <p className="font-serif text-lg">Your bag is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover our latest arrivals and signature pieces.
        </p>
      </div>
      <Button asChild onClick={onClose} className="mt-2">
        <Link href="/shop">Start shopping</Link>
      </Button>
    </div>
  );
}
