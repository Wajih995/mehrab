import type { Metadata } from "next";

import {
  PolicyPage,
  type PolicySection,
} from "@/components/shared/policy-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Mehrab Essentials Terms and Conditions — ordering, payment, delivery, and your rights when shopping at mehrabessentials.com.",
  alternates: { canonical: "/terms" },
};

const SECTIONS: PolicySection[] = [
  {
    title: "About Mehrab Essentials",
    blocks: [
      {
        p: "Mehrab Essentials is an online men's clothing brand offering shalwar qameez and related apparel and accessories. In these Terms, “Mehrab Essentials,” “we,” “us,” and “our” refer to the business operating mehrabessentials.com. “Customer,” “you,” and “your” refer to any person using the website or purchasing from us.",
      },
    ],
  },
  {
    title: "Eligibility and Account Information",
    blocks: [
      {
        p: "You must be legally capable of entering into a binding contract to place an order. If you are under 18, you may use the website only with the involvement and permission of a parent or legal guardian.",
      },
      {
        p: "You are responsible for providing complete and accurate information, including your name, mobile number, email address, delivery address, and payment details. You are also responsible for keeping your account credentials confidential and for activity carried out through your account.",
      },
    ],
  },
  {
    title: "Product Information",
    blocks: [
      {
        p: "We make reasonable efforts to display product descriptions, colours, fabric details, measurements, and images accurately. However:",
      },
      {
        ul: [
          "colours may appear slightly different because of lighting, photography, screen settings, or device display;",
          "minor variations in fabric texture, stitching, measurements, or finishing may occur;",
          "measurements may vary slightly due to the nature of garment production; and",
          "product availability may change without notice.",
        ],
      },
      {
        p: "Such minor variations are not considered defects. Please review the product description and size chart carefully before ordering.",
      },
    ],
  },
  {
    title: "Prices and Payments",
    blocks: [
      {
        p: "All prices are displayed in Pakistani Rupees (PKR), unless stated otherwise. Delivery charges, taxes, and any other applicable fees will be shown at checkout or communicated before confirmation.",
      },
      {
        p: "We may change prices or promotions at any time, but a price change will not affect an order already accepted by us. If a product is listed at an incorrect price because of a technical or human error, we may cancel the order and notify you. If payment has already been received, the paid amount will be refunded.",
      },
      {
        p: "Available payment methods may include Cash on Delivery, bank transfer, card payment, mobile wallet, or another method displayed at checkout. Orders placed using advance payment may be processed only after payment is successfully verified.",
      },
    ],
  },
  {
    title: "Orders and Acceptance",
    blocks: [
      {
        p: "Submitting an order does not automatically mean it has been accepted. An order is accepted when we confirm it for processing or dispatch. We may contact you by phone, WhatsApp, SMS, or email to verify an order.",
      },
      { p: "We reserve the right to refuse or cancel an order where:" },
      {
        ul: [
          "the product is unavailable;",
          "the price or product information is incorrect;",
          "payment cannot be verified;",
          "the delivery information is incomplete or inaccurate;",
          "fraud, misuse, or unauthorised activity is suspected; or",
          "the order cannot reasonably be fulfilled.",
        ],
      },
      {
        p: "If we cancel a prepaid order, we will refund the amount paid through the original payment method where possible, or through another mutually agreed method.",
      },
    ],
  },
  {
    title: "Delivery",
    blocks: [
      {
        p: "Estimated delivery times are provided as guidance and are not guaranteed. Delays may occur because of courier operations, weather, public holidays, remote locations, order verification, stock issues, or circumstances beyond our reasonable control.",
      },
      {
        p: "You must provide an accurate address and remain available at the supplied contact number. Mehrab Essentials is not responsible for delay or failed delivery caused by incorrect customer information, an unavailable recipient, or refusal to accept a confirmed order.",
      },
      {
        p: "Risk of loss or damage passes to you when the parcel is delivered to you or your authorised recipient. Please inspect the parcel promptly after delivery.",
      },
    ],
  },
  {
    title: "Cancellations, Exchanges, Returns, and Refunds",
    blocks: [
      {
        p: "All cancellations, exchanges, returns, and refunds are governed by the Cancellation, Return, Exchange and Refund Policy, which forms part of these Terms and Conditions.",
      },
    ],
  },
  {
    title: "Promotions and Discount Codes",
    blocks: [
      {
        p: "Promotions and discount codes are subject to their stated terms, validity periods, eligible products, and stock availability. Unless expressly allowed, discounts cannot be combined, exchanged for cash, or applied retrospectively to a completed order. We may withdraw or correct a promotion where there is an error, misuse, or suspected fraud.",
      },
    ],
  },
  {
    title: "Intellectual Property",
    blocks: [
      {
        p: "The Mehrab Essentials name, logo, designs, photographs, videos, product descriptions, graphics, website content, and other brand materials are owned by or licensed to Mehrab Essentials. They may not be copied, reproduced, modified, republished, sold, or used commercially without our prior written permission.",
      },
    ],
  },
  {
    title: "Acceptable Use",
    blocks: [
      {
        p: "You must not misuse the website, attempt unauthorised access, introduce malicious code, interfere with its operation, scrape content or customer information, impersonate another person, submit fraudulent orders, or use the website for any unlawful purpose.",
      },
    ],
  },
  {
    title: "Third-Party Services and Links",
    blocks: [
      {
        p: "The website may use or link to third-party services, including payment providers, couriers, analytics tools, social media platforms, and hosting providers. Their services may be governed by separate terms and privacy practices. We are not responsible for the content or independent actions of third-party websites that we do not control.",
      },
    ],
  },
  {
    title: "Website Availability",
    blocks: [
      {
        p: "We aim to keep the website accurate, secure, and available, but we do not guarantee uninterrupted or error-free access. We may update, suspend, restrict, or discontinue any part of the website for maintenance, security, operational, or business reasons.",
      },
    ],
  },
  {
    title: "Limitation of Liability",
    blocks: [
      {
        p: "To the maximum extent permitted by applicable law, Mehrab Essentials will not be liable for indirect, incidental, or consequential loss arising from use of the website or purchase of a product. Our total liability relating to an order will not exceed the amount paid for the product giving rise to the claim.",
      },
      {
        p: "Nothing in these Terms excludes or limits any right, remedy, warranty, or liability that cannot lawfully be excluded under applicable consumer law.",
      },
    ],
  },
  {
    title: "Indemnity",
    blocks: [
      {
        p: "To the extent permitted by law, you agree to compensate Mehrab Essentials for losses or reasonable costs arising from your unlawful use of the website, fraudulent activity, infringement of another person's rights, or material breach of these Terms.",
      },
    ],
  },
  {
    title: "Governing Law and Disputes",
    blocks: [
      {
        p: "These Terms are governed by the laws of Pakistan, including applicable consumer-protection laws. The parties should first attempt to resolve any dispute in good faith through customer support. If the dispute cannot be resolved amicably, it will be subject to the jurisdiction of the courts and competent consumer forums in Karachi, Sindh, unless applicable law requires otherwise.",
      },
    ],
  },
  {
    title: "Changes to These Terms",
    blocks: [
      {
        p: "We may update these Terms from time to time. The updated version will be posted on the website with a revised effective date. Changes will apply from the date of publication and will not retrospectively reduce rights attached to an order already accepted.",
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Terms & Conditions"
      effective="31 August 2026"
      intro="Welcome to Mehrab Essentials. These Terms and Conditions govern your access to and use of mehrabessentials.com and your purchase of products from Mehrab Essentials. By visiting the website, creating an account, or placing an order, you agree to these Terms and Conditions."
      sections={SECTIONS}
    />
  );
}
