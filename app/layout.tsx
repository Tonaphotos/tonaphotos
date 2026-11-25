import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Libre_Caslon_Display } from "next/font/google";
import { Nav } from "./components/Nav";
import { Smooth } from "./components/Smooth";
import { site } from "./content";
import { brand, JsonLd, person, photographer, shareImage, siteDescription } from "./seo";
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

const homeTitle = `${brand} | Fashion and beauty photography by ${photographer}`;

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: homeTitle, template: `%s | ${brand}` },
  description: siteDescription,
  applicationName: brand,
  authors: [{ name: photographer, url: site }],
  creator: photographer,
  keywords: [photographer, "fashion photographer", "beauty photographer", "editorial photography", "surreal photography"],
  openGraph: { title: homeTitle, description: siteDescription, url: "/", siteName: brand, locale: "en_US", type: "website", images: [shareImage] },
  twitter: { card: "summary_large_image", images: [shareImage.url] },
  formatDetection: { email: false, telephone: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${caslon.variable} ${hanken.variable}`}>
      <body>
        <Smooth />
        <JsonLd
          data={{
            "@graph": [
              { "@type": "WebSite", "@id": `${site}/#website`, name: brand, url: site, publisher: { "@id": person["@id"] } },
              person,
            ],
          }}
        />
        <Nav />
        {children}
      </body>
    </html>
  );
}
