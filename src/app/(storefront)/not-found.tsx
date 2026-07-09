import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow mb-4">Error 404</p>
      <h1 className="font-serif text-display-sm leading-none md:text-display-md">
        Lost the thread
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you&apos;re looking for has moved or never existed. Let&apos;s
        get you back to something beautiful.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">Return home</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/shop">Browse the shop</Link>
        </Button>
      </div>
    </div>
  );
}
