import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";
import {
  getProducts,
  getMenuCategoryViews,
} from "@/lib/repositories/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [products, categories] = await Promise.all([
    getProducts(),
    getMenuCategoryViews(),
  ]);

  const staticRoutes = [
    "",
    "/shop",
    "/collections",
    "/fabrics",
    "/about",
    "/contact",
    "/faq",
    "/shipping",
    "/returns",
    "/size-guide",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${siteConfig.url}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const collectionRoutes = categories.map((c) => ({
    url: `${siteConfig.url}${c.href}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
