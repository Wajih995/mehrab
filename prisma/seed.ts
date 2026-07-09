import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

import { products, collections } from "../src/lib/data/products";
import { COUPONS } from "../src/lib/checkout";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MEHRAB database…");

  // ── Admin user ─────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@mehrab.pk";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "mehrab";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", passwordHash },
    create: {
      email: adminEmail,
      name: "MEHRAB Admin",
      role: "ADMIN",
      passwordHash,
    },
  });
  console.log(`  ✓ Admin user: ${adminEmail}`);

  // ── Reset catalogue (idempotent seed) ──────────────────────
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.coupon.deleteMany();

  // ── Collections ────────────────────────────────────────────
  for (const c of collections) {
    await prisma.collection.create({
      data: {
        slug: c.slug,
        name: c.name,
        description: c.description,
        image: c.image,
        season: c.season ?? null,
      },
    });
  }
  console.log(`  ✓ ${collections.length} collections`);

  // ── Products ───────────────────────────────────────────────
  for (const p of products) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        subtitle: p.subtitle ?? null,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        fabric: p.fabric,
        season: p.season,
        colors: p.colors as unknown as Prisma.InputJsonValue,
        sizes: p.sizes,
        rating: p.rating,
        reviewCount: p.reviewCount,
        badges: p.badges ?? [],
        inStock: p.inStock,
        isNew: p.isNew ?? false,
        isBestSeller: p.isBestSeller ?? false,
        specifications: p.specifications ?? undefined,
        careInstructions: p.careInstructions ?? [],
        images: {
          create: p.images.map((img, i) => ({
            url: img.url,
            alt: img.alt,
            position: i,
            isPrimary: i === 0,
          })),
        },
        collections: {
          connect: p.collectionSlugs
            .filter((slug) => collections.some((c) => c.slug === slug))
            .map((slug) => ({ slug })),
        },
      },
    });
  }
  console.log(`  ✓ ${products.length} products`);

  // ── Coupons ────────────────────────────────────────────────
  for (const c of Object.values(COUPONS)) {
    await prisma.coupon.create({
      data: {
        code: c.code,
        type: c.type,
        value: c.value,
        label: c.label,
        minSubtotal: c.minSubtotal ?? null,
      },
    });
  }
  console.log(`  ✓ ${Object.keys(COUPONS).length} coupons`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
