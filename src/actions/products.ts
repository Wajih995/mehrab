"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import {
  addToCatalogue,
  updateInCatalogue,
  removeFromCatalogue,
} from "@/lib/server-catalogue";
import type { Product } from "@/types";

export interface ProductActionResult {
  ok: boolean;
  error?: string;
}

/** Refresh the storefront + admin surfaces that render product data. */
function revalidateStore() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/collections");
  revalidatePath("/collections/[slug]", "page");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/admin/products");
}

function scalarData(product: Product) {
  return {
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle ?? null,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    fabric: product.fabric,
    season: product.season,
    colors: product.colors as unknown as Prisma.InputJsonValue,
    sizes: product.sizes,
    rating: product.rating,
    reviewCount: product.reviewCount,
    badges: product.badges ?? [],
    inStock: product.inStock,
    isNew: product.isNew ?? false,
    isBestSeller: product.isBestSeller ?? false,
    specifications:
      (product.specifications as unknown as Prisma.InputJsonValue) ??
      Prisma.JsonNull,
    careInstructions: product.careInstructions ?? [],
  };
}

function imageCreate(product: Product) {
  return product.images.map((img, i) => ({
    url: img.url,
    alt: img.alt,
    position: i,
    isPrimary: i === 0,
  }));
}

function collectionConnect(product: Product) {
  return product.collectionSlugs.map((slug) => ({ slug }));
}

/** Create or update a product (admin). */
export async function saveProduct(
  product: Product,
  isEdit: boolean
): Promise<ProductActionResult> {
  try {
    if (!isDbConfigured) {
      if (isEdit) updateInCatalogue(product.id, product);
      else addToCatalogue(product);
      revalidateStore();
      return { ok: true };
    }

    if (isEdit) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          ...scalarData(product),
          images: { deleteMany: {}, create: imageCreate(product) },
          collections: { set: collectionConnect(product) },
        },
      });
    } else {
      await prisma.product.create({
        data: {
          ...scalarData(product),
          images: { create: imageCreate(product) },
          collections: { connect: collectionConnect(product) },
        },
      });
    }
    revalidateStore();
    return { ok: true };
  } catch (err) {
    console.error("saveProduct failed", err);
    return { ok: false, error: "Could not save the product. Please try again." };
  }
}

/** Delete a product (admin). */
export async function deleteProduct(id: string): Promise<ProductActionResult> {
  try {
    if (!isDbConfigured) {
      removeFromCatalogue(id);
      revalidateStore();
      return { ok: true };
    }
    await prisma.product.delete({ where: { id } });
    revalidateStore();
    return { ok: true };
  } catch (err) {
    console.error("deleteProduct failed", err);
    return { ok: false, error: "Could not delete the product." };
  }
}
