import type { Metadata } from "next";

import { ShopView } from "@/components/shop/shop-view";
import { getProducts } from "@/lib/repositories/products";
import type { RawSearchParams } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Shop All — Men's Shalwar Kameez",
  description:
    "Browse the full MEHRAB collection of premium men's shalwar kameez. Filter by fabric, colour, size, season and price.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const products = await getProducts();

  return (
    <ShopView
      scope={products}
      searchParams={sp}
      title="Shop All"
      description="Every MEHRAB piece — heritage tailoring and considered fabrics, cut for a modern silhouette."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
    />
  );
}
