import type { Metadata } from "next";

import { InfoPage, InfoSection } from "@/components/shared/info-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Returns & Exchange",
  description:
    "MEHRAB exchange policy — free size exchange within 7 days, no questions asked.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Returns & Exchange"
      intro="If the fit is not right, we make it right — free size exchange within 7 days."
    >
      <InfoSection title="7-day size exchange">
        <p>
          Request an exchange within 7 days of delivery. The piece must be
          unworn, unwashed, and in its original packaging with tags attached.
          We collect the parcel and deliver the new size at no charge — one
          free exchange per order.
        </p>
      </InfoSection>
      <InfoSection title="Returns">
        <p>
          Unworn items in original condition can be returned within 7 days of
          delivery for a full refund of the item price. COD orders are
          refunded by bank transfer within 5 working days of the piece
          reaching our atelier.
        </p>
      </InfoSection>
      <InfoSection title="Exceptions">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Made-to-order and altered pieces are exchange-only</li>
          <li>Items marked Final Sale cannot be returned or exchanged</li>
        </ul>
      </InfoSection>
      <InfoSection title="How to start">
        <p>
          WhatsApp us at {siteConfig.contact.whatsapp} or email{" "}
          {siteConfig.contact.email} with your order number and the change you
          need — we arrange the rest.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
