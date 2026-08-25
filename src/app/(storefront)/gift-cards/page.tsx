import type { Metadata } from "next";

import { InfoPage, InfoSection } from "@/components/shared/info-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gift Cards",
  description:
    "MEHRAB digital gift cards — the gift of considered tailoring, from Rs 5,000.",
  alternates: { canonical: "/gift-cards" },
};

export default function GiftCardsPage() {
  const wa = siteConfig.contact.whatsapp.replace(/[^0-9]/g, "");
  return (
    <InfoPage
      eyebrow="Gifting"
      title="Gift Cards"
      intro="When you know he has taste, but not his size — let him choose."
    >
      <InfoSection title="How it works">
        <p>
          MEHRAB digital gift cards are issued in denominations of Rs 5,000,
          Rs 10,000, and Rs 25,000. Each card is delivered by email with a
          unique code, valid for one year, and redeemable against anything in
          the line — including made-to-order tailoring.
        </p>
      </InfoSection>
      <InfoSection title="Order a gift card">
        <p>
          Message us on{" "}
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brass underline-offset-4 hover:underline"
          >
            WhatsApp
          </a>{" "}
          or email{" "}
          <a
            href={`mailto:${siteConfig.contact.email}?subject=Gift card`}
            className="text-brass underline-offset-4 hover:underline"
          >
            {siteConfig.contact.email}
          </a>{" "}
          with the amount and the recipient&rsquo;s name — we issue the card
          the same day.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
