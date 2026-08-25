import type { Metadata } from "next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InfoPage } from "@/components/shared/info-page";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Frequently asked questions about MEHRAB orders, shipping, exchanges, fabrics and care.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Lahore in 1–2 working days, major cities in 2–3, and the rest of Pakistan in 3–5. Made-to-order sizes add 3–4 days of tailoring time.",
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes — COD is available nationwide. You can inspect the parcel before paying the courier.",
  },
  {
    q: "What if the size does not fit?",
    a: "Every order includes one free size exchange within 7 days. The piece must be unworn with tags attached; we collect and redeliver at no charge.",
  },
  {
    q: "How should I care for my kameez?",
    a: "Machine-wash cold with like colours and hang to dry. Boski and embroidered pieces should be dry-cleaned. A warm iron on the reverse keeps the placket crisp.",
  },
  {
    q: "Can I order custom measurements?",
    a: "Yes — made-to-order sizing is available on most pieces. Share your measurements on WhatsApp and our atelier will cut to them.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently we deliver across Pakistan only. International shipping is on our roadmap — follow @mehrab for the announcement.",
  },
] as const;

export default function FaqPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Frequently Asked Questions"
      intro="The short answers to what we get asked most. Anything else — WhatsApp us."
    >
      <Accordion type="single" collapsible className="w-full">
        {FAQS.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{f.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </InfoPage>
  );
}
