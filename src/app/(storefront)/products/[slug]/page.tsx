import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductInfoAccordion } from "@/components/product/product-info-accordion";
import { ProductReviews } from "@/components/product/product-reviews";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { ProductRail } from "@/components/product/product-rail";
import { SectionHeading } from "@/components/shared/section-heading";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getProducts,
  getProductBySlug,
  getRelated,
  getProductReviews,
} from "@/lib/repositories/products";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

export async function generateStaticParams() {
  // A build must not depend on the database being reachable: if the query
  // fails, prerender nothing and let these pages render on demand instead.
  try {
    return (await getProducts()).map((p) => ({ slug: p.slug }));
  } catch (err) {
    console.error("generateStaticParams: catalogue unavailable at build", err);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  // Admin-entered SEO wins; otherwise derive from the product itself.
  const customTitle = product.metaTitle?.trim();
  const title =
    customTitle || `${product.name} — ${product.subtitle ?? "Men's Shalwar Kameez"}`;
  const description =
    product.metaDescription?.trim() || product.description.slice(0, 160);

  return {
    // A hand-written meta title is used verbatim; the root layout's
    // "%s · MEHRAB" template would otherwise duplicate the brand name.
    title: customTitle ? { absolute: customTitle } : title,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, reviews] = await Promise.all([
    getRelated(slug),
    getProductReviews(product.id, 4),
  ]);
  const primaryCollection = product.collectionSlugs[0];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => i.url),
    description: product.description,
    sku: product.id,
    brand: { "@type": "Brand", name: siteConfig.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: siteConfig.currency,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/products/${product.slug}`),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: absoluteUrl(`/products/${product.slug}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="container py-6 md:py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            ...(primaryCollection
              ? [
                  {
                    label: product.fabric,
                    href: `/shop?fabric=${encodeURIComponent(product.fabric)}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
          className="mb-6"
        />

        {/* Gallery + purchase */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery images={product.images} />
          </div>
          <ProductPurchase product={product} />
        </div>

        {/* Details */}
        <div className="mt-16 grid gap-10 border-t border-border pt-12 lg:mt-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow mb-3">About this piece</p>
            <h2 className="font-serif text-2xl leading-snug md:text-3xl">
              {product.subtitle}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {product.description}
            </p>
          </div>
          <div>
            <ProductInfoAccordion product={product} />
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 border-t border-border pt-12 lg:mt-24">
          <ProductReviews product={product} reviews={reviews} />
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="section container border-t border-border">
          <SectionHeading
            eyebrow="Complete the look"
            title="You may also like"
          />
          <div className="mt-10">
            <ProductRail products={related} withControls={false} />
          </div>
        </section>
      )}

      <RecentlyViewed currentId={product.id} />
    </>
  );
}
