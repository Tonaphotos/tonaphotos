import generated from "./content.generated.json";

export type Photo = { src: string; width: number; height: number };
export type Segment = { text: string; href?: string };
export type Video = { provider: "vimeo" | "youtube"; id: string; width: number; height: number };
export type Collection = "portfolio" | "featured" | "commercial";
export type Statement = { lang: string; paragraphs: string[] };

export type Series = {
  slug: string;
  title: string;
  cover: Photo;
  fullBleed: boolean;
  coverIndex: number;
  images: Photo[];
  statement: Statement[];
  notes: Segment[][];
  videos: Video[];
};

export type Product = {
  slug: string;
  title: string;
  price: number;
  currency: "EUR";
  format: string;
  description: string[];
  photos: Photo[];
  maxQuantity: number;
};

type Content = {
  settings: { email: string; instagram: string | null; linkedin: string | null; revolutUsername: string | null };
  about: { lead: string; body: string[]; portrait: Photo };
  collections: Record<Collection, string[]>;
  series: Series[];
  products: Product[];
};

const content = generated as Content;

export const site = "https://www.tonaphotos.com";
export const { email, instagram, linkedin, revolutUsername } = content.settings;
export const about = content.about;
export const collections = content.collections;
export const work = content.series;
export const products = content.products;
