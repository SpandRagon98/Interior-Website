import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const siteUrl = "https://spandragon98.github.io/Interior-Website";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600"] });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "House of Veya — Luxury interiors, composed around you", template: "%s | House of Veya" },
  description: "Bespoke full-home interiors shaped by architecture, craft and the way you live.",
  openGraph: { title: "House of Veya", description: "Bespoke full-home interiors shaped by architecture, craft and the way you live.", type: "website", locale: "en_IN" },
  twitter: { card: "summary", title: "House of Veya", description: "Bespoke full-home interiors shaped by architecture, craft and the way you live." },
  icons: { icon: `${basePath}/favicon.svg`, shortcut: `${basePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { "@context": "https://schema.org", "@type": "InteriorDesigner", name: "House of Veya", url: siteUrl, areaServed: ["Kolkata", "Bengaluru", "Mumbai", "Delhi NCR", "Pune", "Hyderabad"], priceRange: "₹₹₹" };
  return <html lang="en"><body className={`${body.variable} ${display.variable} antialiased`}>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></body></html>;
}
