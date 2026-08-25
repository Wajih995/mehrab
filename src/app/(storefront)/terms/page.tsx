import type { Metadata } from "next";

import { InfoPage, InfoSection } from "@/components/shared/info-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern shopping with MEHRAB.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="Plain terms for a fair exchange — last updated August 2026."
    >
      <InfoSection title="Orders & pricing">
        <p>
          All prices are in Pakistani Rupees and include applicable taxes. An
          order is confirmed once you receive our confirmation message; we may
          cancel and fully refund any order affected by a pricing or stock
          error.
        </p>
      </InfoSection>
      <InfoSection title="Delivery & risk">
        <p>
          Delivery timelines are estimates, not guarantees. Responsibility for
          the parcel passes to you on delivery; COD parcels may be inspected
          before payment.
        </p>
      </InfoSection>
      <InfoSection title="Exchanges & returns">
        <p>
          Exchanges and returns are governed by our Exchange Policy — free
          size exchange within 7 days, returns on unworn pieces within 7 days.
        </p>
      </InfoSection>
      <InfoSection title="Intellectual property">
        <p>
          All imagery, designs, and text on this site belong to MEHRAB and may
          not be reproduced without written permission.
        </p>
      </InfoSection>
      <InfoSection title="Contact">
        <p>
          Questions about these terms: {siteConfig.contact.email} or{" "}
          {siteConfig.contact.phone}.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
