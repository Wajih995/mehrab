"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import { DELIVERY_KEY } from "@/lib/repositories/delivery";
import { writeDelivery } from "@/lib/server-delivery";
import type { DeliverySettings } from "@/lib/delivery";

export interface DeliveryActionResult {
  ok: boolean;
  error?: string;
}

const feeSchema = z
  .number({ message: "Enter a charge" })
  .int("Whole rupees only")
  .min(0, "Cannot be negative")
  .max(100000, "That looks too high");

const deliverySchema = z.object({
  defaultFee: feeSchema,
  freeShippingThreshold: z
    .number()
    .int("Whole rupees only")
    .min(0, "Cannot be negative")
    .max(10000000),
  zones: z
    .array(
      z.object({
        city: z.string().trim().min(2, "Enter a city name"),
        fee: feeSchema,
      })
    )
    .max(200, "Too many cities"),
});

/** Persist delivery rates (admin). */
export async function saveDeliverySettings(
  settings: DeliverySettings
): Promise<DeliveryActionResult> {
  const parsed = deliverySchema.safeParse(settings);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid delivery rates.",
    };
  }

  // Two rows for the same city would make pricing ambiguous.
  const seen = new Set<string>();
  for (const zone of parsed.data.zones) {
    const key = zone.city.trim().toLowerCase();
    if (seen.has(key)) {
      return { ok: false, error: `"${zone.city}" is listed twice.` };
    }
    seen.add(key);
  }

  try {
    const data = parsed.data as DeliverySettings;
    if (!isDbConfigured) {
      writeDelivery(data);
    } else {
      await prisma.siteSetting.upsert({
        where: { key: DELIVERY_KEY },
        update: { data: data as unknown as Prisma.InputJsonValue },
        create: {
          key: DELIVERY_KEY,
          data: data as unknown as Prisma.InputJsonValue,
        },
      });
    }
    // Prices appear in the cart, checkout and confirmation.
    revalidatePath("/", "layout");
    revalidatePath("/admin/delivery");
    return { ok: true };
  } catch (err) {
    console.error("saveDeliverySettings failed", err);
    return { ok: false, error: "Could not save delivery rates." };
  }
}
