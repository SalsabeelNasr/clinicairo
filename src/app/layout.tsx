import type { ReactNode } from "react";
import { IBM_Plex_Sans_Arabic, Outfit } from "next/font/google";
import "./globals.css";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

// TailAdmin's Latin/numeral font; Arabic glyphs fall back to IBM Plex Sans Arabic.
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${ibmPlexSansArabic.variable} ${outfit.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
