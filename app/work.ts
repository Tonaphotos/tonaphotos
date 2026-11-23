import { collections, work, type Collection, type Photo, type Series } from "./content";

export { work };
export type { Collection, Photo, Segment, Series, Statement, Video } from "./content";

export function photoSrc(photo: Photo, width: 800 | 1600) {
  return `${photo.src}-${width}.jpg`;
}

export function photoSrcSet(photo: Photo) {
  return `${photoSrc(photo, 800)} 800w, ${photoSrc(photo, 1600)} 1600w`;
}

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
