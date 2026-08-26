import { Hero } from "@/components/home/hero";
import { ServiceStrip } from "@/components/home/service-strip";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { PremiumBanner } from "@/components/home/premium-banner";
import { BrandStory } from "@/components/home/brand-story";
import { Testimonials } from "@/components/home/testimonials";
import { InstagramGallery } from "@/components/home/instagram-gallery";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceStrip />
      <FeaturedCategories />
      <PremiumBanner />
      <BrandStory />
      <Testimonials />
      <InstagramGallery />
    </>
  );
}
