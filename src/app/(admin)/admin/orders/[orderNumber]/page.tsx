import Link from "next/link";

import { OrderDetail } from "@/components/admin/order-detail";
import { getOrderByNumber } from "@/lib/repositories/orders";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="font-serif text-2xl">Order not found</p>
        <Link
          href="/admin/orders"
          className="mt-3 inline-block text-sm text-brass hover:underline"
        >
          ← Back to orders
        </Link>
      </div>
    );
  }

  return <OrderDetail order={order} />;
}
