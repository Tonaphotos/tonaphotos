import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Libre_Caslon_Display } from "next/font/google";
import { Nav } from "./components/Nav";
import { Smooth } from "./components/Smooth";
import { about, site } from "./content";
import { inCollection, photoSrc } from "./work";
import "./globals.css";

const caslon = Libre_Caslon_Display({
  variable: "--font-caslon",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin", "latin-ext"],
});

const description = about.lead.split(/(?<=\.)\s/)[0];
const shareImage = (inCollection("portfolio")[0] ?? inCollection("featured")[0])?.cover ?? about.portrait;

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Tona", template: "%s | Tona" },
  description,
  openGraph: {
    title: "Tona",
    description,
    url: site,
    siteName: "Tona",
    images: [{ url: photoSrc(shareImage, 1600), width: shareImage.width, height: shareImage.height }],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#e7e5e9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${caslon.variable} ${hanken.variable}`}>
      <body>
        <Smooth />
        <Nav />
        {children}
      </body>
    </html>
  );
}
