import type { CustomMeasurements } from "@/types";

/**
 * MEHRAB men's regular-fit size chart — Kameez + Shalwar.
 *
 * All values are GARMENT measurements in inches, taken flat. Chest is a
 * half-chest (armpit to armpit) measurement, which is why the numbers look
 * small next to a body measurement.
 *
 * The letter refs (A–F) match the callouts on the technical diagram, so the
 * chart, the diagram, and the custom-size form all speak the same language.
 */

export const CHART_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type ChartSize = (typeof CHART_SIZES)[number];

export interface MeasurementRow {
  /** Key used by the custom-size form and order records. */
  key: keyof CustomMeasurements;
  /** Diagram callout letter. */
  ref: string;
  /** Short label — unambiguous inside its own table section. */
  label: string;
  /**
   * Label for flat lists (admin, bill, WhatsApp) where kameez and shalwar
   * rows sit together and a bare "Length" would be ambiguous.
   */
  fullLabel: string;
  values: Record<ChartSize, number>;
  /** Plain-language guidance shown on the size-guide page. */
  how: string;
}

export const KAMEEZ_ROWS: MeasurementRow[] = [
  {
    key: "collar",
    ref: "A",
    label: "Collar",
    fullLabel: "Collar",
    values: { XS: 14.5, S: 15, M: 16, L: 17, XL: 18, XXL: 18.5 },
    how: "Around the base of the neck, where the collar sits.",
  },
  {
    key: "shoulder",
    ref: "B",
    label: "Shoulder",
    fullLabel: "Shoulder",
    values: { XS: 17, S: 17.5, M: 18.5, L: 19.5, XL: 20.5, XXL: 21.5 },
    how: "Seam to seam across the back.",
  },
  {
    key: "chest",
    ref: "C",
    label: "Chest",
    fullLabel: "Chest",
    values: { XS: 22, S: 23, M: 24, L: 25, XL: 27, XXL: 28.5 },
    how: "Armpit to armpit, measured flat (half the full chest).",
  },
  {
    key: "sleeveLength",
    ref: "D",
    label: "Sleeves length",
    fullLabel: "Sleeve length",
    values: { XS: 23, S: 23.5, M: 24.25, L: 25, XL: 25.5, XXL: 26 },
    how: "From the shoulder seam down to the cuff.",
  },
  {
    key: "length",
    ref: "E",
    label: "Length",
    fullLabel: "Kameez length",
    values: { XS: 39.5, S: 40.75, M: 42.25, L: 44, XL: 45.25, XXL: 46.5 },
    how: "From the base of the collar to the hem.",
  },
];

export const SHALWAR_ROWS: MeasurementRow[] = [
  {
    key: "shalwarLength",
    ref: "F",
    label: "Length",
    fullLabel: "Shalwar length",
    values: { XS: 39, S: 40, M: 42, L: 44, XL: 45, XXL: 46 },
    how: "From the waistband to the ankle hem.",
  },
];

/** Every field a made-to-order customer must supply, in form order. */
export const CUSTOM_FIELDS: MeasurementRow[] = [
  ...KAMEEZ_ROWS,
  ...SHALWAR_ROWS,
];

/** Sane bounds — rejects typos like 4 or 400 inches. */
export const MEASUREMENT_LIMITS: Record<
  keyof CustomMeasurements,
  { min: number; max: number }
> = {
  collar: { min: 12, max: 24 },
  shoulder: { min: 14, max: 28 },
  chest: { min: 18, max: 40 },
  sleeveLength: { min: 18, max: 32 },
  length: { min: 32, max: 56 },
  shalwarLength: { min: 32, max: 56 },
};

/** Human-readable summary, e.g. for the bill and WhatsApp message. */
export function formatMeasurements(m: CustomMeasurements): string {
  return CUSTOM_FIELDS.map((f) => `${f.fullLabel} ${m[f.key]}"`).join(", ");
}
