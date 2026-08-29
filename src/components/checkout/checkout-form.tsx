"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Loader2, Lock, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderSummary } from "@/components/cart/order-summary";
import { useCart, selectSubtotal } from "@/hooks/use-cart";
import { useOrders } from "@/hooks/use-orders";
import { useMounted } from "@/hooks/use-mounted";
import { placeOrder } from "@/actions/orders";
import { computeTotals, validateCoupon } from "@/lib/checkout";
import {
  DEFAULT_DELIVERY,
  deliveryFeeFor,
  type DeliverySettings,
} from "@/lib/delivery";
import {
  PROVINCES,
  checkoutSchema,
  type CheckoutInput,
} from "@/lib/validations/checkout";
import { cn } from "@/lib/utils";

export function CheckoutForm({
  delivery = DEFAULT_DELIVERY,
}: {
  delivery?: DeliverySettings;
}) {
  const router = useRouter();
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.coupon);
  const subtotal = useCart(selectSubtotal);
  const clearCart = useCart((s) => s.clear);
  const addOrder = useOrders((s) => s.add);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "cod", province: undefined },
  });

  const onSubmit = async (values: CheckoutInput) => {
    const result = await placeOrder({
      customer: { ...values, couponCode: couponCode ?? undefined },
      items,
    });
    if (!result.ok || !result.orderNumber || !result.totals) {
      toast.error(result.error ?? "Something went wrong. Please try again.");
      return;
    }
    addOrder({
      orderNumber: result.orderNumber,
      placedAt: result.placedAt ?? new Date().toISOString(),
      email: values.email,
      fullName: `${values.firstName} ${values.lastName}`,
      phone: values.phone,
      address: values.address,
      city: values.city,
      province: values.province,
      paymentMethod: values.paymentMethod,
      items,
      totals: result.totals,
    });
    clearCart();
    router.push(`/checkout/confirmation/${result.orderNumber}`);
  };

  if (mounted && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-secondary text-muted-foreground">
          <ShoppingBag className="size-7" />
        </div>
        <h1 className="mt-5 font-serif text-2xl">Nothing to check out</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Your bag is empty — add a piece before checking out.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/shop">Browse the shop</Link>
        </Button>
      </div>
    );
  }

  const coupon =
    couponCode && validateCoupon(couponCode, subtotal).ok
      ? validateCoupon(couponCode, subtotal).coupon
      : null;
  const city = watch("city");
  const total = computeTotals(
    subtotal,
    coupon,
    deliveryFeeFor(city, delivery),
    delivery
  ).total;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14"
      noValidate
    >
      {/* Left: details */}
      <div className="space-y-10">
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-xl">Contact</h2>
            <Link
              href="/account"
              className="link-underline text-xs text-muted-foreground"
            >
              Have an account? Sign in
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" error={errors.email?.message} className="sm:col-span-2">
              <Input type="email" autoComplete="email" placeholder="you@email.com" {...register("email")} />
            </Field>
            <Field label="Phone" error={errors.phone?.message} className="sm:col-span-2">
              <Input type="tel" autoComplete="tel" placeholder="03XX XXXXXXX" {...register("phone")} />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="mb-5 font-serif text-xl">Delivery address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" error={errors.firstName?.message}>
              <Input autoComplete="given-name" {...register("firstName")} />
            </Field>
            <Field label="Last name" error={errors.lastName?.message}>
              <Input autoComplete="family-name" {...register("lastName")} />
            </Field>
            <Field label="Street address" error={errors.address?.message} className="sm:col-span-2">
              <Input autoComplete="street-address" placeholder="House / flat, street, area" {...register("address")} />
            </Field>
            <Field label="City" error={errors.city?.message}>
              <Input autoComplete="address-level2" {...register("city")} />
            </Field>
            <Field label="Province" error={errors.province?.message}>
              <Controller
                control={control}
                name="province"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="Postal code (optional)" error={errors.postalCode?.message}>
              <Input inputMode="numeric" autoComplete="postal-code" placeholder="54000" {...register("postalCode")} />
            </Field>
            <Field label="Order notes (optional)" className="sm:col-span-2">
              <textarea
                {...register("notes")}
                rows={2}
                placeholder="Landmark, delivery instructions…"
                className="flex w-full rounded-md border border-input bg-transparent px-3.5 py-2.5 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-brass focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass"
              />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="mb-5 font-serif text-xl">Payment</h2>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-3">
                <PaymentOption
                  value="cod"
                  active={field.value === "cod"}
                  icon={<Banknote className="size-5" />}
                  title="Cash on Delivery"
                  desc="Pay in cash when your order arrives."
                />
              </RadioGroup>
            )}
          />
        </section>
      </div>

      {/* Right: summary + submit */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary delivery={delivery} city={city} />
        <Button
          type="submit"
          size="lg"
          className="mt-5 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Placing order…
            </>
          ) : mounted ? (
            `Place Order · ${new Intl.NumberFormat("en-PK", {
              style: "currency",
              currency: "PKR",
              maximumFractionDigits: 0,
            })
              .format(total)
              .replace("PKR", "Rs")}`
          ) : (
            "Place Order"
          )}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-2xs uppercase tracking-wide2 text-muted-foreground">
          <Lock className="size-3" /> Secure &amp; encrypted checkout
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function PaymentOption({
  value,
  active,
  icon,
  title,
  desc,
}: {
  value: string;
  active: boolean;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors",
        active ? "border-brass bg-brass/5" : "border-border hover:border-brass/50"
      )}
    >
      <RadioGroupItem value={value} />
      {icon}
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </label>
  );
}
