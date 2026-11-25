import type { MetadataRoute } from "next";
import { products } from "./content";
import { absolute, imageUrl } from "./seo";
import { seriesHref, work } from "./work";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/featured", "/commercial", "/about", ...(products.length > 0 ? ["/store"] : [])];
  return [
    ...pages.map((path) => ({ url: absolute(path), priority: path === "/" ? 1 : 0.8 })),
    ...work.map((series) => ({
      url: absolute(seriesHref(series)),
      priority: 0.6,
      images: [series.cover, ...series.images].slice(0, 20).map(imageUrl),
    })),
  ];
}
