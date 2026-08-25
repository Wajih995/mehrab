import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { WishlistGrid } from "@/components/shared/wishlist-grid";
import { getProducts } from "@/lib/repositories/products";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved MEHRAB pieces.",
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const products = await getProducts();
  return (
    <div className="container py-10 md:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Wishlist" },
        ]}
        className="mb-6"
      />
      <p className="eyebrow mb-3">Saved Pieces</p>
      <h1 className="font-serif text-3xl leading-tight md:text-4xl">
        Wishlist
      </h1>
      <div className="mt-10">
        <WishlistGrid products={products} />
      </div>
    </div>
  );
}
