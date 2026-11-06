"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useMountEffect } from "../hooks/useMountEffect";

let lenis: Lenis | null = null;

function toTop() {
  window.scrollTo(0, 0);
  lenis?.scrollTo(0, { immediate: true, force: true });
}

function ProjectStart() {
  useMountEffect(() => {
    history.scrollRestoration = "manual";
    toTop();
    const frame = window.requestAnimationFrame(toTop);
    return () => {
      window.cancelAnimationFrame(frame);
      history.scrollRestoration = "auto";
    };
  });
  return null;
}

export function Smooth() {
  const path = usePathname();

  useMountEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({ autoRaf: true, lerp: 0.09 });
    lenis = instance;
    return () => {
      instance.destroy();
      lenis = null;
    };
  });

  return path.startsWith("/work/") ? <ProjectStart key={path} /> : null;
}
