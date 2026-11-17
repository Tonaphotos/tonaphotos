import type { Photo, Series } from "./work";

export const ratio = (photo: Photo) => photo.width / photo.height;

const isPortrait = (photo: Photo) => photo.height > photo.width * 1.05;

export function coverSpread(series: Series): Photo[] {
  const cover = series.cover;
  if (!isPortrait(cover)) return [cover];
  const candidates = series.images.filter((photo, index) => index !== series.coverIndex && isPortrait(photo));
  if (candidates.length === 0) return [cover];
  const after = candidates.filter((photo) => series.images.indexOf(photo) > series.coverIndex);
  const pool = after.length > 0 ? after : candidates;
  const partner = pool.reduce((best, photo) =>
    Math.abs(ratio(photo) - ratio(cover)) < Math.abs(ratio(best) - ratio(cover)) ? photo : best,
  );
  return [cover, partner];
}

export function spreadsOf(photos: Photo[], paired: boolean): number[][] {
  const spreads: number[][] = [];
  let index = 0;
  while (index < photos.length) {
    const next = photos[index + 1];
    if (paired && next && isPortrait(photos[index]) && isPortrait(next)) {
      spreads.push([index, index + 1]);
      index += 2;
    } else {
      spreads.push([index]);
      index += 1;
    }
  }
  return spreads;
}

export function spreadStyle(photos: Photo[]) {
  const ratios = photos.map(ratio);
  return {
    "--cols": ratios.map((value) => `${(value * 100).toFixed(2)}fr`).join(" "),
    "--r": ratios.reduce((sum, value) => sum + value, 0).toFixed(4),
    "--r1": ratios[0].toFixed(4),
    "--n": photos.length,
  };
}
