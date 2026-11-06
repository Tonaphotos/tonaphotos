"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { email } from "../content";
import { inCollection } from "../work";

const work = [
  { href: "/", label: "Portfolio", count: inCollection("portfolio").length },
  { href: "/featured", label: "Featured", count: inCollection("featured").length },
  { href: "/commercial", label: "Commercial", count: inCollection("commercial").length },
];

function useHere() {
  const path = usePathname().replace(/\/$/, "") || "/";
  return (href: string) => (path === href ? ("page" as const) : undefined);
}

export function WorkLinks({ className }: { className?: string }) {
  const here = useHere();
  return (
    <nav className={className} aria-label="Work">
      {work.map((item) => (
        <Link key={item.href} href={item.href} aria-current={here(item.href)}>
          {item.label} ({item.count})
        </Link>
      ))}
    </nav>
  );
}

export function StudioLinks({ className }: { className?: string }) {
  const here = useHere();
  return (
    <nav className={className} aria-label="Studio">
      <Link href="/about" aria-current={here("/about")}>
        About
      </Link>
      <Link href="/store" aria-current={here("/store")}>
        Store
      </Link>
      <a href={`mailto:${email}`}>Contact</a>
    </nav>
  );
}
