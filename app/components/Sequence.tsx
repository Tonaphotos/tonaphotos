"use client";

import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { useMountEffect } from "../hooks/useMountEffect";
import { photoSrc, photoSrcSet, type Photo } from "../work";
import styles from "./sequence.module.css";

const step = 0.7;

export function Sequence({ title, photos }: { title: string; photos: Photo[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);

  useMountEffect(() => {
    let frame = 0;
    const follow = () => {
      frame = 0;
      const box = track.current?.getBoundingClientRect();
      if (!box) return;
      const index = Math.min(photos.length - 1, Math.max(0, Math.round(-box.top / (window.innerHeight * step))));
      setShown(index);
    };
    const watch = () => {
      if (!frame) frame = window.requestAnimationFrame(follow);
    };
    const keys = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    follow();
    window.addEventListener("scroll", watch, { passive: true });
    window.addEventListener("keydown", keys);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", watch);
      window.removeEventListener("keydown", keys);
    };
  });

  function go(direction: 1 | -1) {
    const box = track.current?.getBoundingClientRect();
    if (!box) return;
    const current = Math.round(-box.top / (window.innerHeight * step));
    const target = Math.min(photos.length - 1, Math.max(0, current + direction));
    window.scrollTo({ top: window.scrollY + box.top + target * window.innerHeight * step, behavior: "smooth" });
  }

  function jump(target: number) {
    const box = track.current?.getBoundingClientRect();
    if (!box) return;
    window.scrollTo({ top: window.scrollY + box.top + target * window.innerHeight * step, behavior: "smooth" });
  }

  function advance(event: MouseEvent<HTMLButtonElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    go(event.clientX < box.left + box.width / 3 ? -1 : 1);
  }

  return (
    <div ref={track} className={styles.track} style={{ "--count": photos.length } as CSSProperties}>
      <div className={styles.stage}>
        <p className={styles.count} aria-live="polite">
          {shown + 1}/{photos.length}
        </p>
        <h1 className={styles.title}>{title}</h1>
        <button type="button" className={styles.screen} onClick={advance} aria-label={`Next photograph of ${title}`}>
          {photos.map((photo, index) => (
            <img
              key={photo.src}
              src={photoSrc(photo, 1600)}
              srcSet={photoSrcSet(photo)}
              sizes="(min-width: 900px) 46vw, 86vw"
              width={photo.width}
              height={photo.height}
              alt={`${title}, photograph ${index + 1} of ${photos.length}`}
              loading={Math.abs(index - shown) <= 2 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              data-shown={index === shown ? "" : undefined}
            />
          ))}
        </button>
        <ol className={styles.rail} aria-label={`${title} photographs`}>
          {photos.map((photo, index) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={() => jump(index)}
                aria-label={`Photograph ${index + 1}`}
                aria-current={index === shown ? "true" : undefined}
              >
                <img src={photoSrc(photo, 800)} width={photo.width} height={photo.height} alt="" loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
