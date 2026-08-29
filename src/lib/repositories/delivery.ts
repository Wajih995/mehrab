import "server-only";

import { prisma } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import { DEFAULT_DELIVERY, type DeliverySettings } from "@/lib/delivery";
import { readDelivery } from "@/lib/server-delivery";

export const DELIVERY_KEY = "delivery";

/**
 * Live delivery rates.
 *  - Demo mode: file-backed store seeded from DEFAULT_DELIVERY.
 *  - DB mode: the `delivery` SiteSetting row (falls back to the seed
 *    until an admin saves for the first time).
 */
export async function getDeliverySettings(): Promise<DeliverySettings> {
  if (!isDbConfigured) return readDelivery();
  const row = await prisma.siteSetting.findUnique({
    where: { key: DELIVERY_KEY },
  });
  if (!row) return DEFAULT_DELIVERY;
  return row.data as unknown as DeliverySettings;
}
