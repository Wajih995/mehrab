import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config (no Prisma / bcrypt imports) so it can be used
 * inside middleware. The Credentials provider + Prisma adapter are added in
 * `src/auth.ts`, which runs in the Node runtime.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // `role` is attached by the credentials authorize() below.
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CUSTOMER" | "ADMIN";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
