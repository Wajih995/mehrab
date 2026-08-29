import { z } from "zod";

/** Pakistani mobile: 03XXXXXXXXX or +923XXXXXXXXX (spaces/dashes tolerated). */
const phoneRegex = /^(?:\+92|0)3\d{9}$/;

export const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Kashmir",
] as const;

export const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(phoneRegex, "Enter a valid Pakistani mobile number")),
  address: z.string().min(6, "Enter your full street address"),
  city: z.string().min(2, "Required"),
  province: z.enum(PROVINCES, { message: "Select a province" }),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "Enter a 5-digit postal code")
    .optional()
    .or(z.literal("")),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(["cod"]), // COD only — no online payment
  couponCode: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

/** Cart line as sent to the server for order placement. */
/** Made-to-order measurements, bounded to reject typos. */
export const customMeasurementsSchema = z.object({
  collar: z.number().min(12).max(24),
  shoulder: z.number().min(14).max(28),
  chest: z.number().min(18).max(40),
  sleeveLength: z.number().min(18).max(32),
  length: z.number().min(32).max(56),
  shalwarLength: z.number().min(32).max(56),
});

export const orderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  name: z.string(),
  image: z.string(),
  price: z.number().nonnegative(),
  size: z.string(),
  color: z.string(),
  quantity: z.number().int().positive(),
  bottomStyle: z.enum(["Shalwar", "Pajama"]).optional(),
  custom: customMeasurementsSchema.optional(),
});

export const placeOrderSchema = z.object({
  customer: checkoutSchema,
  items: z.array(orderItemSchema).min(1, "Your bag is empty"),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
