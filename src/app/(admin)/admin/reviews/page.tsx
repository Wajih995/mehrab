import { ReviewsTable } from "@/components/admin/reviews-table";
import { getAllReviews } from "@/lib/repositories/reviews";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl">Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Customer reviews are held here until you approve them — nothing
          appears on the storefront until you say so.
        </p>
      </div>
      <ReviewsTable reviews={reviews} />
    </div>
  );
}
