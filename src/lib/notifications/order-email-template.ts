import { siteConfig } from "@/lib/site";
import { CUSTOM_FIELDS } from "@/lib/data/size-chart";
import { toWhatsAppNumber } from "@/lib/whatsapp";
import type { OrderRecord } from "@/lib/orders-shared";

/**
 * Order-confirmation email markup.
 *
 * Deliberately free of `server-only` and of any credential access: it is a
 * pure function of the order, so it can be rendered for previews and tests
 * without touching the mail transport.
 *
 * Inline styles only — email clients drop <style> blocks. Brand palette:
 * charcoal #26221f, cream #f7f3ea, brass #a8823f.
 */

const rs = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

export function orderConfirmationSubject(order: OrderRecord): string {
  return `Order confirmed — ${order.orderNumber} · MEHRAB`;
}

export function orderConfirmationHtml(order: OrderRecord): string {
  const rows = order.items
    .map(
      (i) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e8e2d4;">
            <strong style="color:#26221f;">${i.name}</strong><br/>
            <span style="color:#8a8378;font-size:12px;">${i.color} · Size ${i.size} · Qty ${i.quantity}</span>
          </td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid #e8e2d4;color:#26221f;white-space:nowrap;">
            ${rs(i.price * i.quantity)}
          </td>
        </tr>`
    )
    .join("");

  const totalRow = (label: string, value: string, strong = false) => `
    <tr>
      <td style="padding:4px 0;color:${strong ? "#26221f" : "#8a8378"};${strong ? "font-size:16px;font-weight:bold;" : ""}">${label}</td>
      <td align="right" style="padding:4px 0;color:#26221f;${strong ? "font-size:16px;font-weight:bold;" : ""}">${value}</td>
    </tr>`;

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f7f3ea;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ea;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e8e2d4;">
        <!-- Header -->
        <tr>
          <td align="center" style="background:#26221f;padding:28px 24px;">
            <div style="color:#f7f3ea;font-size:22px;letter-spacing:8px;">MEHRAB</div>
            <div style="color:#a8823f;font-size:10px;letter-spacing:4px;margin-top:6px;">${siteConfig.tagline.toUpperCase()}</div>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 32px 8px;">
            <p style="margin:0;color:#a8823f;font-size:11px;letter-spacing:2px;">ORDER CONFIRMED</p>
            <h1 style="margin:8px 0 0;color:#26221f;font-size:24px;font-weight:normal;">Shukriya, ${order.fullName.split(" ")[0]}.</h1>
            <p style="margin:12px 0 0;color:#8a8378;font-size:14px;line-height:1.6;">
              Your order <strong style="color:#26221f;">${order.orderNumber}</strong> is confirmed and our atelier is preparing it.
              Payment is <strong style="color:#26221f;">cash on delivery</strong> — please keep <strong style="color:#26221f;">${rs(order.totals.total)}</strong> ready.
            </p>
          </td>
        </tr>
        <!-- Items -->
        <tr>
          <td style="padding:20px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              ${rows}
              <tr><td colspan="2" style="padding-top:14px;"></td></tr>
              ${totalRow("Subtotal", rs(order.totals.subtotal))}
              ${order.totals.discount > 0 ? totalRow(`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`, `−${rs(order.totals.discount)}`) : ""}
              ${totalRow("Delivery", order.totals.freeShipping ? "Free" : rs(order.totals.shipping))}
              ${totalRow("Total to pay on delivery", rs(order.totals.total), true)}
            </table>
          </td>
        </tr>
        <!-- Address -->
        <tr>
          <td style="padding:24px 32px;">
            <div style="background:#f7f3ea;padding:16px 20px;font-size:13px;color:#26221f;line-height:1.6;">
              <span style="color:#a8823f;font-size:10px;letter-spacing:2px;">DELIVERING TO</span><br/>
              ${order.fullName}<br/>
              ${order.address}, ${order.city}, ${order.province}${order.postalCode ? " " + order.postalCode : ""}<br/>
              ${order.phone}
            </div>
          </td>
        </tr>
        <!-- Track order -->
        <tr>
          <td align="center" style="padding:0 32px 28px;">
            <a href="${siteConfig.url}/track/${order.orderNumber}"
               style="display:inline-block;background:#26221f;color:#f7f3ea;text-decoration:none;font-size:13px;letter-spacing:2px;padding:14px 36px;">
              TRACK YOUR ORDER
            </a>
            <div style="margin-top:10px;font-size:11px;color:#8a8378;">
              ${siteConfig.url.replace("https://", "").replace("http://", "")}/track/${order.orderNumber}
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td align="center" style="border-top:1px solid #e8e2d4;padding:20px 32px 28px;color:#8a8378;font-size:12px;line-height:1.7;">
            Free size exchange within 7 days.<br/>
            Questions? WhatsApp us at ${siteConfig.contact.whatsapp}<br/>
            <span style="letter-spacing:3px;color:#a8823f;">MEHRAB · HANDMADE IN PAKISTAN</span>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ── Merchant alert — sent to the shop when an order lands ─── */

export function orderAdminSubject(order: OrderRecord): string {
  const pieces = order.items.reduce((n, i) => n + i.quantity, 0);
  return `New order ${order.orderNumber} — ${rs(order.totals.total)} · ${pieces} item${pieces === 1 ? "" : "s"} · ${order.city}`;
}

/**
 * Everything staff need to act on an order without opening the site:
 * full customer + delivery details, every line with size/bottom/custom
 * measurements, totals, and one-tap admin + WhatsApp links.
 */
export function orderAdminHtml(order: OrderRecord): string {
  const label = (k: string) =>
    `<td style="padding:3px 12px 3px 0;color:#8a8378;white-space:nowrap;vertical-align:top;">${k}</td>`;
  const value = (v: string) =>
    `<td style="padding:3px 0;color:#26221f;">${v}</td>`;

  const rows = order.items
    .map((i) => {
      const custom = i.custom
        ? `<div style="margin-top:4px;padding:6px 8px;background:#faf3e3;border-left:3px solid #a8823f;font-size:12px;">
             <strong>MADE TO ORDER</strong> — ${CUSTOM_FIELDS.map((f) => `${f.fullLabel} ${i.custom![f.key]}"`).join(" · ")}
           </div>`
        : "";
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e8e2d4;">
            <strong style="color:#26221f;">${i.name}</strong><br/>
            <span style="color:#8a8378;font-size:12px;">
              ${i.color} · Size ${i.size}${i.bottomStyle ? ` · ${i.bottomStyle}` : ""} · Qty ${i.quantity} @ ${rs(i.price)}
            </span>
            ${custom}
          </td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid #e8e2d4;color:#26221f;white-space:nowrap;vertical-align:top;">
            ${rs(i.price * i.quantity)}
          </td>
        </tr>`;
    })
    .join("");

  const wa = toWhatsAppNumber(order.phone);

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #ddd;">
        <tr>
          <td style="background:#26221f;padding:16px 24px;">
            <span style="color:#f7f3ea;font-size:16px;letter-spacing:4px;">MEHRAB</span>
            <span style="float:right;color:#a8823f;font-size:13px;font-weight:bold;">NEW ORDER</span>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 24px 8px;">
            <h1 style="margin:0;font-size:18px;color:#26221f;">${order.orderNumber}</h1>
            <p style="margin:4px 0 0;font-size:13px;color:#8a8378;">
              ${new Date(order.placedAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}
              · Cash on Delivery · <strong style="color:#26221f;">${rs(order.totals.total)}</strong>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 24px 0;">
            <table role="presentation" style="font-size:13px;">
              <tr>${label("Customer")}${value(`<strong>${order.fullName}</strong>`)}</tr>
              <tr>${label("Phone")}${value(`<a href="tel:${order.phone}" style="color:#26221f;">${order.phone}</a>`)}</tr>
              <tr>${label("Email")}${value(`<a href="mailto:${order.email}" style="color:#26221f;">${order.email}</a>`)}</tr>
              <tr>${label("Address")}${value(`${order.address}, ${order.city}, ${order.province}${order.postalCode ? " " + order.postalCode : ""}`)}</tr>
              ${order.notes ? `<tr>${label("Notes")}${value(`<em>${order.notes}</em>`)}</tr>` : ""}
              ${order.couponCode ? `<tr>${label("Coupon")}${value(order.couponCode)}</tr>` : ""}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              ${rows}
              <tr><td style="padding:8px 0 0;color:#8a8378;font-size:13px;">Subtotal</td><td align="right" style="padding:8px 0 0;font-size:13px;">${rs(order.totals.subtotal)}</td></tr>
              ${order.totals.discount > 0 ? `<tr><td style="color:#8a8378;font-size:13px;">Discount</td><td align="right" style="font-size:13px;">−${rs(order.totals.discount)}</td></tr>` : ""}
              <tr><td style="color:#8a8378;font-size:13px;">Delivery (${order.city})</td><td align="right" style="font-size:13px;">${order.totals.freeShipping ? "Free" : rs(order.totals.shipping)}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;border-top:1px solid #26221f;">TO COLLECT</td><td align="right" style="padding:6px 0;font-weight:bold;border-top:1px solid #26221f;">${rs(order.totals.total)}</td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:20px 24px 24px;">
            <a href="${siteConfig.url}/admin/orders/${order.orderNumber}"
               style="display:inline-block;background:#26221f;color:#f7f3ea;text-decoration:none;font-size:13px;padding:12px 24px;margin:0 6px 8px;">
              OPEN IN ADMIN
            </a>
            <a href="https://wa.me/${wa}"
               style="display:inline-block;background:#128C7E;color:#ffffff;text-decoration:none;font-size:13px;padding:12px 24px;margin:0 6px 8px;">
              WHATSAPP CUSTOMER
            </a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
