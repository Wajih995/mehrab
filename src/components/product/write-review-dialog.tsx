"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitReview } from "@/actions/reviews";
import { cn } from "@/lib/utils";

/** Customer review form. Submissions are held for admin approval. */
export function WriteReviewDialog({
  productId,
  productSlug,
  productName,
}: {
  productId: string;
  productSlug: string;
  productName: string;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();

  const reset = () => {
    setRating(0);
    setHover(0);
    setAuthor("");
    setEmail("");
    setLocation("");
    setTitle("");
    setBody("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await submitReview({
        productId,
        productSlug,
        author,
        email,
        location: location || undefined,
        rating,
        title,
        body,
      });
      if (res.ok) {
        toast.success("Thank you — your review has been submitted", {
          description: "We publish reviews once our team has read them.",
        });
        setOpen(false);
        reset();
      } else {
        toast.error(res.error ?? "Could not submit your review");
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <Button
        variant="outline"
        className="mt-6 w-full"
        onClick={() => setOpen(true)}
      >
        Write a review
      </Button>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5">
          {/* Rating */}
          <div>
            <Label className="text-xs text-muted-foreground">Your rating</Label>
            <div className="mt-1.5 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  aria-pressed={rating === n}
                  className="p-0.5"
                >
                  <Star
                    className={cn(
                      "size-6 transition-colors",
                      (hover || rating) >= n
                        ? "fill-brass text-brass"
                        : "text-muted-foreground/40"
                    )}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="rev-author" className="text-xs text-muted-foreground">
                Your name
              </Label>
              <Input
                id="rev-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ahmed Raza"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="rev-city" className="text-xs text-muted-foreground">
                City (optional)
              </Label>
              <Input
                id="rev-city"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Karachi"
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="rev-email" className="text-xs text-muted-foreground">
              Email
            </Label>
            <Input
              id="rev-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="mt-1.5"
              required
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Never published. Used only to confirm a verified purchase.
            </p>
          </div>

          <div className="mt-4">
            <Label htmlFor="rev-title" className="text-xs text-muted-foreground">
              Headline
            </Label>
            <Input
              id="rev-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Excellent fabric and finishing"
              className="mt-1.5"
              required
            />
          </div>

          <div className="mt-4">
            <Label htmlFor="rev-body" className="text-xs text-muted-foreground">
              Your review
            </Label>
            <textarea
              id="rev-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="How is the fit, fabric and stitching?"
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brass"
              required
            />
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending || rating === 0}>
              {pending ? "Submitting…" : "Submit review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
