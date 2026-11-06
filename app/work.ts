import data from "./work.json";

export type Photo = { src: string; width: number; height: number };
export type Segment = { text: string; href?: string };
export type Video = { provider: "vimeo" | "youtube"; id: string; width: number; height: number };
export type Collection = "portfolio" | "featured" | "commercial";
export type Statement = { lang: string; paragraphs: string[] };

export type Series = {
  slug: string;
  title: string;
  cover: Photo;
  images: Photo[];
  statement: Statement[];
  notes: Segment[][];
  videos: Video[];
};

export const work = data as Series[];

export function photoSrc(photo: Photo, width: 800 | 1600) {
  return `${photo.src}-${width}.jpg`;
}

export function photoSrcSet(photo: Photo) {
  return `${photoSrc(photo, 800)} 800w, ${photoSrc(photo, 1600)} 1600w`;
}

const collections: Record<Collection, string[]> = {
  portfolio: [
    "enzomnia",
    "in-the-quiet",
    "pfw",
    "mob",
    "eva-marie",
    "second-skin",
    "kedima",
    "large-format",
    "vanguard-vol-51",
    "livandi-steinar",
    "nicoleta",
    "feed-me-dreams",
    "flanelle",
    "still-life",
    "masami",
    "dxi",
    "tessa",
    "oli",
    "shiromani",
    "tomyes",
    "jeff",
    "etnia-house-of-arts",
    "marine",
    "shade",
    "sono",
    "paper-dreams",
    "i-wont-disappear",
  ],
  featured: ["vanguard-vol-51", "mob", "flanelle-magazine", "enzomnia-magazine", "vanguard", "selin"],
  commercial: ["dice-kayek", "kedima", "betweeninparis", "rafael-urquizar"],
};

export function inCollection(name: Collection) {
  return collections[name].flatMap((slug) => work.filter((series) => series.slug === slug));
}

export function findSeries(slug: string) {
  return work.find((series) => series.slug === slug);
}

export function neighbours(slug: string) {
  const position = work.findIndex((series) => series.slug === slug);
  return {
    previous: work[(position - 1 + work.length) % work.length],
    next: work[(position + 1) % work.length],
  };
}

export function seriesHref(series: Series) {
  return `/work/${series.slug}`;
}
