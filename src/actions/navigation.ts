"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import { MAIN_NAV_KEY } from "@/lib/repositories/navigation";
import { writeMainNav } from "@/lib/server-navigation";
import type { MegaMenuSection } from "@/types";

export interface NavigationActionResult {
  ok: boolean;
  error?: string;
}

const navItemSchema = z.object({
  label: z.string().trim().min(1, "Item label is required"),
  href: z.string().trim().min(1, "Item link is required"),
  description: z.string().optional(),
});

const sectionSchema = z.object({
  label: z.string().trim().min(1, "Menu label is required"),
  href: z.string().trim().min(1, "Menu link is required"),
  disabled: z.boolean().optional(),
  columns: z
    .array(
      z.object({
        heading: z.string().trim().min(1, "Column heading is required"),
        items: z.array(navItemSchema),
      })
    )
    .optional(),
  featured: z
    .object({
      title: z.string(),
      href: z.string(),
      image: z.string(),
      cta: z.string(),
    })
    .optional(),
});

const mainNavSchema = z.array(sectionSchema).min(1, "Add at least one menu");

/** Persist the primary navigation (admin). */
export async function saveMainNav(
  sections: MegaMenuSection[]
): Promise<NavigationActionResult> {
  const parsed = mainNavSchema.safeParse(sections);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid menu data.",
    };
  }

  try {
    const data = parsed.data as MegaMenuSection[];
    if (!isDbConfigured) {
      writeMainNav(data);
    } else {
      await prisma.siteMenu.upsert({
        where: { key: MAIN_NAV_KEY },
        update: { data: data as unknown as Prisma.InputJsonValue },
        create: {
          key: MAIN_NAV_KEY,
          data: data as unknown as Prisma.InputJsonValue,
        },
      });
    }
    // Header renders in the storefront layout — refresh every page under it.
    revalidatePath("/", "layout");
    revalidatePath("/admin/menus");
    return { ok: true };
  } catch (err) {
    console.error("saveMainNav failed", err);
    return { ok: false, error: "Could not save the menu. Please try again." };
  }
}
