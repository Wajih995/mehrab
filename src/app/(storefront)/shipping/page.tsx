import type { Metadata } from "next";

import { InfoPage, InfoSection } from "@/components/shared/info-page";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    "MEHRAB shipping policy — nationwide delivery, express shipping, and cash on delivery across Pakistan.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Shipping & Delivery"
      intro="Every order is pressed, wrapped, and dispatched from our Lahore atelier."
    >
      <InfoSection title="Delivery times">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Lahore — 1 to 2 working days</li>
          <li>Karachi, Islamabad, Rawalpindi — 2 to 3 working days</li>
          <li>All other cities — 3 to 5 working days</li>
        </ul>
        <p>
          Made-to-order sizes add 3 to 4 working days of tailoring time before
          dispatch.
        </p>
      </InfoSection>
      <InfoSection title="Charges">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Orders over Rs 15,000 — complimentary express shipping</li>
          <li>Orders under Rs 15,000 — flat Rs 250 nationwide</li>
        </ul>
      </InfoSection>
      <InfoSection title="Cash on Delivery">
        <p>
          COD is available across Pakistan. Please have the exact amount ready
          for the courier; parcels can be inspected before payment.
        </p>
      </InfoSection>
      <InfoSection title="Order tracking">
        <p>
          You receive a tracking number by SMS and email as soon as your order
          leaves the atelier. You can also look it up any time on our Track
          Order page.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
