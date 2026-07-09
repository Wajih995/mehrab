import { Quote } from "lucide-react";

import { Reveal, Stagger } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { StarRating } from "@/components/shared/star-rating";
import { reviews } from "@/lib/data/products";
import { fadeUp } from "@/lib/motion";

/** Social proof — verified customer voices. */
export function Testimonials() {
  return (
    <section className="section bg-charcoal-950 text-sand-50">
      <div className="container">
        <SectionHeading
          eyebrow="Worn & Reviewed"
          title="What the house is saying"
          align="center"
          className="[&_h2]:text-sand-50 [&_p]:text-sand-50/70"
        />

        <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review) => (
            <Reveal key={review.id} variants={fadeUp}>
              <figure className="flex h-full flex-col gap-4 rounded-lg border border-sand-50/10 bg-sand-50/[0.04] p-6">
                <Quote className="size-6 text-brass" />
                <StarRating rating={review.rating} />
                <blockquote className="flex-1 text-sm leading-relaxed text-sand-50/85">
                  <p className="mb-2 font-serif text-base text-sand-50">
                    {review.title}
                  </p>
                  {review.body}
                </blockquote>
                <figcaption className="text-2xs uppercase tracking-wide2 text-sand-50/60">
                  {review.author}
                  {review.location ? ` · ${review.location}` : ""}
                  {review.verified && (
                    <span className="ml-2 text-brass-soft">Verified</span>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
