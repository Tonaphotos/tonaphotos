import Link from "next/link";
import type { CSSProperties } from "react";
import { coverSpread, spreadStyle } from "../spread";
import { photoSrc, photoSrcSet, seriesHref, type Series } from "../work";
import { HeroWatch } from "./HeroWatch";
import styles from "./spreads.module.css";

type SpreadsProps = { series: Series[]; label: string };

export function Spreads({ series, label }: SpreadsProps) {
  return (
    <main className={styles.feed} data-lenis-prevent aria-label={label}>
      <h1 className={styles.hidden}>{label}</h1>
      {series[0]?.fullBleed && <HeroWatch />}
      {series.map((entry, order) => {
        const photos = coverSpread(entry);
        const href = seriesHref(entry);
        return (
          <section
            key={entry.slug}
            className={styles.screen}
            data-bleed={entry.fullBleed ? "" : undefined}
            data-hero={entry.fullBleed && order === 0 ? "" : undefined}
            aria-label={entry.title}
          >
            <div className={styles.stage}>
              <div className={styles.spread} style={spreadStyle(photos) as CSSProperties}>
                {photos.map((photo, index) => (
                  <Link key={photo.src} href={href} className={styles.photo} tabIndex={index === 0 ? 0 : -1}>
                    <img
                      src={photoSrc(photo, 1600)}
                      srcSet={photoSrcSet(photo)}
                      sizes={entry.fullBleed ? "100vw" : photos.length > 1 ? "(min-width: 900px) 34vw, 86vw" : "(min-width: 900px) 68vw, 86vw"}
                      width={photo.width}
                      height={photo.height}
                      alt={index === 0 ? `${entry.title} by Tóna Fritsdóttir` : ""}
                      loading={order < 2 ? "eager" : "lazy"}
                      fetchPriority={order === 0 ? "high" : "auto"}
                      decoding="async"
                    />
                  </Link>
                ))}
              </div>
            </div>
            <div className={styles.caption}>
              <span className={styles.title}>{entry.title}</span>
              <Link href={href} className={styles.view} tabIndex={-1}>
                View
              </Link>
            </div>
          </section>
        );
      })}
    </main>
  );
}
