import type { Metadata } from "next";
import Link from "next/link";

import { OrderConfirmation } from "@/components/checkout/order-confirmation";
import { Button } from "@/components/ui/button";
import { getOrderByNumber } from "@/lib/repositories/orders";

export const metadata: Metadata = {
  title: "Your Order",
  robots: { index: false, follow: false },
};

// Always render fresh: the whole point is showing the CURRENT status the
// admin has set, not a snapshot from when the order was placed.
export const dynamic = "force-dynamic";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    return (
      <div className="container py-12 md:py-16">
        <div className="flex flex-col items-center py-24 text-center">
          <h1 className="font-serif text-3xl">Order not found</h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            We couldn&apos;t find order{" "}
            <span className="font-medium text-foreground">{orderNumber}</span>.
            Check the number in your confirmation email, or contact us and
            we&apos;ll track it down.
          </p>
          <div className="mt-6 flex gap-3">
            <Button asChild size="lg">
              <Link href="/track-order">Try again</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <OrderConfirmation order={order} />
    </div>
  );
}
