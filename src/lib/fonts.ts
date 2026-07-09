import { Cormorant_Garamond, Inter } from "next/font/google";

/** Display / heading serif — elegant, editorial. */
export const fontSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

/** Body / UI sans — clean and highly legible. */
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
