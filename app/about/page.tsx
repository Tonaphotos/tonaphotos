import type { Metadata } from "next";
import Link from "next/link";
import styles from "../components/about.module.css";
import { about, email, instagram, linkedin } from "../content";
import { pageMeta, summary } from "../seo";
import { inCollection, photoSrc, photoSrcSet, seriesHref } from "../work";

export const metadata: Metadata = pageMeta({ title: "About", description: summary(about.lead), path: "/about" });

export default function About() {
  const clients = inCollection("commercial");

  return (
    <main className={styles.about}>
      <img
        className={styles.portrait}
        src={photoSrc(about.portrait, 1600)}
        srcSet={photoSrcSet(about.portrait)}
        sizes="(min-width: 900px) 34vw, 60vw"
        width={about.portrait.width}
        height={about.portrait.height}
        alt="Portrait of Tóna Fritsdóttir"
        fetchPriority="high"
      />

      <section className={styles.text}>
        <h1 className={styles.lead}>{about.lead}</h1>
        {about.body.map((paragraph) => (
          <p key={paragraph} className={styles.body}>
            {paragraph}
          </p>
        ))}
        {clients.length > 0 && (
          <p className={styles.body}>
            Commercial work for{" "}
          {clients.map((client, position) => (
            <span key={client.slug}>
              <Link href={seriesHref(client)}>{client.title}</Link>
              {position < clients.length - 2 ? ", " : position === clients.length - 2 ? " and " : "."}
            </span>
            ))}
          </p>
        )}
        <div className={styles.contact}>
          <a className={styles.email} href={`mailto:${email}`}>
            {email}
          </a>
          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
