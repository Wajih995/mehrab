import { OrderDetail } from "@/components/admin/order-detail";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return <OrderDetail orderNumber={orderNumber} />;
}
