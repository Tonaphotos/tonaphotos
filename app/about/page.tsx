import type { Metadata } from "next";
import Link from "next/link";
import styles from "../components/about.module.css";
import { bio, email, instagram, linkedin } from "../content";
import { inCollection, seriesHref } from "../work";

export const metadata: Metadata = { title: "About | Tóna Fritsdóttir" };

const portrait = { width: 1600, height: 2400 };

export default function About() {
  const clients = inCollection("commercial");

  return (
    <main className={styles.about}>
      <img
        className={styles.portrait}
        src="/images/about/tona-1600.jpg"
        srcSet="/images/about/tona-800.jpg 800w, /images/about/tona-1600.jpg 1600w"
        sizes="(min-width: 900px) 34vw, 60vw"
        width={portrait.width}
        height={portrait.height}
        alt="Portrait of Tóna Fritsdóttir"
        fetchPriority="high"
      />

      <section className={styles.text}>
        <h1 className={styles.lead}>Tóna Fritsdóttir (b. 2001) {bio[0]}</h1>
        <p className={styles.body}>{bio[1]}</p>
        <p className={styles.body}>
          Commercial work for{" "}
          {clients.map((client, position) => (
            <span key={client.slug}>
              <Link href={seriesHref(client)}>{client.title}</Link>
              {position < clients.length - 2 ? ", " : position === clients.length - 2 ? " and " : "."}
            </span>
          ))}
        </p>
        <div className={styles.contact}>
          <a className={styles.email} href={`mailto:${email}`}>
            {email}
          </a>
          <a href={instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </section>
    </main>
  );
}
