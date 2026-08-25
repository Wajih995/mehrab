import type { Metadata } from "next";

import { InfoPage, InfoSection } from "@/components/shared/info-page";
import { TrackOrderForm } from "@/components/shared/track-order-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your MEHRAB order by order number.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Track Your Order"
      intro="Enter the order number from your confirmation message to see its status."
    >
      <TrackOrderForm />
      <InfoSection title="Cannot find your order number?">
        <p>
          It is in the SMS and email we sent when you placed the order.
          Otherwise, WhatsApp us at {siteConfig.contact.whatsapp} with your
          phone number and we will locate it for you.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
