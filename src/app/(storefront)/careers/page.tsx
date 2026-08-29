import type { Metadata } from "next";

import { InfoPage, InfoSection } from "@/components/shared/info-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the MEHRAB atelier — craft, retail and studio roles in Karachi.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <InfoPage
      eyebrow="Join Us"
      title="Careers at MEHRAB"
      intro="We are a small team of cutters, finishers, and storytellers building the standard for eastern menswear."
    >
      <InfoSection title="Open disciplines">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Tailoring &amp; finishing — master cutters, karigars, pressers</li>
          <li>Studio — photography, content, and e-commerce operations</li>
          <li>Customer care — WhatsApp and order support</li>
        </ul>
      </InfoSection>
      <InfoSection title="How to apply">
        <p>
          Email your CV and a short note about the craft you are proudest of to{" "}
          <a
            href={`mailto:${siteConfig.contact.email}?subject=Careers at MEHRAB`}
            className="text-brass underline-offset-4 hover:underline"
          >
            {siteConfig.contact.email}
          </a>
          . We reply to every application within two weeks.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
