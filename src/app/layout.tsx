import type { Metadata, Viewport } from "next";
import { Suspense } from "react";

import { fontSans, fontSerif, fontUrdu } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { NavigationProgress } from "@/components/shared/navigation-progress";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "shalwar kameez",
    "men's shalwar kameez",
    "premium menswear Pakistan",
    "eastern wear",
    "kurta",
    "MEHRAB",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f0" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          fontSerif.variable,
          fontUrdu.variable,
          "min-h-dvh font-sans"
        )}
      >
        {/* Suspense keeps the useSearchParams() read inside this client
            component from opting every static page into dynamic rendering. */}
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
