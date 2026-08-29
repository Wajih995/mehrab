import type { Metadata } from "next";

import {
  PolicyPage,
  type PolicySection,
} from "@/components/shared/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Mehrab Essentials Privacy Policy — what information we collect, why we use it, when we share it, and the choices available to you.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS: PolicySection[] = [
  {
    title: "Information We Collect",
    blocks: [
      { p: "Depending on how you interact with us, we may collect:" },
      {
        ul: [
          "Identity and contact information: name, phone number, email address, billing address, and delivery address;",
          "Order information: products purchased, size, colour, price, payment status, returns, exchanges, and customer-support history;",
          "Payment information: payment method and transaction details. Card or wallet credentials may be processed directly by the relevant payment provider and may not be stored by Mehrab Essentials;",
          "Technical information: IP address, browser type, device information, operating system, website activity, cookies, and approximate location inferred from technical data;",
          "Marketing information: communication preferences and interaction with promotional messages; and",
          "Information you voluntarily provide: reviews, survey responses, photographs, messages, or other information sent to us.",
        ],
      },
      {
        p: "Please do not send sensitive personal information that is not necessary for your order or enquiry.",
      },
    ],
  },
  {
    title: "How We Use Your Information",
    blocks: [
      { p: "We may use personal information to:" },
      {
        ul: [
          "process, confirm, fulfil, deliver, and track orders;",
          "verify payments and prevent fraud;",
          "manage cancellations, returns, exchanges, refunds, and complaints;",
          "communicate about orders and customer-support requests;",
          "operate, secure, analyse, troubleshoot, and improve the website and services;",
          "maintain business, accounting, tax, and transaction records;",
          "personalise product recommendations or customer experience;",
          "send promotions where you have consented or where otherwise permitted by law; and",
          "comply with legal obligations and enforce our policies.",
        ],
      },
    ],
  },
  {
    title: "Cookies and Similar Technologies",
    blocks: [
      {
        p: "We and our service providers may use cookies, pixels, and similar technologies to keep the website functioning, remember preferences, understand website usage, measure advertising, and improve performance.",
      },
      {
        p: "You may control cookies through your browser settings. Blocking some cookies may affect website features. Where required, we will request consent before using non-essential cookies.",
      },
    ],
  },
  {
    title: "Marketing Communications",
    blocks: [
      {
        p: "With your consent, or where otherwise permitted, we may contact you through email, SMS, WhatsApp, telephone, or social media about Mehrab Essentials products, offers, and updates.",
      },
      {
        p: "You can opt out at any time by using the unsubscribe option in a message or contacting us. You may still receive necessary transactional messages relating to an order, delivery, refund, or customer-support request.",
      },
    ],
  },
  {
    title: "When We Share Information",
    blocks: [
      { p: "We may share only the information reasonably necessary with:" },
      {
        ul: [
          "courier and logistics providers for delivery and returns;",
          "payment processors, banks, and fraud-prevention providers;",
          "website hosting, cloud storage, analytics, advertising, communication, and customer-support providers;",
          "professional advisers, insurers, auditors, and accountants;",
          "regulators, courts, law-enforcement bodies, or government authorities where required by law; and",
          "a buyer, investor, or successor in connection with a business restructuring, merger, financing, or sale, subject to appropriate confidentiality safeguards.",
        ],
      },
      { p: "We do not sell your personal information as a standalone product." },
    ],
  },
  {
    title: "Data Storage and International Processing",
    blocks: [
      {
        p: "Our service providers may store or process information on servers located inside or outside Pakistan. Where information is handled outside Pakistan, we take reasonable steps to use reputable providers and appropriate contractual, organisational, and security safeguards.",
      },
    ],
  },
  {
    title: "Data Retention",
    blocks: [
      {
        p: "We keep personal information only for as long as reasonably necessary for the purpose for which it was collected, including order fulfilment, customer support, fraud prevention, accounting, tax, dispute resolution, and legal compliance. When information is no longer required, we will take reasonable steps to delete, anonymise, or securely dispose of it.",
      },
    ],
  },
  {
    title: "Data Security",
    blocks: [
      {
        p: "We use reasonable administrative, technical, and organisational measures to protect personal information from unauthorised access, loss, misuse, alteration, or disclosure. However, no online service or transmission method can be guaranteed to be completely secure.",
      },
      {
        p: "You are responsible for keeping your account password and any verification code confidential. Contact us promptly if you believe your account or personal information has been compromised.",
      },
    ],
  },
  {
    title: "Your Choices and Requests",
    blocks: [
      {
        p: "Subject to applicable law and reasonable identity verification, you may ask us to:",
      },
      {
        ul: [
          "provide information about the personal data we hold about you;",
          "correct inaccurate or incomplete information;",
          "delete information that we are not legally required or reasonably entitled to retain;",
          "withdraw consent for optional processing; or",
          "stop sending promotional communications.",
        ],
      },
      {
        p: "Some requests may be limited where retaining or using the information is necessary to complete an order, prevent fraud, comply with law, establish or defend a legal claim, or protect another person's rights.",
      },
    ],
  },
  {
    title: "Children's Privacy",
    blocks: [
      {
        p: "Our products and website are not directed to children under 13. We do not knowingly collect personal information from a child under 13 without appropriate parental or guardian involvement. If you believe a child has provided information to us improperly, please contact us so we can review and delete it where appropriate.",
      },
    ],
  },
  {
    title: "Third-Party Links and Platforms",
    blocks: [
      {
        p: "Our website or social media pages may contain links to third-party websites and services. Their privacy practices are controlled by their own policies, and Mehrab Essentials is not responsible for their independent handling of information.",
      },
    ],
  },
  {
    title: "Changes to This Privacy Policy",
    blocks: [
      {
        p: "We may update this Privacy Policy to reflect changes in our practices, services, or legal obligations. The latest version will be posted on the website with its effective date. Material changes may also be communicated through the website or another appropriate channel.",
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Privacy Policy"
      effective="31 August 2026"
      intro="Mehrab Essentials respects your privacy. This Privacy Policy explains what information we collect, why we use it, when we share it, and the choices available to you when you visit mehrabessentials.com, contact us, or place an order."
      sections={SECTIONS}
    />
  );
}
