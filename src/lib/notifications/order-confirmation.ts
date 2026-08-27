import "server-only";

import { sendEmail } from "@/lib/notifications/email";
import {
  orderConfirmationHtml,
  orderConfirmationSubject,
} from "@/lib/notifications/order-email-template";
import type { OrderRecord } from "@/lib/orders-shared";

/**
 * Send the order-confirmation email. Never throws — a failed notification
 * must not fail the order that was already placed.
 */
export async function sendOrderConfirmationEmail(
  order: OrderRecord
): Promise<void> {
  try {
    await sendEmail({
      to: order.email,
      subject: orderConfirmationSubject(order),
      html: orderConfirmationHtml(order),
    });
  } catch (err) {
    console.error(`[email] confirmation for ${order.orderNumber} failed`, err);
  }
}
