"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEMO_ADMIN_CREDENTIALS,
  useAdminAuth,
} from "@/hooks/use-admin-auth";
import { useMounted } from "@/hooks/use-mounted";

export default function AdminLoginPage() {
  const router = useRouter();
  const mounted = useMounted();
  const login = useAdminAuth((s) => s.login);
  const isAuthed = useAdminAuth((s) => s.isAuthed);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (mounted && isAuthed) router.replace("/admin");
  }, [mounted, isAuthed, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) router.replace("/admin");
    else setError(true);
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-secondary/30 px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo size="md" href={null} />
          <p className="text-2xs uppercase tracking-luxe text-muted-foreground">
            Admin Console
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-xl border border-border bg-background p-6 shadow-soft"
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                }}
                placeholder="admin@mehrab.pk"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-xs text-destructive">
                Invalid credentials. Please try again.
              </p>
            )}
            <Button type="submit" size="lg" className="w-full">
              <Lock className="size-4" /> Sign in
            </Button>
          </div>
        </form>

        <div className="mt-4 rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
          Demo credentials —{" "}
          <span className="font-medium text-foreground">
            {DEMO_ADMIN_CREDENTIALS.email}
          </span>{" "}
          / <span className="font-medium text-foreground">{DEMO_ADMIN_CREDENTIALS.password}</span>
        </div>
      </div>
    </div>
  );
}
