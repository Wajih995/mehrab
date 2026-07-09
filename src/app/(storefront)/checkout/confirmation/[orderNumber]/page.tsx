import type { Metadata } from "next";

import { OrderConfirmation } from "@/components/checkout/order-confirmation";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return (
    <div className="container py-12 md:py-16">
      <OrderConfirmation orderNumber={orderNumber} />
    </div>
  );
}
