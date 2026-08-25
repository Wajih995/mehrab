import type { Metadata } from "next";

import { InfoPage, InfoSection } from "@/components/shared/info-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach MEHRAB customer care — WhatsApp, phone, or email.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const wa = siteConfig.contact.whatsapp.replace(/[^0-9]/g, "");
  return (
    <InfoPage
      eyebrow="We Are Here"
      title="Contact Us"
      intro="Questions about sizing, an order, or a fabric? Our care team answers within one working day."
    >
      <InfoSection title="WhatsApp (fastest)">
        <p>
          Message us at{" "}
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brass underline-offset-4 hover:underline"
          >
            {siteConfig.contact.whatsapp}
          </a>{" "}
          — Monday to Saturday, 10:00 – 22:00.
        </p>
      </InfoSection>
      <InfoSection title="Email">
        <p>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-brass underline-offset-4 hover:underline"
          >
            {siteConfig.contact.email}
          </a>{" "}
          for order queries, wholesale, and press.
        </p>
      </InfoSection>
      <InfoSection title="Studio">
        <p>
          {siteConfig.contact.address}
          <br />
          Phone: {siteConfig.contact.phone}
        </p>
      </InfoSection>
    </InfoPage>
  );
}
