import { ProductsTable } from "@/components/admin/products-table";
import { getProducts } from "@/lib/repositories/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl">Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, edit and manage your catalogue.
        </p>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
