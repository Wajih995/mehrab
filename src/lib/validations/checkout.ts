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
  // Every message names its own field: they surface in a toast on a failed
  // submit, where a bare "Required" would say nothing useful.
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .transform((v) => v.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(phoneRegex, "Enter a valid mobile number, e.g. 03001234567")),
  address: z.string().trim().min(6, "Street address is required"),
  city: z.string().trim().min(2, "City is required"),
  province: z.enum(PROVINCES, { message: "Select a province" }),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "Enter a 5-digit postal code")
    .optional()
    .or(z.literal("")),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(["cod"]), // COD only — no online payment
  acceptTerms: z
    .boolean()
    .refine((v) => v === true, "Please accept the Terms & Conditions"),
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
