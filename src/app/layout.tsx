import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Pizzara Restaurant — İyi Malzeme, Gerçek Lezzet",
  description:
    "Pizzara Restaurant — taze malzeme, ustaca dokunuş. Her tabakta gerçek İtalyan ruhu. İstanbul'da rezervasyon yapın.",
  openGraph: {
    title: "Pizzara Restaurant",
    description: "İyi malzeme, gerçek lezzet.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable}`}>
      <body className="bg-paper min-h-screen">{children}</body>
    </html>
  );
}
