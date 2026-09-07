import { PageLoader } from "@/components/shared/page-loader";

/**
 * Shown inside the storefront chrome while a page's data loads — the header,
 * footer and cart stay put, so only the content area swaps.
 */
export default function StorefrontLoading() {
  return <PageLoader />;
}
