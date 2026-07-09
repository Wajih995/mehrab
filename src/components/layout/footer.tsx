import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Separator } from "@/components/ui/separator";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { footerNav } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";

const paymentMethods = ["Cash on Delivery", "Visa", "Mastercard", "Easypaisa"];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      {/* Newsletter band */}
      <div className="border-b border-border">
        <div className="container grid gap-8 py-14 md:grid-cols-2 md:items-center md:py-16">
          <div className="max-w-md">
            <p className="eyebrow mb-3">Join the House</p>
            <h2 className="font-serif text-2xl leading-tight md:text-3xl">
              Be first to new collections &amp; private offers
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Thoughtful emails only — new arrivals, restocks, and the
              occasional private sale. No noise.
            </p>
          </div>
          <div className="md:justify-self-end md:w-full md:max-w-sm">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Logo size="md" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-6 flex gap-2">
            <SocialLink href={siteConfig.socials.instagram} label="Instagram">
              <Instagram className="size-4" />
            </SocialLink>
            <SocialLink href={siteConfig.socials.facebook} label="Facebook">
              <Facebook className="size-4" />
            </SocialLink>
            <SocialLink href={siteConfig.socials.youtube} label="YouTube">
              <Youtube className="size-4" />
            </SocialLink>
          </div>
        </div>

        {footerNav.map((group) => (
          <div key={group.heading}>
            <p className="eyebrow mb-4">{group.heading}</p>
            <ul className="space-y-3">
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brass"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Separator />

      {/* Bottom bar */}
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <p className="text-2xs uppercase tracking-wide2 text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. Handmade in Pakistan.
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {paymentMethods.map((m) => (
            <li
              key={m}
              className="text-2xs uppercase tracking-wide2 text-muted-foreground"
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brass hover:text-brass"
    >
      {children}
    </Link>
  );
}
