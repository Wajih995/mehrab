/**
 * Technical line drawing of the kameez + shalwar with A–F measurement
 * callouts matching the size chart. Inline SVG using `currentColor` so it
 * renders correctly in both light and dark themes.
 */
export function SizeDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 460"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      role="img"
      aria-label="Diagram showing where each kameez and shalwar measurement is taken"
    >
      {/* ── Kameez ─────────────────────────────────────────── */}
      {/* Collar */}
      <path d="M126 44 L150 34 L174 44 L168 56 L150 48 L132 56 Z" />
      <path d="M150 48 L150 96" strokeDasharray="3 3" />

      {/* Body + sleeves */}
      <path
        d="M132 56
           L104 68 L74 96 L58 132 L82 146 L96 126
           L96 250 L204 250 L204 126
           L218 146 L242 132 L226 96 L196 68 L168 56"
      />
      {/* Placket */}
      <path d="M150 48 L150 250" strokeDasharray="2 4" opacity="0.5" />
      {/* Cuffs */}
      <path d="M58 132 L82 146" />
      <path d="M242 132 L218 146" />

      {/* ── Shalwar ────────────────────────────────────────── */}
      <path
        d="M104 268 L196 268
           L196 300 L176 430 L152 430 L150 322
           L148 430 L124 430 L104 300 Z"
      />
      <path d="M150 268 L150 322" strokeDasharray="3 3" opacity="0.6" />

      {/* ── Callouts ───────────────────────────────────────── */}
      <g strokeDasharray="4 3" opacity="0.65">
        {/* A — collar */}
        <path d="M174 40 L214 30" />
        {/* B — shoulder */}
        <path d="M104 68 L196 68" />
        {/* C — chest */}
        <path d="M96 110 L204 110" />
        {/* D — sleeve length: shoulder to cuff */}
        <path d="M100 62 L52 128" />
        {/* E — length: collar base to hem */}
        <path d="M262 50 L262 250" />
        <path d="M204 50 L266 50" />
        <path d="M204 250 L266 250" />
        {/* F — shalwar length */}
        <path d="M262 268 L262 430" />
        <path d="M196 268 L266 268" />
        <path d="M176 430 L266 430" />
      </g>

      <g
        fill="currentColor"
        stroke="none"
        fontSize="13"
        fontWeight="600"
        textAnchor="middle"
      >
        <text x="222" y="27">A</text>
        <text x="150" y="80">B</text>
        <text x="150" y="122">C</text>
        <text x="44" y="128">D</text>
        <text x="277" y="154">E</text>
        <text x="277" y="354">F</text>
      </g>
    </svg>
  );
}
