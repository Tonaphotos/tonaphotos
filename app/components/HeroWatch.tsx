"use client";

import { useMountEffect } from "../hooks/useMountEffect";

export function HeroWatch() {
  useMountEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero] img");
    const feed = hero?.closest("main");
    const header = document.querySelector("header");
    if (!hero || !feed || !header) return;
    const root = document.documentElement;
    const update = () =>
      root.toggleAttribute("data-past-hero", hero.getBoundingClientRect().bottom <= header.getBoundingClientRect().bottom);
    update();
    feed.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      feed.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.removeAttribute("data-past-hero");
    };
  });
  return null;
}
