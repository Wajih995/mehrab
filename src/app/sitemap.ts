import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";
import { getProducts, getCollections } from "@/lib/repositories/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
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

  const collectionRoutes = collections.map((c) => ({
    url: `${siteConfig.url}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
