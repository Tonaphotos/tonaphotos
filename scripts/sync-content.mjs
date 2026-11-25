import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const projectId = "riebh78y";
const dataset = "production";
const imageDir = join(root, "public/images/cms");
const output = join(root, "app/content.generated.json");
const widths = [800, 1600];

const assetFields = `{ _id, url, "width": metadata.dimensions.width, "height": metadata.dimensions.height }`;

const query = `{
  "settings": *[_id == "settings"][0]{ email, instagram, linkedin, revolutUsername },
  "about": *[_id == "about"][0]{ lead, body, "portrait": portrait.asset->${assetFields} },
  "collections": {
    "portfolio": *[_id == "portfolio"][0].series[]->slug.current,
    "featured": *[_id == "featured"][0].series[]->slug.current,
    "commercial": *[_id == "commercial"][0].series[]->slug.current
  },
  "series": *[_type == "series" && defined(slug.current) && defined(cover.asset)]{
    title,
    "slug": slug.current,
    "fullBleed": fullBleed == true,
    "cover": cover.asset->${assetFields},
    "photos": coalesce(photos[defined(asset)].asset->${assetFields}, []),
    "statement": coalesce(statement[]{ language, text }, []),
    "credits": coalesce(credits, []),
    "films": coalesce(films[defined(url)]{ url, vertical }, [])
  },
  "products": coalesce(*[_id == "store"][0].products[]->{
    available,
    title,
    "slug": slug.current,
    price,
    format,
    description,
    maxQuantity,
    "photos": coalesce(photos[defined(asset)].asset->${assetFields}, [])
  }, [])
}`;

async function fetchContent() {
  const url = new URL(`https://${projectId}.apicdn.sanity.io/v2025-02-19/data/query/${dataset}`);
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", "published");
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Sanity query failed: ${response.status} ${await response.text()}`);
  return (await response.json()).result;
}

const downloads = new Map();

function photoOf(asset) {
  const id = asset._id.replace(/^image-/, "");
  const scale = Math.min(1, 1600 / asset.width);
  downloads.set(id, asset.url);
  return { src: `/images/cms/${id}`, width: Math.round(asset.width * scale), height: Math.round(asset.height * scale) };
}

async function download(id, url) {
  for (const width of widths) {
    const file = join(imageDir, `${id}-${width}.jpg`);
    if (existsSync(file)) continue;
    const source = `${url}?w=${width}&fit=max&fm=jpg&q=80`;
    for (let attempt = 1; ; attempt += 1) {
      const response = await fetch(source);
      if (response.ok) {
        writeFileSync(file, Buffer.from(await response.arrayBuffer()));
        break;
      }
      if (attempt === 4) throw new Error(`Image download failed: ${response.status} ${source}`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
}

function paragraphs(text) {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

function notesOf(blocks) {
  return blocks
    .filter((block) => block._type === "block")
    .map((block) =>
      (block.children ?? []).map((span) => {
        const link = (block.markDefs ?? []).find((mark) => span.marks?.includes(mark._key) && mark._type === "link");
        return link?.href ? { text: span.text, href: link.href } : { text: span.text };
      }),
    )
    .filter((segments) => segments.some((segment) => segment.text.trim()));
}

async function filmSize(provider, url, vertical) {
  const fallback = vertical ? { width: 9, height: 16 } : { width: 16, height: 9 };
  if (vertical || provider !== "vimeo") return fallback;
  try {
    const response = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`);
    if (!response.ok) return fallback;
    const { width, height } = await response.json();
    return width > 0 && height > 0 ? { width, height } : fallback;
  } catch {
    return fallback;
  }
}

async function videoOf(film) {
  const vimeo = film.url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  const youtube = film.url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  const provider = vimeo ? "vimeo" : youtube ? "youtube" : null;
  if (!provider) return null;
  const id = (vimeo ?? youtube)[1];
  return { provider, id, ...(await filmSize(provider, film.url, film.vertical)) };
}

async function seriesOf(entry) {
  const images = entry.photos.map(photoOf);
  return {
    slug: entry.slug,
    title: entry.title,
    cover: photoOf(entry.cover),
    fullBleed: entry.fullBleed,
    coverIndex: entry.photos.findIndex((photo) => photo._id === entry.cover._id),
    images,
    statement: entry.statement
      .map((version) => ({ lang: version.language || "en", paragraphs: paragraphs(version.text) }))
      .filter((version) => version.paragraphs.length > 0),
    notes: notesOf(entry.credits),
    videos: (await Promise.all(entry.films.map(videoOf))).filter(Boolean),
  };
}

const content = await fetchContent();
if (!content?.series?.length) throw new Error("Sanity returned no published series.");
if (!content.settings?.email) throw new Error("Sanity settings are missing an email.");
if (!content.about?.portrait) throw new Error("Sanity about page is missing a portrait.");

const series = await Promise.all(content.series.map(seriesOf));
const known = new Set(series.map((entry) => entry.slug));
const collections = Object.fromEntries(
  ["portfolio", "featured", "commercial"].map((name) => [
    name,
    [...new Set(content.collections[name] ?? [])].filter((slug) => known.has(slug)),
  ]),
);
const listed = [...new Set(Object.values(collections).flat())];
const position = (slug) => (listed.includes(slug) ? listed.indexOf(slug) : listed.length);
series.sort((a, b) => position(a.slug) - position(b.slug) || a.title.localeCompare(b.title));

const generated = {
  settings: {
    email: content.settings.email,
    instagram: content.settings.instagram ?? null,
    linkedin: content.settings.linkedin ?? null,
    revolutUsername: content.settings.revolutUsername?.replace(/^@/, "") || null,
  },
  about: {
    lead: content.about.lead ?? "",
    body: paragraphs(content.about.body),
    portrait: photoOf(content.about.portrait),
  },
  collections,
  series,
  products: content.products
    .filter((product) => product?.available && product.slug)
    .map((product) => ({
    slug: product.slug,
    title: product.title,
    price: product.price,
    currency: "EUR",
    format: product.format ?? "",
    description: paragraphs(product.description),
    photos: product.photos.map(photoOf),
    maxQuantity: product.maxQuantity ?? 9,
  })),
};

mkdirSync(imageDir, { recursive: true });
const queue = [...downloads.entries()];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    for (let next = queue.shift(); next; next = queue.shift()) await download(...next);
  }),
);
writeFileSync(output, JSON.stringify(generated, null, 1));
console.log(
  `Synced ${series.length} series, ${generated.products.length} products and ${downloads.size} images from Sanity.`,
);
