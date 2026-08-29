import type { Metadata } from "next";

import {
  PolicyPage,
  type PolicySection,
} from "@/components/shared/policy-page";

export const metadata: Metadata = {
  title: "Cancellation, Return & Refund Policy",
  description:
    "Mehrab Essentials cancellation, return, exchange and refund policy — when an order can be cancelled, exchanged, returned, or refunded.",
  alternates: { canonical: "/returns" },
};

const SECTIONS: PolicySection[] = [
  {
    title: "Order Cancellation Before Dispatch",
    blocks: [
      {
        p: "You may request cancellation before your order has been dispatched by contacting us as soon as possible through WhatsApp or phone at 0303-6347222 and providing your order number.",
      },
      {
        p: "A cancellation request is not final until confirmed by Mehrab Essentials. If the parcel has already been dispatched or handed to the courier, it can no longer be cancelled and the return or exchange conditions below will apply.",
      },
    ],
  },
  {
    title: "Changes to an Order",
    blocks: [
      {
        p: "Requests to change a size, colour, item, delivery address, or contact number must be made before dispatch. We will try to accommodate the request, but changes depend on availability and processing status.",
      },
    ],
  },
  {
    title: "Eligible Returns and Exchanges",
    blocks: [
      {
        p: "You may request a return or exchange within 7 calendar days of delivery if:",
      },
      {
        ul: [
          "the wrong product, colour, or size was delivered;",
          "the product arrived damaged or with a manufacturing defect;",
          "an eligible item does not fit and you want a different available size; or",
          "you otherwise qualify for a return under applicable consumer law.",
        ],
      },
      {
        p: "To be eligible, the item must be unworn, unwashed, unaltered, unused, free from stains, fragrance, damage, or signs of wear, and returned with its original tags, packaging, and proof of purchase.",
      },
    ],
  },
  {
    title: "Items Not Eligible for Return or Exchange",
    blocks: [
      {
        p: "Unless the product is defective, incorrectly supplied, or applicable law requires otherwise, we do not accept returns or exchanges for:",
      },
      {
        ul: [
          "customised, made-to-measure, personalised, or altered garments;",
          "items marked “Final Sale” or “Non-Returnable” before purchase;",
          "items damaged through misuse, improper washing, ironing, storage, or handling;",
          "worn, washed, altered, stained, perfumed, or tagless items;",
          "returns requested after the 7-day period; or",
          "a minor colour or texture variation caused by photography, screen display, lighting, or normal fabric characteristics.",
        ],
      },
    ],
  },
  {
    title: "How to Request a Return or Exchange",
    blocks: [
      { p: "Contact us at 0303-6347222 within the eligible period and provide:" },
      {
        ul: [
          "your order number;",
          "the purchaser's name and phone number;",
          "the reason for the request; and",
          "clear photographs or a short video if the item is damaged, defective, or incorrect.",
        ],
      },
      {
        p: "Do not send a parcel back until our team has reviewed the request and provided return instructions. Unauthorised returns may be refused or delayed.",
      },
    ],
  },
  {
    title: "Return Shipping Charges",
    blocks: [
      {
        p: "If Mehrab Essentials delivered an incorrect, damaged, or manufacturing-defective item, we will bear the reasonable return and replacement delivery charges after verification.",
      },
      {
        p: "For a size exchange, change of mind, or another reason not caused by our error, the customer is responsible for return and replacement delivery charges. Original delivery charges are non-refundable unless the item was incorrect, damaged, defective, or the law requires otherwise.",
      },
    ],
  },
  {
    title: "Inspection and Approval",
    blocks: [
      {
        p: "Returned items are inspected after receipt. We may decline a return or exchange if the item does not meet this policy. If the request is approved, we will arrange the applicable exchange, store credit, or refund.",
      },
      {
        p: "An exchange is subject to stock availability. If the requested replacement is unavailable, we may offer another item, store credit, or a refund. Any price difference and applicable delivery charges must be paid before dispatch of the replacement.",
      },
    ],
  },
  {
    title: "Refunds",
    blocks: [
      {
        p: "Approved refunds will normally be initiated within 7–14 business days after the returned item is received and inspected. Processing time after initiation depends on the bank, payment provider, or mobile wallet.",
      },
      {
        p: "Refunds will be issued to the original payment method where reasonably possible. For Cash on Delivery orders, an approved refund may be made by bank transfer or mobile wallet after the customer provides accurate payment details. Mehrab Essentials is not responsible for delay caused by incorrect information supplied by the customer or by the receiving financial institution.",
      },
    ],
  },
  {
    title: "Refused or Undeliverable Cash on Delivery Orders",
    blocks: [
      {
        p: "If a confirmed Cash on Delivery order is refused without a valid reason, or cannot be delivered because the customer supplied incorrect information or repeatedly remained unavailable, future Cash on Delivery orders may require verification or advance payment. This does not affect any rights available under applicable law.",
      },
    ],
  },
  {
    title: "Missing Items or Transit Damage",
    blocks: [
      {
        p: "If your parcel appears opened, seriously damaged, or incomplete, contact us promptly and, where practical, record photographs or an unboxing video. Claims should be reported within 48 hours of delivery so we can investigate with the courier. This reporting period does not remove any mandatory legal rights.",
      },
    ],
  },
];

export default function ReturnsPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Cancellation, Return, Exchange & Refund Policy"
      effective="31 August 2026"
      intro="We want every Mehrab Essentials customer to receive the correct product in excellent condition. This policy explains when an order can be cancelled, exchanged, returned, or refunded."
      sections={SECTIONS}
    />
  );
}
