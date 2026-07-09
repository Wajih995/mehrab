import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";

/** Storefront chrome — wraps all customer-facing pages. */
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="pb-16 lg:pb-0">{children}</main>
      <Footer />
      <MobileTabBar />
      <CartDrawer />
    </>
  );
}
