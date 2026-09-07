import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/orders-shared";

const STYLES: Record<OrderStatus, string> = {
  Received: "bg-sand-300/40 text-charcoal-700 dark:bg-sand-300/20 dark:text-sand-100",
  Confirmed: "bg-blue-500/12 text-blue-700 dark:text-blue-300",
  Packed: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Shipped: "bg-violet-500/12 text-violet-700 dark:text-violet-300",
  Delivered: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  Cancelled: "bg-destructive/12 text-destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-medium uppercase tracking-wide2",
        STYLES[status]
      )}
    >
      {status}
    </span>
  );
}
