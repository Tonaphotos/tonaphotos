"use client";

import { useRef, useState, useSyncExternalStore, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { useMountEffect } from "../hooks/useMountEffect";
import { spreadStyle, spreadsOf } from "../spread";
import { photoSrc, photoSrcSet, type Photo } from "../work";
import styles from "./viewer.module.css";

const wideQuery = "(min-width: 900px), (orientation: landscape) and (min-width: 640px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(wideQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useWide() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(wideQuery).matches,
    () => true,
  );
}

export function Viewer({ title, photos }: { title: string; photos: Photo[] }) {
  const wide = useWide();
  const spreads = spreadsOf(photos, wide);
  const [first, setFirst] = useState(0);
  const [overview, setOverview] = useState(false);
  const swipeStart = useRef<number | null>(null);
  const current = Math.max(0, spreads.findIndex((spread) => spread.includes(first)));
  const shown = spreads[current];
  const previous = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);

  function step(direction: 1 | -1) {
    const target = spreads[(current + direction + spreads.length) % spreads.length];
    setFirst(target[0]);
    const after = spreads[(current + direction * 2 + spreads.length) % spreads.length];
    after.forEach((index) => {
      new Image().src = photoSrc(photos[index], 1600);
    });
  }
  useMountEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next.current?.click();
      if (event.key === "ArrowLeft") previous.current?.click();
      if (event.key === "Escape") setOverview(false);
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  });

  function stageClick(event: MouseEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    step(event.clientX < box.left + box.width / 2 ? -1 : 1);
  }

  function beginSwipe(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") swipeStart.current = event.clientX;
  }

  function endSwipe(event: PointerEvent<HTMLDivElement>) {
    if (swipeStart.current === null) return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) > 48) step(distance < 0 ? 1 : -1);
  }

  function open(index: number) {
    setFirst(index);
    setOverview(false);
  }

  const counter = shown.length > 1 ? `${shown[0] + 1}–${shown[1] + 1}` : `${shown[0] + 1}`;

  return (
    <section className={styles.viewer} data-overview={overview ? "" : undefined}>
      <div
        className={styles.stage}
        onClick={stageClick}
        onPointerDown={beginSwipe}
        onPointerUp={endSwipe}
        role="group"
        aria-roledescription="gallery"
        aria-label={title}
      >
        {spreads.map((spread, index) => {
          const spreadPhotos = spread.map((photoIndex) => photos[photoIndex]);
          const near = Math.abs(index - current) <= 1;
          return (
            <div
              key={spread.join("-")}
              className={styles.frame}
              data-shown={index === current ? "" : undefined}
              aria-hidden={index !== current}
            >
              <div className={styles.spread} style={spreadStyle(spreadPhotos) as CSSProperties}>
                {spread.map((photoIndex) => (
                  <img
                    key={photos[photoIndex].src}
                    src={photoSrc(photos[photoIndex], 1600)}
                    srcSet={photoSrcSet(photos[photoIndex])}
                    sizes={spread.length > 1 ? "(min-width: 900px) 40vw, 90vw" : "(min-width: 900px) 70vw, 90vw"}
                    width={photos[photoIndex].width}
                    height={photos[photoIndex].height}
                    alt={`${title}, photograph ${photoIndex + 1} of ${photos.length}`}
                    loading={near ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                    draggable={false}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.bar}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.modes}>
            <button type="button" onClick={() => setOverview(false)} aria-pressed={!overview}>
              Gallery
            </button>
            <button type="button" onClick={() => setOverview(true)} aria-pressed={overview}>
              Overview
            </button>
          </div>
        </div>
        <div className={styles.steps}>
          <button ref={previous} type="button" onClick={() => step(-1)}>
            Previous
          </button>
          <button ref={next} type="button" onClick={() => step(1)}>
            Next
          </button>
        </div>
        <p className={styles.count} aria-live="polite">
          {counter} / {photos.length}
        </p>
      </div>

      <div className={styles.overview} inert={!overview}>
        <ol className={styles.grid} aria-label={`${title} photographs`}>
          {photos.map((photo, index) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={() => open(index)}
                aria-label={`Photograph ${index + 1}`}
                aria-current={shown.includes(index) ? "true" : undefined}
              >
                <img src={photoSrc(photo, 800)} width={photo.width} height={photo.height} alt="" loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
