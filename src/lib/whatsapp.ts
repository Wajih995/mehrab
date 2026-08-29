import type { OrderRecord, OrderStatus } from "@/lib/orders-shared";
import { siteConfig } from "@/lib/site";
import { CUSTOM_FIELDS } from "@/lib/data/size-chart";

/**
 * WhatsApp click-to-chat helpers.
 *
 * Uses wa.me links rather than the Cloud API: no Meta business
 * verification, no template approval, and no per-message cost. The admin
 * clicks, WhatsApp opens with the message pre-typed, and they press send —
 * so the conversation happens from a real number the customer can reply to.
 *
 * Pure functions (no server-only, no side effects) so they can be unit
 * tested and used from client components.
 */

const rs = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

/**
 * Normalise a Pakistani mobile number to WhatsApp's expected form:
 * country code + subscriber number, digits only, no leading "+".
 *
 *   "0300 1234567"   → "923001234567"
 *   "+92-300-1234567"→ "923001234567"
 *   "3001234567"     → "923001234567"
 */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  if (digits.startsWith("3") && digits.length === 10) return `92${digits}`;
  return digits;
}

/** Compact item list, one per line. */
function itemLines(order: OrderRecord): string {
  return order.items
    .map((i) => {
      const bottom = i.bottomStyle ? ` / ${i.bottomStyle}` : "";
      const line = `• ${i.name} (${i.color} / ${i.size}${bottom}) x${i.quantity}`;
      if (!i.custom) return line;
      const m = CUSTOM_FIELDS.map(
        (f) => `${f.fullLabel} ${i.custom![f.key]}"`
      ).join(", ");
      return `${line}\n   _Made to order: ${m}_`;
    })
    .join("\n");
}

const DELIVERY_ETA: Record<string, string> = {
  Lahore: "1–2 working days",
  Karachi: "2–3 working days",
  Islamabad: "2–3 working days",
  Rawalpindi: "2–3 working days",
};

function eta(city: string): string {
  const key = Object.keys(DELIVERY_ETA).find(
    (c) => c.toLowerCase() === city.trim().toLowerCase()
  );
  return key ? DELIVERY_ETA[key] : "3–5 working days";
}

/**
 * The message body, tailored to where the order is in fulfilment — the
 * admin can send a useful update at every stage, not just at confirmation.
 */
export function whatsAppOrderMessage(order: OrderRecord): string {
  const firstName = order.fullName.split(" ")[0];
  const greeting = `Assalam-o-Alaikum ${firstName}!`;
  const sign = `Shukriya for choosing MEHRAB.`;
  const cod = `${rs(order.totals.total)} (Cash on Delivery)`;

  const byStatus: Record<OrderStatus, string> = {
    Confirmed: `${greeting}

Your MEHRAB order is confirmed.

*Order:* ${order.orderNumber}
${itemLines(order)}

*Total:* ${cod}
*Delivery:* ${eta(order.city)} to ${order.city}

Please keep the amount ready for the rider. If you'd like to change the size or address, just reply here.

${sign}`,

    Packed: `${greeting}

Good news — order *${order.orderNumber}* is packed and ready to leave our Lahore atelier.

*Total:* ${cod}
*Delivery:* ${eta(order.city)} to ${order.city}

We'll share tracking as soon as it's dispatched.

${sign}`,

    Shipped: `${greeting}

Your MEHRAB order *${order.orderNumber}* is on its way.

*Total to pay on delivery:* ${cod}
*Expected:* ${eta(order.city)}

The courier will call before arriving — please keep the amount ready. Reply here if you need to reschedule.

${sign}`,

    Delivered: `${greeting}

Your MEHRAB order *${order.orderNumber}* has been delivered — we hope the fit is perfect.

Free size exchange is available within 7 days, just reply here.

If you loved it, a review would mean a great deal to our karigars.

${sign}`,

    Cancelled: `${greeting}

Your MEHRAB order *${order.orderNumber}* has been cancelled as requested. Nothing is payable.

If this was a mistake or you'd like a different size, reply here and we'll set it right away.

${sign}`,
  };

  return byStatus[order.status];
}

/** A wa.me click-to-chat URL with the message pre-filled. */
export function whatsAppOrderLink(order: OrderRecord): string {
  const number = toWhatsAppNumber(order.phone);
  const text = encodeURIComponent(whatsAppOrderMessage(order));
  return `https://wa.me/${number}?text=${text}`;
}

/** Fallback link to the shop's own WhatsApp (used where no order applies). */
export function shopWhatsAppLink(message?: string): string {
  const number = toWhatsAppNumber(siteConfig.contact.whatsapp);
  return message
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${number}`;
}
