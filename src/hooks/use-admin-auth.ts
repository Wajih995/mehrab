"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Lightweight mock admin session for the demo.
 * TODO(backend): replace with NextAuth/Auth.js + a real `role` claim and
 * server-side route protection (middleware). This client gate is a stand-in.
 */
const DEMO_ADMIN = { email: "admin@mehrab.pk", password: "mehrab" };

interface AdminAuthState {
  isAuthed: boolean;
  email: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthed: false,
      email: null,
      login: (email, password) => {
        const ok =
          email.trim().toLowerCase() === DEMO_ADMIN.email &&
          password === DEMO_ADMIN.password;
        if (ok) set({ isAuthed: true, email: DEMO_ADMIN.email });
        return ok;
      },
      logout: () => set({ isAuthed: false, email: null }),
    }),
    { name: "mehrab-admin-auth" }
  )
);

export const DEMO_ADMIN_CREDENTIALS = DEMO_ADMIN;
