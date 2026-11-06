"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StudioLinks, WorkLinks } from "./Links";
import styles from "./frame.module.css";

const walls = ["/", "/featured", "/commercial"];

export function Frame() {
  const path = usePathname().replace(/\/$/, "") || "/";
  const wall = walls.includes(path);

  return (
    <>
      <header className={`${styles.edge} ${styles.top}`}>
        <WorkLinks className={styles.links} />
        {!wall && (
          <Link href="/" className={styles.name}>
            Tóna Fritsdóttir
          </Link>
        )}
      </header>
      <footer className={`${styles.edge} ${styles.bottom}`}>
        <StudioLinks className={styles.links} />
      </footer>
    </>
  );
}
