import "server-only";

import { sendEmail } from "@/lib/notifications/email";
import {
  orderAdminHtml,
  orderAdminSubject,
  orderConfirmationHtml,
  orderConfirmationSubject,
} from "@/lib/notifications/order-email-template";
import { siteConfig } from "@/lib/site";
import type { OrderRecord } from "@/lib/orders-shared";

/** Where new-order alerts go. */
const NOTIFY_TO =
  process.env.ORDER_NOTIFY_EMAIL || siteConfig.contact.email;

/**
 * Send both order emails — the customer's confirmation and the merchant's
 * new-order alert. Sent independently: one failing never blocks the other,
 * and neither can fail the order that was already placed.
 */
export async function sendOrderNotifications(
  order: OrderRecord
): Promise<void> {
  const results = await Promise.allSettled([
    sendEmail({
      to: order.email,
      subject: orderConfirmationSubject(order),
      html: orderConfirmationHtml(order),
    }),
    sendEmail({
      to: NOTIFY_TO,
      subject: orderAdminSubject(order),
      html: orderAdminHtml(order),
      // Hitting reply on the alert writes to the customer directly.
      replyTo: order.email,
    }),
  ]);
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(
        `[email] ${i === 0 ? "confirmation" : "admin alert"} for ${order.orderNumber} failed`,
        r.reason
      );
    }
  });
}
