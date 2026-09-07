import {
  Cormorant_Garamond,
  Inter,
  Noto_Nastaliq_Urdu,
} from "next/font/google";

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

/** Urdu Nastaliq, for the Urdu lines on editorial pages. */
export const fontUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "500"],
  variable: "--font-urdu",
  display: "swap",
});
