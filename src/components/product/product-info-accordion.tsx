import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Product } from "@/types";

const FAQS = [
  {
    q: "How does the sizing run?",
    a: "Our shalwar kameez are cut to a modern straight fit. If you're between sizes or prefer a relaxed drape, we recommend sizing up. See the full size guide for chest, length and shoulder measurements.",
  },
  {
    q: "Can I exchange for a different size?",
    a: "Yes — we offer one complimentary size exchange within 7 days of delivery, provided the piece is unworn with tags intact.",
  },
  {
    q: "Is Cash on Delivery available?",
    a: "COD is available nationwide across Pakistan. Card and mobile-wallet payments are also supported at checkout.",
  },
];

export function ProductInfoAccordion({ product }: { product: Product }) {
  return (
    <Accordion type="multiple" defaultValue={["specs"]} className="w-full">
      {product.specifications && (
        <AccordionItem value="specs">
          <AccordionTrigger>Specifications</AccordionTrigger>
          <AccordionContent>
            <dl className="divide-y divide-border">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium text-foreground">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </AccordionContent>
        </AccordionItem>
      )}

      <AccordionItem value="fabric">
        <AccordionTrigger>Fabric &amp; Care</AccordionTrigger>
        <AccordionContent>
          <p className="mb-3">
            Crafted from <strong className="text-foreground">{product.fabric}</strong>,
            selected for its hand-feel and how it falls. {product.season} wear.
          </p>
          {product.careInstructions && (
            <ul className="space-y-1.5">
              {product.careInstructions.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-brass" />
                  {c}
                </li>
              ))}
            </ul>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="delivery">
        <AccordionTrigger>Delivery</AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1.5">
            <li>Delivery charges by city, shown at checkout.</li>
            <li>Standard delivery in 2–4 working days nationwide.</li>
            <li>Cash on Delivery available across Pakistan.</li>
            <li>Each piece ships in signature MEHRAB packaging.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="exchange">
        <AccordionTrigger>Exchange &amp; Returns</AccordionTrigger>
        <AccordionContent>
          <p>
            One complimentary size exchange within 7 days of delivery. Items
            must be unworn with tags intact. See our full exchange policy for
            details.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="faq">
        <AccordionTrigger>FAQ</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q}>
                <p className="font-medium text-foreground">{f.q}</p>
                <p className="mt-1">{f.a}</p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
