import { Breadcrumbs } from "@/components/shared/breadcrumbs";

/** Shared shell for editorial/policy pages (shipping, returns, about, …). */
export function InfoPage({
  eyebrow,
  title,
  intro,
  wide = false,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Full-width content (guides with imagery) instead of the narrow column. */
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`container py-10 md:py-14 ${wide ? "" : "max-w-3xl"}`}>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: title }]}
        className="mb-6"
      />
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h1>
      {intro && (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {intro}
        </p>
      )}
      <div className="mt-10 space-y-10">{children}</div>
    </div>
  );
}

/** Titled block inside an InfoPage. */
export function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-xl md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
        {children}
      </div>
    </section>
  );
}
