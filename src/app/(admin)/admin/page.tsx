import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { getProducts } from "@/lib/repositories/products";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const products = await getProducts();
  return <DashboardOverview products={products} />;
}
