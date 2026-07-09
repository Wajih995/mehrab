"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { deleteProduct } from "@/actions/products";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = products.filter(
    (p) =>
      !q ||
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.fabric.toLowerCase().includes(q.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await deleteProduct(id);
      if (res.ok) {
        toast.success(`${name} deleted`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Delete failed");
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products"
            className="pl-9"
          />
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="size-4" /> Add product
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide2 text-muted-foreground">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Fabric</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-secondary/40"
                  data-pending={pending ? "" : undefined}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        {p.images[0] && (
                          <Image
                            src={p.images[0].url}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover object-top"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {p.subtitle}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{p.fabric}</td>
                  <td className="px-5 py-3">
                    <span className="font-medium tabular-nums">
                      {formatPrice(p.price)}
                    </span>
                    {p.compareAtPrice && (
                      <span className="ml-1.5 text-xs text-muted-foreground line-through">
                        {formatPrice(p.compareAtPrice)}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {p.inStock ? (
                      <Badge variant="soft">In stock</Badge>
                    ) : (
                      <Badge variant="muted">Out of stock</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" aria-label="Edit">
                        <Link href={`/admin/products/${p.id}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        disabled={pending}
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(p.id, p.name)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
