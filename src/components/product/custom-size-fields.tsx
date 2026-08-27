"use client";

import { AlertTriangle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CUSTOM_FIELDS, KAMEEZ_ROWS } from "@/lib/data/size-chart";
import type { CustomMeasurements } from "@/types";

export type MeasurementDraft = Partial<Record<keyof CustomMeasurements, string>>;

/**
 * Made-to-order measurement inputs — the same six fields as the size chart
 * (A–F), so a customer can read the guide and transcribe their numbers.
 */
export function CustomSizeFields({
  draft,
  onChange,
  errors,
}: {
  draft: MeasurementDraft;
  onChange: (key: keyof CustomMeasurements, value: string) => void;
  errors: Partial<Record<keyof CustomMeasurements, string>>;
}) {
  return (
    <div className="mt-4 rounded-lg border border-brass/40 bg-secondary/30 p-4">
      <p className="text-sm font-medium">Your measurements</p>
      <p className="mt-1 text-xs text-muted-foreground">
        In inches, as on our{" "}
        <a
          href="/size-guide"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brass underline-offset-4 hover:underline"
        >
          size guide
        </a>
        . Our master cutter reviews every made-to-order piece before cutting.
      </p>

      {/* Liability notice — made-to-order pieces are cut to the numbers the
          customer supplies and cannot be exchanged for fit. */}
      <div
        role="alert"
        className="mt-4 flex gap-2.5 rounded-md border border-destructive/40 bg-destructive/5 p-3"
      >
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
        <p className="text-xs leading-relaxed text-foreground">
          <strong>Please enter your measurements carefully.</strong> Made-to-order
          pieces are cut exactly to the numbers you provide, so they{" "}
          <strong>cannot be exchanged or returned for fit</strong>. Once the
          order is placed, responsibility for the measurements is yours — MEHRAB
          is not liable for a size entered incorrectly. Unsure? Check the{" "}
          <a
            href="/size-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brass underline underline-offset-4"
          >
            size guide
          </a>{" "}
          or WhatsApp us before ordering.
        </p>
      </div>

      <p className="mt-4 text-2xs uppercase tracking-wide2 text-muted-foreground">
        Kameez
      </p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {KAMEEZ_ROWS.map((f) => (
          <Field
            key={f.key}
            row={f}
            value={draft[f.key] ?? ""}
            error={errors[f.key]}
            onChange={onChange}
          />
        ))}
      </div>

      <p className="mt-4 text-2xs uppercase tracking-wide2 text-muted-foreground">
        Shalwar
      </p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {CUSTOM_FIELDS.filter((f) => f.key === "shalwarLength").map((f) => (
          <Field
            key={f.key}
            row={f}
            value={draft[f.key] ?? ""}
            error={errors[f.key]}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}

function Field({
  row,
  value,
  error,
  onChange,
}: {
  row: (typeof CUSTOM_FIELDS)[number];
  value: string;
  error?: string;
  onChange: (key: keyof CustomMeasurements, value: string) => void;
}) {
  const id = `custom-${row.key}`;
  return (
    <div>
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {row.ref} · {row.label}
      </Label>
      <div className="relative mt-1">
        <Input
          id={id}
          inputMode="decimal"
          placeholder={String(row.values.L)}
          value={value}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(row.key, e.target.value)}
          className={error ? "border-destructive pr-8" : "pr-8"}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          in
        </span>
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
