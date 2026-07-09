import type { Metadata } from "next";

import { Logo } from "@/components/layout/logo";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your MEHRAB order.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container max-w-6xl py-8 md:py-12">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <Logo size="md" href="/" />
        <h1 className="font-serif text-2xl md:text-3xl">Checkout</h1>
      </div>
      <CheckoutForm />
    </div>
  );
}
