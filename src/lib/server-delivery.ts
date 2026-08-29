import "server-only";

import { loadJson, saveJson } from "@/lib/server-persist";
import { DEFAULT_DELIVERY, type DeliverySettings } from "@/lib/delivery";

/**
 * Delivery-settings store for DEMO mode (no DATABASE_URL). Mirrors
 * server-navigation.ts: one shared object on `globalThis`, persisted to
 * `.data/delivery.json` so admin edits survive restarts.
 */
const globalForDelivery = globalThis as unknown as {
  __mehrabDelivery?: DeliverySettings;
};

function ensure(): DeliverySettings {
  if (!globalForDelivery.__mehrabDelivery) {
    globalForDelivery.__mehrabDelivery =
      loadJson<DeliverySettings>("delivery") ?? structuredClone(DEFAULT_DELIVERY);
  }
  return globalForDelivery.__mehrabDelivery;
}

export function readDelivery(): DeliverySettings {
  return ensure();
}

export function writeDelivery(settings: DeliverySettings): void {
  globalForDelivery.__mehrabDelivery = structuredClone(settings);
  saveJson("delivery", globalForDelivery.__mehrabDelivery);
}
