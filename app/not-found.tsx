import Link from "next/link";
import styles from "./components/missing.module.css";

export default function NotFound() {
  return (
    <main className={styles.missing}>
      <h1 className={styles.title}>Not found</h1>
      <Link href="/" className={styles.back}>
        Back to the work
      </Link>
    </main>
  );
}
