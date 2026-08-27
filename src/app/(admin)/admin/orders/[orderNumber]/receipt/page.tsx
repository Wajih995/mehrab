import type { Metadata } from "next";
import Link from "next/link";

import { ThermalReceipt } from "@/components/admin/thermal-receipt";
import { getOrderByNumber } from "@/lib/repositories/orders";

export const metadata: Metadata = {
  title: "Bill · MEHRAB",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    return (
      <div className="grid min-h-dvh place-items-center text-center">
        <div>
          <p className="font-serif text-2xl">Order not found</p>
          <Link
            href="/admin/orders"
            className="mt-3 inline-block text-sm text-brass hover:underline"
          >
            ← Back to orders
          </Link>
        </div>
      </div>
    );
  }

  return <ThermalReceipt order={order} />;
}
