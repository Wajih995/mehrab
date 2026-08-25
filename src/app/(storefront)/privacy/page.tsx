import type { Metadata } from "next";

import { InfoPage, InfoSection } from "@/components/shared/info-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MEHRAB collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="We collect only what we need to deliver your order well — nothing more."
    >
      <InfoSection title="What we collect">
        <p>
          Your name, delivery address, phone number, and email — provided at
          checkout — plus the order history tied to them. Payment card details
          are never stored on our servers.
        </p>
      </InfoSection>
      <InfoSection title="How we use it">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Fulfilling and delivering your orders</li>
          <li>Order updates by SMS, WhatsApp, or email</li>
          <li>Style updates — only if you opt in, unsubscribe any time</li>
        </ul>
      </InfoSection>
      <InfoSection title="What we never do">
        <p>
          We never sell your data. We share it only with the courier
          delivering your parcel and the payment processor handling your
          transaction.
        </p>
      </InfoSection>
      <InfoSection title="Your choices">
        <p>
          Email {siteConfig.contact.email} to view, correct, or delete the
          data we hold about you — we action requests within 14 days.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
