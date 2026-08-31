"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, Check, EyeOff, MessageSquare, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteReview, setReviewVisibility } from "@/actions/reviews";
import { formatDate, cn } from "@/lib/utils";
import type { ReviewRecord } from "@/lib/reviews-shared";

/** Moderation queue — customer reviews are hidden until approved here. */
export function ReviewsTable({ reviews }: { reviews: ReviewRecord[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"pending" | "approved" | "all">(
    "pending"
  );
  const [pending, startTransition] = useTransition();

  const shown = reviews.filter((r) =>
    filter === "all" ? true : filter === "approved" ? r.approved : !r.approved
  );
  const pendingCount = reviews.filter((r) => !r.approved).length;

  const act = (fn: () => Promise<{ ok: boolean; error?: string }>, ok: string) =>
    startTransition(async () => {
      const res = await fn();
      if (res.ok) {
        toast.success(ok);
        router.refresh();
      } else {
        toast.error(res.error ?? "Action failed");
      }
    });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">
              Awaiting approval ({pendingCount})
            </SelectItem>
            <SelectItem value="approved">Published</SelectItem>
            <SelectItem value="all">All reviews</SelectItem>
          </SelectContent>
        </Select>
        {pendingCount > 0 && filter !== "pending" && (
          <span className="text-xs text-brass">
            {pendingCount} awaiting approval
          </span>
        )}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-muted-foreground">
            <MessageSquare className="size-6" />
          </div>
          <p className="mt-4 font-serif text-xl">
            {filter === "pending"
              ? "Nothing awaiting approval"
              : filter === "approved"
                ? "No published reviews yet"
                : "No reviews yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Reviews submitted on product pages appear here for approval.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {shown.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-border bg-background p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "size-3.5",
                            i < r.rating
                              ? "fill-brass text-brass"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-2xs font-medium uppercase tracking-wide2",
                        r.approved
                          ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                      )}
                    >
                      {r.approved ? "Published" : "Pending"}
                    </span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-2xs text-brass">
                        <BadgeCheck className="size-3.5" /> Verified purchase
                      </span>
                    )}
                  </div>

                  <p className="mt-2 font-medium">{r.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {r.body}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {r.author}
                    {r.location && ` · ${r.location}`} · {formatDate(r.date)}
                    {r.productName && (
                      <>
                        {" · "}
                        <span className="text-foreground">{r.productName}</span>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {r.approved ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pending}
                      onClick={() =>
                        act(
                          () => setReviewVisibility(r.id, false),
                          "Review unpublished"
                        )
                      }
                    >
                      <EyeOff className="size-4" /> Unpublish
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={pending}
                      onClick={() =>
                        act(
                          () => setReviewVisibility(r.id, true),
                          "Review published"
                        )
                      }
                    >
                      <Check className="size-4" /> Approve
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete review"
                    disabled={pending}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete this review by ${r.author}? This cannot be undone.`
                        )
                      ) {
                        act(() => deleteReview(r.id), "Review deleted");
                      }
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        Published reviews appear on the product page and set its star rating.{" "}
        <Link href="/shop" className="text-brass underline-offset-4 hover:underline">
          View the shop
        </Link>
      </p>
    </div>
  );
}
