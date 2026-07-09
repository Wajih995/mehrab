import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Brand tokens — MEHRAB */
        sand: {
          50: "hsl(var(--sand-50))",
          100: "hsl(var(--sand-100))",
          200: "hsl(var(--sand-200))",
          300: "hsl(var(--sand-300))",
          400: "hsl(var(--sand-400))",
          500: "hsl(var(--sand-500))",
        },
        charcoal: {
          50: "hsl(var(--charcoal-50))",
          100: "hsl(var(--charcoal-100))",
          300: "hsl(var(--charcoal-300))",
          500: "hsl(var(--charcoal-500))",
          700: "hsl(var(--charcoal-700))",
          900: "hsl(var(--charcoal-900))",
          950: "hsl(var(--charcoal-950))",
        },
        brass: {
          DEFAULT: "hsl(var(--brass))",
          soft: "hsl(var(--brass-soft))",
          foreground: "hsl(var(--brass-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.08em" }],
        "display-sm": ["2.5rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display-md": ["3.5rem", { lineHeight: "1.04", letterSpacing: "-0.025em" }],
        "display-lg": ["4.75rem", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "display-xl": ["6rem", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
      },
      letterSpacing: {
        luxe: "0.22em",
        wide2: "0.14em",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(24, 22, 20, 0.04), 0 4px 16px rgba(24, 22, 20, 0.05)",
        lift: "0 8px 30px rgba(24, 22, 20, 0.08), 0 2px 8px rgba(24, 22, 20, 0.05)",
        elevated: "0 24px 60px rgba(24, 22, 20, 0.14)",
      },
      maxWidth: {
        prose2: "68ch",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        "fade-in": "fade-in 0.5s var(--ease-luxe, ease) forwards",
        "fade-up": "fade-up 0.6s var(--ease-luxe, ease) forwards",
        shimmer: "shimmer 1.6s infinite",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
