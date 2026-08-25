import { FilterPanel } from "@/components/shop/filter-panel";
import { FilterSheet } from "@/components/shop/filter-sheet";
import { SortSelect } from "@/components/shop/sort-select";
import { ViewToggle } from "@/components/shop/view-toggle";
import { ActiveFilters } from "@/components/shop/active-filters";
import { ShopSearch } from "@/components/shop/shop-search";
import { Pagination } from "@/components/shop/pagination";
import { ProductResults } from "@/components/shop/product-results";
import { Breadcrumbs, type Crumb } from "@/components/shared/breadcrumbs";
import {
  buildFacets,
  filterProducts,
  parseFilters,
  type RawSearchParams,
} from "@/lib/shop";
import { getMenuCategoryViews } from "@/lib/repositories/products";
import type { Product } from "@/types";

interface ShopViewProps {
  /** Products in scope (all catalogue, or a single collection's products). */
  scope: Product[];
  searchParams: RawSearchParams;
  title: string;
  description?: string;
  breadcrumbs: Crumb[];
  /** Hide the collection filter group (on collection pages). */
  hideCollections?: boolean;
}

/** The complete product listing experience — filters, sort, results, paging. */
export async function ShopView({
  scope,
  searchParams,
  title,
  description,
  breadcrumbs,
  hideCollections,
}: ShopViewProps) {
  const filters = parseFilters(searchParams);
  const menuCats = await getMenuCategoryViews();
  const facets = buildFacets(
    scope,
    menuCats.map((c) => ({ slug: c.slug, name: c.label }))
  );
  const { items, total, page, totalPages } = filterProducts(scope, filters);

  return (
    <div className="container py-8 md:py-12">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      {/* Page heading */}
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl leading-tight md:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        )}
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p className="eyebrow mb-4">Refine</p>
            <FilterPanel facets={facets} hideCollections={hideCollections} />
          </div>
        </aside>

        {/* Results column */}
        <div className="min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <FilterSheet facets={facets} hideCollections={hideCollections} />
              <ShopSearch className="flex-1" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground tabular-nums">
                  {total}
                </span>{" "}
                {total === 1 ? "piece" : "pieces"}
              </p>
              <div className="flex items-center gap-2">
                <ViewToggle />
                <SortSelect />
              </div>
            </div>
            <ActiveFilters facets={facets} />
          </div>

          {/* Results */}
          <div className="mt-8">
            <ProductResults products={items} view={filters.view} />
            <Pagination page={page} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
