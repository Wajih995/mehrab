import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { getMainNav } from "@/lib/repositories/navigation";

/** Storefront chrome — wraps all customer-facing pages. */
export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = await getMainNav();
  return (
    <>
      <AnnouncementBar />
      <Header nav={nav} />
      <main className="pb-16 lg:pb-0">{children}</main>
      <Footer />
      <MobileTabBar />
      <CartDrawer />
    </>
  );
}
