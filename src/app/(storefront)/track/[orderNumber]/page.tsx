import { redirect } from "next/navigation";

/**
 * Short tracking URL used in confirmation emails and WhatsApp messages —
 * mehrabessentials.com/track/MEH-XXXXXX-XXXX reads better in a message
 * than the checkout path it resolves to.
 */
export default async function TrackRedirect({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  redirect(`/checkout/confirmation/${encodeURIComponent(orderNumber)}`);
}
