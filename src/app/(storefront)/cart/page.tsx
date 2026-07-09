import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CartPageView } from "@/components/cart/cart-page-view";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the pieces in your bag and proceed to checkout.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="container py-8 md:py-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Bag" }]}
        className="mb-6"
      />
      <h1 className="mb-8 font-serif text-3xl leading-tight md:text-4xl">
        Your Bag
      </h1>
      <CartPageView />
    </div>
  );
}
