import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { getProductById } from "@/lib/repositories/products";
import { menuCategories } from "@/lib/menu-categories";
import { getMainNav } from "@/lib/repositories/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, nav] = await Promise.all([getProductById(id), getMainNav()]);

  if (!product) {
    return (
      <div className="py-16 text-center">
        <p className="font-serif text-2xl">Product not found</p>
        <Link
          href="/admin/products"
          className="mt-3 inline-block text-sm text-brass hover:underline"
        >
          ← Back to products
        </Link>
      </div>
    );
  }

  return <ProductForm product={product} categories={menuCategories(nav)} />;
}
