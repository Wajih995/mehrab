import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { getProducts } from "@/lib/repositories/products";
import { getOrders } from "@/lib/repositories/orders";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);
  return <DashboardOverview products={products} orders={orders} />;
}
