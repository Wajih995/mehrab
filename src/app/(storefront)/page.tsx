import { Hero } from "@/components/home/hero";
import { ProductGridSection } from "@/components/home/product-grid-section";
import { PremiumBanner } from "@/components/home/premium-banner";
import { BrandStory } from "@/components/home/brand-story";
import { Testimonials } from "@/components/home/testimonials";
import { InstagramGallery } from "@/components/home/instagram-gallery";
import { getCollectionView } from "@/lib/repositories/products";

/**
 * Rendered per request: the header menus and product rows come from
 * admin-editable data, so a static prerender would serve stale content
 * until the next deploy.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Sourced from the same resolver the collection pages use, so each row is
  // the head of the page its "View All" button opens.
  const [newArrivals, unstitched] = await Promise.all([
    getCollectionView("new-arrivals"),
    getCollectionView("unstitched"),
  ]);

  return (
    <>
      <Hero />
      <ProductGridSection
        eyebrow="Just Landed"
        title="New Arrivals"
        description="The latest additions to the MEHRAB line, fresh from the atelier."
        products={newArrivals?.products ?? []}
        viewAllHref="/collections/new-arrivals"
      />
      <ProductGridSection
        eyebrow="Shop By Collection"
        title="Unstitched"
        description="Loom-finished fabric by the suit, ready for your own tailor."
        products={unstitched?.products ?? []}
        viewAllHref="/collections/unstitched"
        muted
      />
      <PremiumBanner />
      <BrandStory />
      <Testimonials />
      <InstagramGallery />
    </>
  );
}
