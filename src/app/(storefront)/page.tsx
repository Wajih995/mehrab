import { Hero } from "@/components/home/hero";
import { ServiceStrip } from "@/components/home/service-strip";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { ProductShowcase } from "@/components/home/product-showcase";
import { PremiumBanner } from "@/components/home/premium-banner";
import { FeaturedFabrics } from "@/components/home/featured-fabrics";
import { BrandStory } from "@/components/home/brand-story";
import { Testimonials } from "@/components/home/testimonials";
import { InstagramGallery } from "@/components/home/instagram-gallery";
import { getBestSellers, getNewArrivals } from "@/lib/repositories/products";

export default async function HomePage() {
  const [newArrivals, bestSellers] = await Promise.all([
    getNewArrivals(),
    getBestSellers(),
  ]);

  return (
    <>
      <Hero />
      <ServiceStrip />
      <FeaturedCategories />
      <ProductShowcase
        eyebrow="Just Landed"
        title="New arrivals"
        description="The latest additions to the MEHRAB line, fresh from the atelier."
        products={newArrivals}
        link={{ label: "Shop New In", href: "/collections/new-arrivals" }}
      />
      <PremiumBanner />
      <ProductShowcase
        eyebrow="Most Wanted"
        title="Best sellers"
        description="The pieces our customers return for, again and again."
        products={bestSellers}
        link={{ label: "Shop Best Sellers", href: "/collections/best-sellers" }}
        muted
      />
      <FeaturedFabrics />
      <BrandStory />
      <Testimonials />
      <InstagramGallery />
    </>
  );
}
