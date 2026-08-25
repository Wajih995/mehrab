import type { Metadata } from "next";

import { InfoPage, InfoSection } from "@/components/shared/info-page";

export const metadata: Metadata = {
  title: "Size Guide",
  description:
    "MEHRAB size guide — kameez and shalwar measurements in inches, from XS to 3XL.",
  alternates: { canonical: "/size-guide" },
};

const SIZES = [
  { size: "XS", chest: 38, shoulder: 17.0, sleeve: 23.5, length: 38 },
  { size: "S", chest: 40, shoulder: 17.5, sleeve: 24.0, length: 39 },
  { size: "M", chest: 42, shoulder: 18.0, sleeve: 24.5, length: 40 },
  { size: "L", chest: 44, shoulder: 18.5, sleeve: 25.0, length: 41 },
  { size: "XL", chest: 46, shoulder: 19.0, sleeve: 25.5, length: 42 },
  { size: "XXL", chest: 48, shoulder: 19.5, sleeve: 26.0, length: 43 },
  { size: "3XL", chest: 50, shoulder: 20.0, sleeve: 26.5, length: 44 },
] as const;

export default function SizeGuidePage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Size Guide"
      intro="All measurements are of the garment, in inches, taken flat. Between sizes? Size up for a relaxed drape."
    >
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide2 text-muted-foreground">
              <th className="px-5 py-3 font-medium">Size</th>
              <th className="px-5 py-3 font-medium">Chest</th>
              <th className="px-5 py-3 font-medium">Shoulder</th>
              <th className="px-5 py-3 font-medium">Sleeve</th>
              <th className="px-5 py-3 font-medium">Kameez length</th>
            </tr>
          </thead>
          <tbody>
            {SIZES.map((s) => (
              <tr key={s.size} className="border-b border-border/60 last:border-0">
                <td className="px-5 py-3 font-medium">{s.size}</td>
                <td className="px-5 py-3">{s.chest}&Prime;</td>
                <td className="px-5 py-3">{s.shoulder}&Prime;</td>
                <td className="px-5 py-3">{s.sleeve}&Prime;</td>
                <td className="px-5 py-3">{s.length}&Prime;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InfoSection title="How to measure">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Chest</strong> — measure a kameez that fits you well, armpit
            to armpit, then double it.
          </li>
          <li>
            <strong>Shoulder</strong> — seam to seam across the back.
          </li>
          <li>
            <strong>Sleeve</strong> — shoulder seam to cuff.
          </li>
          <li>
            <strong>Length</strong> — collar base to hem.
          </li>
        </ul>
        <p>
          Still unsure? Send us your measurements on WhatsApp and we will
          recommend a size — or tailor one to order.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
