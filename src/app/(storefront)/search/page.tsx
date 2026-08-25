import type { Metadata } from "next";

import { ShopView } from "@/components/shop/shop-view";
import { getProducts } from "@/lib/repositories/products";
import type { RawSearchParams } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the MEHRAB catalogue.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const products = await getProducts();
  const q = typeof sp.q === "string" ? sp.q : "";

  return (
    <div>
      <div className="container pt-8 md:pt-10">
        <form method="get" action="/search" className="max-w-xl">
          <label htmlFor="q" className="eyebrow mb-3 block">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search kameez, fabric, colour…"
            className="h-12 w-full rounded-md border border-border bg-background px-4 font-serif text-lg outline-none transition-colors focus:border-brass"
          />
        </form>
      </div>
      <ShopView
        scope={products}
        searchParams={sp}
        title={q ? `Results for “${q}”` : "All Products"}
        description={
          q
            ? undefined
            : "Type above to search the line by name, fabric, or colour."
        }
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />
    </div>
  );
}
