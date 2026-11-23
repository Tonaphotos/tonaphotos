import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./components/spreads.module.css";
import { coverSpread, spreadStyle } from "./spread";
import { inCollection, photoSrc, photoSrcSet, seriesHref } from "./work";

export const metadata: Metadata = { title: "Not found" };

function strayPick() {
  const portfolio = inCollection("portfolio");
  return portfolio[1] ?? portfolio[0] ?? inCollection("featured")[0];
}

export default function NotFound() {
  const series = strayPick();
  const photos = series ? coverSpread(series) : [];

  return (
    <main className={styles.screen}>
      <div className={styles.stage}>
        {series && (
          <div className={styles.spread} style={spreadStyle(photos) as CSSProperties}>
            {photos.map((photo, index) => (
              <Link
                key={photo.src}
                href={seriesHref(series)}
                className={styles.photo}
                tabIndex={index === 0 ? 0 : -1}
              >
                <img
                  src={photoSrc(photo, 1600)}
                  srcSet={photoSrcSet(photo)}
                  sizes={photos.length > 1 ? "(min-width: 900px) 34vw, 86vw" : "(min-width: 900px) 68vw, 86vw"}
                  width={photo.width}
                  height={photo.height}
                  alt={index === 0 ? series.title : ""}
                  fetchPriority="high"
                  decoding="async"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className={styles.caption}>
        <h1 className={styles.title}>This page drifted away</h1>
        <Link href="/" className={styles.view}>
          Back to the work
        </Link>
      </div>
    </main>
  );
}
