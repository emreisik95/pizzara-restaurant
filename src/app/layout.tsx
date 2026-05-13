import type { Metadata } from "next";
import { Antonio, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Antonio({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pizzara Restaurant — İyi Malzeme, Gerçek Lezzet",
  description:
    "Pizzara Restaurant — taze malzeme, ustaca dokunuş. Her tabakta gerçek İtalyan ruhu. İstanbul'da rezervasyon yapın.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${serif.variable} ${body.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
