"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteOrder } from "@/actions/orders";
import { formatPrice } from "@/lib/utils";
import type { OrderRecord } from "@/lib/orders-shared";

/**
 * Permanently deletes an order.
 *
 * Deletion is irreversible and destroys a financial record, so it asks the
 * admin to type the order number rather than relying on a single click —
 * the same guard used for destructive actions elsewhere in the industry.
 */
export function DeleteOrderButton({
  order,
  iconOnly = false,
  /** Where to go after deleting (list page stays put). */
  redirectTo,
}: {
  order: OrderRecord;
  iconOnly?: boolean;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [pending, startTransition] = useTransition();

  const confirmed = typed.trim().toUpperCase() === order.orderNumber.toUpperCase();

  const handleDelete = () => {
    if (!confirmed) return;
    startTransition(async () => {
      const res = await deleteOrder(order.orderNumber);
      if (res.ok) {
        toast.success(`Order ${order.orderNumber} deleted`);
        setOpen(false);
        setTyped("");
        if (redirectTo) router.push(redirectTo);
        else router.refresh();
      } else {
        toast.error(res.error ?? "Delete failed");
      }
    });
  };

  return (
    <>
      <Button
        variant={iconOnly ? "ghost" : "outline"}
        size={iconOnly ? "icon" : "default"}
        onClick={() => setOpen(true)}
        aria-label={`Delete order ${order.orderNumber}`}
        title={`Delete order ${order.orderNumber}`}
        className={iconOnly ? undefined : "text-destructive hover:text-destructive"}
      >
        <Trash2 className="size-4" />
        {!iconOnly && <span>Delete</span>}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setTyped("");
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this order?</DialogTitle>
            <DialogDescription>
              This permanently removes the order and its items. It cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5">
            <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm">
              <p className="font-medium">{order.orderNumber}</p>
              <p className="mt-0.5 text-muted-foreground">
                {order.fullName} · {order.city} ·{" "}
                {formatPrice(order.totals.total)} · {order.status}
              </p>
            </div>

            <div className="mt-4">
              <Label htmlFor="confirm-order" className="text-xs text-muted-foreground">
                Type <span className="font-medium text-foreground">{order.orderNumber}</span> to confirm
              </Label>
              <Input
                id="confirm-order"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder={order.orderNumber}
                autoComplete="off"
                className="mt-1.5"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={!confirmed || pending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {pending ? "Deleting…" : "Delete order"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
