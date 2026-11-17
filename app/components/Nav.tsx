"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { email } from "../content";
import styles from "./nav.module.css";

const pages = [
  { href: "/", label: "Portfolio" },
  { href: "/featured", label: "Featured" },
  { href: "/commercial", label: "Commercial" },
  { href: "/about", label: "About" },
  { href: "/store", label: "Store" },
];

export function Nav() {
  const path = usePathname().replace(/\/$/, "") || "/";
  const [open, setOpen] = useState(false);
  const [shownPath, setShownPath] = useState(path);
  if (path !== shownPath) {
    setShownPath(path);
    setOpen(false);
  }
  const here = (href: string) => (path === href ? ("page" as const) : undefined);

  const links = (
    <>
      {pages.map((page) => (
        <Link key={page.href} href={page.href} aria-current={here(page.href)}>
          {page.label}
        </Link>
      ))}
      <a href={`mailto:${email}`}>Contact</a>
    </>
  );

  return (
    <header className={styles.nav} data-open={open ? "" : undefined}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand}>
          Tona
        </Link>
        <nav className={styles.row} aria-label="Primary">
          {links}
        </nav>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <nav id="menu" className={styles.panel} aria-label="Menu" inert={!open}>
        {links}
      </nav>
    </header>
  );
}
