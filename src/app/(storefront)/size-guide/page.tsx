import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Logo } from "@/components/layout/logo";
import { SizeDiagram } from "@/components/shared/size-diagram";
import { SizeChartTables } from "@/components/shared/size-chart-tables";
import { KAMEEZ_ROWS, SHALWAR_ROWS } from "@/lib/data/size-chart";

export const metadata: Metadata = {
  title: "Size Guide",
  description:
    "MEHRAB men's regular fit size guide — kameez and shalwar measurements in inches, XS to XXL, plus made-to-order sizing.",
  alternates: { canonical: "/size-guide" },
};

export default function SizeGuidePage() {
  return (
    <div className="container py-10 md:py-14">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Size Guide" }]}
        className="mb-6"
      />

      <p className="text-2xs uppercase tracking-luxe text-muted-foreground">
        Men Regular Fit / Kameez Shalwar
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
        {/* Left: brand mark + tables */}
        <div>
          <Logo size="md" href={null} className="mb-10" />

          <SizeChartTables />

          {/* How to measure */}
          <div className="mt-12">
            <h2 className="font-serif text-xl md:text-2xl">How to measure</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[...KAMEEZ_ROWS, ...SHALWAR_ROWS].map((row) => (
                <div key={row.key} className="flex gap-3">
                  <dt className="w-28 shrink-0 font-medium">
                    <span className="mr-1.5 text-brass">{row.ref}</span>
                    {row.label}
                  </dt>
                  <dd className="text-muted-foreground">{row.how}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              These are <strong className="text-foreground">garment</strong>{" "}
              measurements taken flat, not body measurements — chest is armpit
              to armpit, so it reads as roughly half your body chest. Between
              two sizes? Size up for a relaxed drape.
            </p>
          </div>

          {/* Made to order */}
          <div className="mt-10 rounded-lg border border-brass/40 bg-secondary/30 p-6">
            <h2 className="font-serif text-xl">Made to order</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              None of these quite right? Choose{" "}
              <strong className="text-foreground">Custom</strong> on any product
              page and enter your own six measurements — our Lahore atelier cuts
              the piece to your numbers at no extra charge. Made-to-order pieces
              add 3–4 working days and are exchange-only.
            </p>
          </div>
        </div>

        {/* Right: diagram */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-6">
            <SizeDiagram className="mx-auto h-auto w-full max-w-[260px] text-foreground" />
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Letters match the rows in the tables.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

