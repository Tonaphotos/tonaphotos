import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Libre_Caslon_Display } from "next/font/google";
import { Nav } from "./components/Nav";
import { Smooth } from "./components/Smooth";
import { site } from "./content";
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

const description =
  "Tóna Fritsdóttir is a fashion and beauty editorial photographer whose work unfolds through a poetic and surreal visual language.";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Tona", template: "%s | Tona" },
  description,
  openGraph: {
    title: "Tona",
    description,
    url: site,
    siteName: "Tona",
    images: [{ url: "/images/work/enzomnia/01-1600.jpg", width: 1600, height: 2399 }],
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
