import { DeliveryManager } from "@/components/admin/delivery-manager";
import { getDeliverySettings } from "@/lib/repositories/delivery";

export const dynamic = "force-dynamic";

export default async function AdminDeliveryPage() {
  const settings = await getDeliverySettings();
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl">Delivery</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the delivery charge per city. Changes apply to new orders
          straight away.
        </p>
      </div>
      <DeliveryManager initial={settings} />
    </div>
  );
}
