import { ProductForm } from "@/components/admin/product-form";
import { menuCategories } from "@/lib/menu-categories";
import { getMainNav } from "@/lib/repositories/navigation";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = menuCategories(await getMainNav());
  return <ProductForm categories={categories} />;
}
