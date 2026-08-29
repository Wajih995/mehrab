import { InfoPage } from "@/components/shared/info-page";

/**
 * Renderer for the legal policies. Content is data (headings, paragraphs,
 * bullet lists) transcribed from the official MEHRAB ESSENTIALS documents —
 * keep wording verbatim; edits belong in the source documents first.
 */

export type PolicyBlock =
  | { p: string }
  | { ul: string[] };

export interface PolicySection {
  title: string;
  blocks: PolicyBlock[];
}

export const POLICY_CONTACT = {
  email: "support@mehrabessentials.com",
  phone: "0303-6347222",
  address:
    "Business Enclave, 12th Commercial Street, Khayaban-e-Ittehad, DHA Phase 2 Extension, Karachi, Pakistan",
  website: "https://mehrabessentials.com",
};

export function PolicyPage({
  eyebrow,
  title,
  effective,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  effective: string;
  intro: string;
  sections: PolicySection[];
}) {
  return (
    <InfoPage eyebrow={eyebrow} title={title} intro={intro}>
      <p className="-mt-6 text-xs uppercase tracking-wide2 text-muted-foreground">
        Effective {effective} · mehrabessentials.com
      </p>

      {sections.map((s, i) => (
        <section key={s.title}>
          <h2 className="font-serif text-xl md:text-2xl">
            <span className="mr-2 text-brass">{i + 1}.</span>
            {s.title}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {s.blocks.map((b, n) =>
              "p" in b ? (
                <p key={n}>{b.p}</p>
              ) : (
                <ul key={n} className="list-disc space-y-1.5 pl-5">
                  {b.ul.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )
            )}
          </div>
        </section>
      ))}

      <section className="rounded-lg border border-border bg-secondary/30 p-6">
        <h2 className="font-serif text-xl">Contact Mehrab Essentials</h2>
        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <p>
            Website:{" "}
            <a href={POLICY_CONTACT.website} className="text-brass underline-offset-4 hover:underline">
              mehrabessentials.com
            </a>
          </p>
          <p>
            Email:{" "}
            <a href={`mailto:${POLICY_CONTACT.email}`} className="text-brass underline-offset-4 hover:underline">
              {POLICY_CONTACT.email}
            </a>
          </p>
          <p>WhatsApp / Phone: {POLICY_CONTACT.phone}</p>
          <p>Address: {POLICY_CONTACT.address}.</p>
        </div>
      </section>
    </InfoPage>
  );
}
