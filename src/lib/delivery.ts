/**
 * Delivery pricing — admin-editable, city-aware.
 *
 * MEHRAB ships from Karachi, so Karachi carries its own (cheaper) rate,
 * other named cities carry their own, and everywhere else falls back to
 * the default. Pure module: no server-only, so the checkout form can
 * price the order live as the customer types their city.
 */

export interface DeliveryZone {
  /** City name as the customer would type it. */
  city: string;
  /** Delivery charge in PKR. */
  fee: number;
}

export interface DeliverySettings {
  /** Charge for any city not listed below. */
  defaultFee: number;
  /** Subtotal at or above which delivery is free (0 disables). */
  freeShippingThreshold: number;
  zones: DeliveryZone[];
}

/** Seed used until an admin saves their own rates. */
export const DEFAULT_DELIVERY: DeliverySettings = {
  defaultFee: 350,
  freeShippingThreshold: 15000,
  zones: [
    { city: "Karachi", fee: 150 },
    { city: "Lahore", fee: 250 },
    { city: "Islamabad", fee: 250 },
    { city: "Rawalpindi", fee: 250 },
  ],
};

/** Loose match so "karachi ", "KARACHI" and "Karachi" all resolve. */
function normalise(city: string): string {
  return city.trim().toLowerCase();
}

/** The zone matching a city, or null when it falls back to the default. */
export function findZone(
  city: string | undefined,
  settings: DeliverySettings
): DeliveryZone | null {
  if (!city) return null;
  const key = normalise(city);
  return settings.zones.find((z) => normalise(z.city) === key) ?? null;
}

/**
 * Delivery charge for a city, before free-shipping and coupons are applied.
 * An unknown or not-yet-entered city gets the default rate.
 */
export function deliveryFeeFor(
  city: string | undefined,
  settings: DeliverySettings
): number {
  return findZone(city, settings)?.fee ?? settings.defaultFee;
}
