/**
 * Injects a JSON-LD structured-data block. Server component.
 * Pass any schema.org object (Product, BreadcrumbList, etc.).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Schema content is controlled/trusted (built server-side from our data).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
