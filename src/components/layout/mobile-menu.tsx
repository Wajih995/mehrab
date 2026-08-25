"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import type { MegaMenuSection } from "@/types";
import { siteConfig } from "@/lib/site";

/** Hamburger-triggered slide-out navigation for small screens. */
export function MobileMenu({ nav }: { nav: MegaMenuSection[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[86%] max-w-sm p-0">
        <SheetHeader className="border-b">
          <SheetTitle asChild>
            <Logo size="sm" href={null} />
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <Accordion type="multiple" className="w-full">
            {nav.map((section) => {
              if (section.disabled) {
                return (
                  <div key={section.label} className="border-b border-border">
                    <span
                      aria-disabled="true"
                      className="flex cursor-not-allowed py-4 text-sm font-medium text-muted-foreground/50"
                    >
                      {section.label}
                    </span>
                  </div>
                );
              }
              const hasChildren = Boolean(section.columns?.length);
              if (!hasChildren) {
                return (
                  <div key={section.label} className="border-b border-border">
                    <Link
                      href={section.href}
                      onClick={() => setOpen(false)}
                      className="flex py-4 text-sm font-medium"
                    >
                      {section.label}
                    </Link>
                  </div>
                );
              }
              return (
                <AccordionItem key={section.label} value={section.label}>
                  <AccordionTrigger>{section.label}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-5">
                      {section.columns?.map((col) => (
                        <div key={col.heading}>
                          <p className="eyebrow mb-2.5">{col.heading}</p>
                          <ul className="space-y-2.5">
                            {col.items.map((item) => (
                              <li key={item.label}>
                                <Link
                                  href={item.href}
                                  onClick={() => setOpen(false)}
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
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <div className="border-t px-6 py-5 space-y-3">
          <Button asChild className="w-full" size="lg">
            <Link href="/account" onClick={() => setOpen(false)}>
              Sign in / Register
            </Link>
          </Button>
          <p className="text-center text-2xs uppercase tracking-wide2 text-muted-foreground">
            {siteConfig.contact.phone}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
