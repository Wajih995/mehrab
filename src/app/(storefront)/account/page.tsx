import type { Metadata } from "next";
import Link from "next/link";
import { Heart, MapPin, MessageCircle, Package } from "lucide-react";

import { InfoPage } from "@/components/shared/info-page";

export const metadata: Metadata = {
  title: "Account",
  description: "Your MEHRAB account — orders, wishlist, and support.",
  robots: { index: false, follow: false },
};

const LINKS = [
  {
    href: "/track-order",
    icon: Package,
    title: "Track an order",
    blurb: "Check the status of a delivery by order number.",
  },
  {
    href: "/account/wishlist",
    icon: Heart,
    title: "Wishlist",
    blurb: "The pieces you have saved for later.",
  },
  {
    href: "/contact",
    icon: MessageCircle,
    title: "Customer care",
    blurb: "WhatsApp, phone, or email — we reply within a day.",
  },
  {
    href: "/stores",
    icon: MapPin,
    title: "Visit the studio",
    blurb: "Experience the fabrics in person in Lahore.",
  },
] as const;

export default function AccountPage() {
  return (
    <InfoPage
      eyebrow="Your MEHRAB"
      title="Account"
      intro="Everything about your orders and saved pieces, in one place."
      wide
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {LINKS.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-start gap-4 rounded-lg border border-border bg-background p-6 transition-colors hover:border-brass"
            >
              <Icon className="mt-0.5 size-5 text-brass" />
              <span>
                <span className="block font-serif text-lg">{l.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {l.blurb}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      <p className="text-sm text-muted-foreground">
        Customer sign-in launches with our next release — orders placed today
        are tracked by order number, no account needed.
      </p>
    </InfoPage>
  );
}
