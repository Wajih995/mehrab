import type { Metadata } from "next";

import { InfoPage, InfoSection } from "@/components/shared/info-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Store Locator",
  description: "Visit the MEHRAB studio in Karachi, or shop online nationwide.",
  alternates: { canonical: "/stores" },
};

export default function StoresPage() {
  return (
    <InfoPage
      eyebrow="Visit Us"
      title="Store Locator"
      intro="Experience the fabrics in person at our flagship studio — or shop online with nationwide delivery."
    >
      <InfoSection title="MEHRAB Studio — Karachi">
        <p>{siteConfig.contact.address}</p>
        <p>
          Monday to Saturday, 11:00 – 21:00
          <br />
          Friday prayer break, 13:00 – 14:30
        </p>
        <p>
          Phone / WhatsApp: {siteConfig.contact.phone}
          <br />
          Email: {siteConfig.contact.email}
        </p>
      </InfoSection>
      <InfoSection title="Online, nationwide">
        <p>
          Every piece on this site ships across Pakistan with cash on delivery
          and free size exchange within 7 days. New cities join our express
          network each season.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
