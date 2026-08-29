"use client";

import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SizeChartTables } from "@/components/shared/size-chart-tables";
import { SizeDiagram } from "@/components/shared/size-diagram";
import { KAMEEZ_ROWS, SHALWAR_ROWS } from "@/lib/data/size-chart";

/**
 * Size chart in a modal, opened from the product page — the customer keeps
 * their size/colour selection instead of navigating away mid-purchase. The
 * full /size-guide page remains for the footer link and for search engines.
 */
export function SizeGuideDialog() {
  return (
    <Dialog>
      <DialogTrigger className="link-underline text-xs text-muted-foreground transition-colors hover:text-foreground">
        Size guide
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Size guide</DialogTitle>
          <DialogDescription>
            Men regular fit · Kameez Shalwar — garment measurements, in inches.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-5">
          <div className="grid gap-6 sm:grid-cols-[1fr_170px] sm:items-start">
            <div className="min-w-0">
              <SizeChartTables compact />
            </div>
            <SizeDiagram className="mx-auto hidden h-auto w-full max-w-[170px] text-foreground sm:block" />
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <p className="text-2xs uppercase tracking-wide2 text-muted-foreground">
              How to measure
            </p>
            <dl className="mt-2 space-y-1.5 text-xs">
              {[...KAMEEZ_ROWS, ...SHALWAR_ROWS].map((row) => (
                <div key={row.key} className="flex gap-2">
                  <dt className="w-24 shrink-0 font-medium">
                    <span className="mr-1 text-brass">{row.ref}</span>
                    {row.label}
                  </dt>
                  <dd className="text-muted-foreground">{row.how}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              These are <strong className="text-foreground">garment</strong>{" "}
              measurements taken flat — chest is armpit to armpit, so it reads
              as roughly half your body chest. Between sizes? Size up.{" "}
              <Link
                href="/size-guide"
                className="text-brass underline-offset-4 hover:underline"
              >
                Open the full guide
              </Link>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
