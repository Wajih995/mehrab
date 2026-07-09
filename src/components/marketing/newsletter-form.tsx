"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export function NewsletterForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    // Simulate a subscribe request — wire to a Server Action later.
    void values;
    await new Promise((r) => setTimeout(r, 700));
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-brass/30 bg-brass/10 px-4 py-3.5 text-sm">
        <Check className="size-4 shrink-0 text-brass" />
        <span>You&apos;re on the list. Welcome to the house of MEHRAB.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </div>
        <Button type="submit" size="lg" disabled={isSubmitting} className="shrink-0">
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">Subscribe</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
      {errors.email && (
        <p className="mt-2 text-xs text-destructive">{errors.email.message}</p>
      )}
    </form>
  );
}
