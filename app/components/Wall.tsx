"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { useMountEffect } from "../hooks/useMountEffect";
import { photoSrc, photoSrcSet, seriesHref, type Series } from "../work";
import styles from "./wall.module.css";

const speeds = [1, 1.16, 0.9, 1.08];

type WallProps = { heading: string; fit: number; series: Series[] };

function columnsOf(series: Series[], count: number) {
  return Array.from({ length: count }, (_, column) => series.filter((_, index) => index % count === column));
}

export function Wall({ heading, fit, series }: WallProps) {
  const columns = useRef<(HTMLUListElement | null)[]>([]);

  useMountEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const scroll = window.scrollY * (window.innerWidth < 900 ? 0.4 : 1);
      columns.current.forEach((element, index) => {
        if (!element) return;
        element.style.translate = `0 ${((1 - speeds[index % speeds.length]) * scroll).toFixed(1)}px`;
      });
    };
    const watch = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", watch, { passive: true });
    window.addEventListener("resize", watch);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", watch);
      window.removeEventListener("resize", watch);
    };
  });

  return (
    <section className={styles.wall}>
      <div className={styles.pin}>
        <h1 className={styles.heading} style={{ "--fit": fit } as CSSProperties}>
          {heading}
        </h1>
      </div>
      {([4, 2] as const).map((count) => (
        <div key={count} className={count === 4 ? styles.wide : styles.narrow}>
          {columnsOf(series, count).map((column, c) => (
            <ul
              key={c}
              ref={(element) => {
                columns.current[(count === 4 ? 0 : 4) + c] = element;
              }}
              className={styles.column}
            >
              {column.map((entry, row) => (
                <li key={entry.slug} style={{ "--order": c + row * count } as CSSProperties}>
                  <Link href={seriesHref(entry)} className={styles.print}>
                    <img
                      src={photoSrc(entry.cover, 800)}
                      srcSet={photoSrcSet(entry.cover)}
                      sizes="(min-width: 900px) 15vw, 40vw"
                      width={entry.cover.width}
                      height={entry.cover.height}
                      alt={entry.title}
                      loading={row < 2 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <span className={styles.caption}>
                      <span>{entry.title}</span>
                      <span>{entry.images.length > 0 ? `(${entry.images.length})` : "Film"}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </section>
  );
}
