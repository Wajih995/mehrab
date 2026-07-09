import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";

/**
 * Server-side route protection.
 *
 * Only enforced when Auth.js is configured (AUTH_SECRET + DATABASE_URL present,
 * i.e. production on Vercel). In local demo mode this is a pass-through and the
 * client-side gate in AdminShell handles /admin.
 */
const authConfigured =
  Boolean(process.env.AUTH_SECRET) && Boolean(process.env.DATABASE_URL);

const handler = authConfigured
  ? NextAuth(authConfig).auth((req) => {
      const { nextUrl } = req;
      const session = req.auth;
      const path = nextUrl.pathname;

      // Admin area requires an ADMIN role.
      if (path.startsWith("/admin") && path !== "/admin/login") {
        if (session?.user?.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/admin/login", nextUrl));
        }
      }

      // Customer account area requires a session.
      if (path.startsWith("/account")) {
        if (!session) {
          const login = new URL("/login", nextUrl);
          login.searchParams.set("callbackUrl", path);
          return NextResponse.redirect(login);
        }
      }

      return NextResponse.next();
    })
  : () => NextResponse.next();

export default handler;

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
