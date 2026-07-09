import { OrdersTable } from "@/components/admin/orders-table";

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and fulfil customer orders.
        </p>
      </div>
      <OrdersTable />
    </div>
  );
}
