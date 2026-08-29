"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ListTree,
  Package,
  Truck,
  ShoppingBag,
  Users,
  Ticket,
  Star,
  Settings,
  LogOut,
  Menu,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Menus", href: "/admin/menus", icon: ListTree },
  { label: "Delivery", href: "/admin/delivery", icon: Truck },
  { label: "Customers", href: "/admin/customers", icon: Users, disabled: true },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket, disabled: true },
  { label: "Reviews", href: "/admin/reviews", icon: Star, disabled: true },
  { label: "Settings", href: "/admin/settings", icon: Settings, disabled: true },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const isAuthed = useAdminAuth((s) => s.isAuthed);

  const isLogin = pathname === "/admin/login";
  // Print pages render without the shell — the paper is the whole UI.
  const isPrint = pathname.endsWith("/receipt");

  // Client-side route protection (stand-in for server middleware).
  useEffect(() => {
    if (mounted && !isAuthed && !isLogin) router.replace("/admin/login");
  }, [mounted, isAuthed, isLogin, router]);

  // Login page renders bare (no shell).
  if (isLogin) return <>{children}</>;

  // Avoid a flash of protected content before the auth check resolves.
  if (!mounted || !isAuthed) {
    return (
      <div className="grid min-h-dvh place-items-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (isPrint) return <>{children}</>;

  return (
    <div className="min-h-dvh bg-secondary/30 lg:grid lg:grid-cols-[256px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden border-r border-border bg-background lg:flex lg:flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      <div className="flex min-h-dvh flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md lg:px-8">
          <MobileNav pathname={pathname} />
          <p className="font-serif text-lg lg:text-xl">
            {NAV.find((n) => n.href === pathname)?.label ??
              (pathname.startsWith("/admin/orders")
                ? "Orders"
                : pathname.startsWith("/admin/products")
                  ? "Products"
                  : "Admin")}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" target="_blank">
                <ExternalLink className="size-4" /> View store
              </Link>
            </Button>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const email = useAdminAuth((s) => s.email);
  const logout = useAdminAuth((s) => s.logout);
  const router = useRouter();

  return (
    <>
      <div className="flex h-16 items-center border-b border-border px-6">
        <Logo size="sm" href="/admin" />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          if (item.disabled) {
            return (
              <span
                key={item.label}
                className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground/50"
              >
                <Icon className="size-4" />
                {item.label}
                <span className="ml-auto text-[0.625rem] uppercase tracking-wide">
                  Soon
                </span>
              </span>
            );
          }
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-secondary"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <p className="truncate px-3 text-xs text-muted-foreground">{email}</p>
        <button
          onClick={() => {
            logout();
            router.replace("/admin/login");
          }}
          className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Admin navigation</SheetTitle>
        <div className="flex h-full flex-col">
          <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
