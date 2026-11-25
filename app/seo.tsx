import type { Metadata } from "next";
import { about, instagram, linkedin, site } from "./content";
import { photoSrc, type Photo } from "./work";

export const photographer = "Tóna Fritsdóttir";
export const brand = "Tona";
export const personId = `${site}/#person`;

type PageMeta = { title?: string; description: string; path: string };

export function absolute(path: string) {
  return new URL(path, site).toString();
}

export function imageUrl(photo: Photo) {
  return absolute(photoSrc(photo, 1600));
}

export function pageMeta({ title, description, path }: PageMeta): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: title ? `${title} | ${brand}` : undefined,
      description,
      url: path,
      siteName: brand,
      locale: "en_US",
      type: "website",
      images: [shareImage],
    },
    twitter: { card: "summary_large_image", images: [shareImage.url] },
  };
}

export function summary(text: string, limit = 158) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}

export const siteDescription = summary(about.lead.split(/(?<=[a-z]{2}\.)\s/)[0]);

export const shareImage = { url: "/og.png", width: 1200, height: 630, alt: brand };

export const person = {
  "@type": "Person",
  "@id": personId,
  name: photographer,
  alternateName: brand,
  jobTitle: "Fashion and beauty editorial photographer",
  description: siteDescription,
  url: site,
  image: imageUrl(about.portrait),
  sameAs: [instagram, linkedin].filter(Boolean),
};

export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
