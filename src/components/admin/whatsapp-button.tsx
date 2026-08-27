"use client";

import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { whatsAppOrderLink } from "@/lib/whatsapp";
import type { OrderRecord } from "@/lib/orders-shared";

/**
 * Opens WhatsApp in a new tab with a status-appropriate message pre-typed
 * to the customer's number. The admin reviews and presses send, so the
 * message goes from a real number the customer can reply to.
 */
export function WhatsAppButton({
  order,
  variant = "outline",
  iconOnly = false,
  className,
}: {
  order: OrderRecord;
  variant?: "outline" | "ghost" | "default";
  iconOnly?: boolean;
  className?: string;
}) {
  const label = `Message ${order.fullName.split(" ")[0]} on WhatsApp`;

  return (
    <Button
      asChild
      variant={variant}
      size={iconOnly ? "icon" : "default"}
      className={cn(
        "text-[#128C7E] hover:text-[#128C7E] dark:text-[#4ade80] dark:hover:text-[#4ade80]",
        className
      )}
    >
      <a
        href={whatsAppOrderLink(order)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
      >
        <MessageCircle className="size-4" />
        {!iconOnly && <span>WhatsApp</span>}
      </a>
    </Button>
  );
}
