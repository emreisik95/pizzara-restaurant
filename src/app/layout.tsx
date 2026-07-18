import type { Metadata, Viewport } from "next";
import { Antonio, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { readTheme, themeCss } from "@/lib/theme";

const display = Antonio({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pizzara Restaurant — İyi Malzeme, Gerçek Lezzet",
  description:
    "Pizzara Restaurant — taze malzeme, ustaca dokunuş. Her tabakta gerçek İtalyan ruhu. İstanbul'da rezervasyon yapın.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1e1410",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = readTheme();
  return (
    <html lang="tr" className={`${display.variable} ${serif.variable} ${body.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss(theme) }} />
      </head>
      <body className="min-h-screen">
        <a href="#main-content" className="skip-link">İçeriğe geç</a>
        {children}
      </body>
    </html>
  );
}
