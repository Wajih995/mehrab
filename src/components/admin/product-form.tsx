"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { saveProduct } from "@/actions/products";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { collections } from "@/lib/data/products";
import { cn, slugify } from "@/lib/utils";
import type {
  FabricType,
  Product,
  ProductImage,
  Season,
  SizeCode,
} from "@/types";

const FABRICS: FabricType[] = [
  "Wash & Wear",
  "Cotton",
  "Egyptian Cotton",
  "Linen",
  "Karandi",
  "Boski",
  "Cottonel",
  "Premium Blended",
];
const SEASONS: Season[] = ["All Season", "Summer", "Winter", "Festive"];
const SIZES: SizeCode[] = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

interface ProductFormProps {
  /** Existing product for edit mode; omit to create. */
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [subtitle, setSubtitle] = useState(product?.subtitle ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [compareAt, setCompareAt] = useState(
    product?.compareAtPrice ? String(product.compareAtPrice) : ""
  );
  const [fabric, setFabric] = useState<FabricType>(product?.fabric ?? "Egyptian Cotton");
  const [season, setSeason] = useState<Season>(product?.season ?? "All Season");
  const [sizes, setSizes] = useState<SizeCode[]>(product?.sizes ?? ["M", "L", "XL"]);
  const [colors, setColors] = useState(
    product?.colors ?? [{ name: "Charcoal", hex: "#26221f" }]
  );
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);
  const [collectionSlugs, setCollectionSlugs] = useState<string[]>(
    product?.collectionSlugs ?? []
  );
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);
  const [imageUrl, setImageUrl] = useState("");

  // Keep slug in sync while creating (unless the user has edited it).
  const onNameChange = (v: string) => {
    setName(v);
    if (!isEdit) setSlug(slugify(v));
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, { url: imageUrl.trim(), alt: name || "Product image" }]);
    setImageUrl("");
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Image is too large (max 2MB). Paste a URL instead.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImages((prev) => [
        ...prev,
        { url: reader.result as string, alt: name || "Product image" },
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const toggleSize = (s: SizeCode) =>
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  const toggleCollection = (slugValue: string) =>
    setCollectionSlugs((prev) =>
      prev.includes(slugValue)
        ? prev.filter((x) => x !== slugValue)
        : [...prev, slugValue]
    );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Product name is required");
    if (!price || Number(price) <= 0) return toast.error("Enter a valid price");
    if (images.length === 0) return toast.error("Add at least one image");
    if (sizes.length === 0) return toast.error("Select at least one size");

    const payload: Product = {
      id: product?.id ?? `p-${slugify(name)}-${Date.now().toString(36)}`,
      slug: slug || slugify(name),
      name: name.trim(),
      subtitle: subtitle.trim() || undefined,
      description: description.trim(),
      price: Number(price),
      compareAtPrice: compareAt ? Number(compareAt) : undefined,
      images: images.map((img, i) => ({ ...img, isPrimary: i === 0 })),
      fabric,
      season,
      collectionSlugs,
      colors,
      sizes,
      rating: product?.rating ?? 5,
      reviewCount: product?.reviewCount ?? 0,
      badges: [
        ...(isNew ? (["New"] as const) : []),
        ...(isBestSeller ? (["Best Seller"] as const) : []),
        ...(compareAt ? (["Sale"] as const) : []),
      ],
      inStock,
      isNew,
      isBestSeller,
      specifications: product?.specifications,
      careInstructions: product?.careInstructions,
      createdAt: product?.createdAt ?? new Date().toISOString().slice(0, 10),
    };

    startTransition(async () => {
      const res = await saveProduct(payload, isEdit);
      if (!res.ok) {
        toast.error(res.error ?? "Could not save the product");
        return;
      }
      toast.success(isEdit ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Products
          </Link>
          <h1 className="mt-2 font-serif text-2xl md:text-3xl">
            {isEdit ? "Edit product" : "New product"}
          </h1>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="space-y-6">
          <Card title="Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldRow label="Product name" className="sm:col-span-2">
                <Input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="Noor Signature Kameez" />
              </FieldRow>
              <FieldRow label="Subtitle" className="sm:col-span-2">
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Egyptian Cotton · Charcoal" />
              </FieldRow>
              <FieldRow label="URL slug" className="sm:col-span-2">
                <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="noor-signature-charcoal" />
              </FieldRow>
              <FieldRow label="Description" className="sm:col-span-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the fabric, cut and finish…"
                  className="flex w-full rounded-md border border-input bg-transparent px-3.5 py-2.5 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-brass focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass"
                />
              </FieldRow>
            </div>
          </Card>

          <Card title="Media">
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div
                  key={img.url + i}
                  className="group relative aspect-[3/4] w-24 overflow-hidden rounded-md border border-border bg-muted"
                >
                  <Image src={img.url} alt={img.alt} fill sizes="96px" className="object-cover object-top" />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[0.5625rem] font-medium uppercase text-primary-foreground">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                    aria-label="Remove image"
                    className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/90 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
              <label className="grid aspect-[3/4] w-24 cursor-pointer place-items-center rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:border-brass hover:text-brass">
                <input type="file" accept="image/*" className="hidden" onChange={onFileUpload} />
                <div className="flex flex-col items-center gap-1 text-center">
                  <Upload className="size-5" />
                  <span className="text-2xs">Upload</span>
                </div>
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <ImagePlus className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                  placeholder="Or paste an image URL"
                  className="pl-9"
                />
              </div>
              <Button type="button" variant="outline" onClick={addImageUrl}>
                Add
              </Button>
            </div>
            <p className="mt-2 text-2xs text-muted-foreground">
              First image is the primary. Uploads max 2MB (stored locally for demo).
            </p>
          </Card>

          <Card title="Variants">
            <div className="space-y-5">
              <div>
                <Label className="mb-2 block text-xs text-muted-foreground">Sizes</Label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={cn(
                        "grid h-9 min-w-9 place-items-center rounded-md border px-2 text-xs font-medium transition-colors",
                        sizes.includes(s)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input hover:border-brass"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block text-xs text-muted-foreground">Colours</Label>
                <div className="space-y-2">
                  {colors.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={c.hex}
                        onChange={(e) =>
                          setColors((prev) =>
                            prev.map((x, idx) => (idx === i ? { ...x, hex: e.target.value } : x))
                          )
                        }
                        className="size-9 shrink-0 cursor-pointer rounded-md border border-input bg-transparent"
                        aria-label="Colour swatch"
                      />
                      <Input
                        value={c.name}
                        onChange={(e) =>
                          setColors((prev) =>
                            prev.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x))
                          )
                        }
                        placeholder="Colour name"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setColors((prev) => prev.filter((_, idx) => idx !== i))}
                        aria-label="Remove colour"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setColors((prev) => [...prev, { name: "", hex: "#cdbfa6" }])}
                  >
                    Add colour
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <Card title="Pricing">
            <div className="space-y-4">
              <FieldRow label="Price (Rs)">
                <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="12900" />
              </FieldRow>
              <FieldRow label="Compare-at price (Rs)">
                <Input type="number" min={0} value={compareAt} onChange={(e) => setCompareAt(e.target.value)} placeholder="15900" />
              </FieldRow>
            </div>
          </Card>

          <Card title="Organisation">
            <div className="space-y-4">
              <FieldRow label="Fabric">
                <Select value={fabric} onValueChange={(v) => setFabric(v as FabricType)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FABRICS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Season">
                <Select value={season} onValueChange={(v) => setSeason(v as Season)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SEASONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FieldRow>
              <div>
                <Label className="mb-2 block text-xs text-muted-foreground">Collections</Label>
                <div className="space-y-2">
                  {collections.map((c) => (
                    <label key={c.slug} className="flex cursor-pointer items-center gap-2.5 text-sm">
                      <Checkbox
                        checked={collectionSlugs.includes(c.slug)}
                        onCheckedChange={() => toggleCollection(c.slug)}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Status">
            <div className="space-y-3">
              <ToggleRow label="In stock" checked={inStock} onCheckedChange={setInStock} />
              <ToggleRow label="Mark as New" checked={isNew} onCheckedChange={setIsNew} />
              <ToggleRow label="Best seller" checked={isBestSeller} onCheckedChange={setIsBestSeller} />
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile actions */}
      <div className="flex gap-2 sm:hidden">
        <Button type="button" variant="outline" className="flex-1" asChild>
          <Link href="/admin/products">Cancel</Link>
        </Button>
        <Button type="submit" className="flex-1" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save" : "Create"}
        </Button>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <h2 className="mb-4 font-serif text-lg">{title}</h2>
      {children}
    </div>
  );
}

function FieldRow({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
