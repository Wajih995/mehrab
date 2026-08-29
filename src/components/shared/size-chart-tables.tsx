import {
  CHART_SIZES,
  KAMEEZ_ROWS,
  SHALWAR_ROWS,
  type MeasurementRow,
} from "@/lib/data/size-chart";
import { cn } from "@/lib/utils";

/**
 * The measurement tables, shared by the full /size-guide page and the
 * product-page dialog so the numbers can never drift between them.
 */
export function MeasurementTable({
  title,
  rows,
  className,
  compact = false,
}: {
  title: string;
  rows: MeasurementRow[];
  className?: string;
  /** Tighter type + padding, for the modal. */
  compact?: boolean;
}) {
  return (
    <section className={className}>
      <h3
        className={cn(
          "mb-2 font-serif",
          compact ? "text-base" : "mb-3 text-xl md:text-2xl"
        )}
      >
        {title}
      </h3>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table
          className={cn(
            "w-full",
            compact ? "min-w-[440px] text-xs" : "min-w-[520px] text-sm"
          )}
        >
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wide2 text-muted-foreground">
              <th className={cn("w-8 text-left font-medium", compact ? "px-2 py-2" : "px-3 py-3")} />
              <th className={cn("text-left font-medium", compact ? "px-2 py-2" : "px-3 py-3")}>
                Size
              </th>
              {CHART_SIZES.map((s) => (
                <th
                  key={s}
                  className={cn("text-center font-medium", compact ? "px-2 py-2" : "px-3 py-3")}
                >
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-border/60 last:border-0">
                <td className={cn("text-center font-medium text-brass", compact ? "px-2 py-2" : "px-3 py-3")}>
                  {row.ref}
                </td>
                <td
                  className={cn(
                    "whitespace-nowrap uppercase text-muted-foreground",
                    compact ? "px-2 py-2" : "px-3 py-3"
                  )}
                >
                  {row.label}
                </td>
                {CHART_SIZES.map((s) => (
                  <td
                    key={s}
                    className={cn("text-center tabular-nums", compact ? "px-2 py-2" : "px-3 py-3")}
                  >
                    {row.values[s]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Both tables plus the inches note — the whole chart in one block. */
export function SizeChartTables({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <MeasurementTable title="Kameez" rows={KAMEEZ_ROWS} compact={compact} />
      <MeasurementTable
        title="Shalwar"
        rows={SHALWAR_ROWS}
        compact={compact}
        className={compact ? "mt-5" : "mt-10"}
      />
      <p className={cn("text-muted-foreground", compact ? "mt-3 text-xs" : "mt-6 text-sm")}>
        All given measurements are in inches.
      </p>
    </>
  );
}
