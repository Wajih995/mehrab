import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ShopView } from "@/components/shop/shop-view";
import {
  allCollectionSlugs,
  getCollectionView,
} from "@/lib/repositories/products";
import type { RawSearchParams } from "@/lib/shop";

export function generateStaticParams() {
  return allCollectionSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const view = await getCollectionView(slug);
  if (!view) return { title: "Collection not found" };
  return {
    title: `${view.title} — Men's Shalwar Kameez`,
    description: view.description,
    alternates: { canonical: `/collections/${slug}` },
    openGraph: view.image
      ? { images: [{ url: view.image }] }
      : undefined,
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const view = await getCollectionView(slug);
  if (!view) notFound();

  return (
    <ShopView
      scope={view.products}
      searchParams={sp}
      title={view.title}
      description={view.description}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Collections", href: "/collections" },
        { label: view.title },
      ]}
      hideCollections
    />
  );
}
