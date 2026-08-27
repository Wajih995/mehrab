import { siteConfig } from "@/lib/site";
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
