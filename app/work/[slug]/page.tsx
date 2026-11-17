import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Viewer } from "../../components/Viewer";
import styles from "../../components/page.module.css";
import { findSeries, neighbours, photoSrc, photoSrcSet, seriesHref, work, type Video } from "../../work";

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((series) => ({ slug: series.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const series = findSeries((await params).slug);
  if (!series) return {};
  return {
    title: series.title,
    openGraph: { images: [{ url: photoSrc(series.cover, 1600), width: series.cover.width, height: series.cover.height }] },
  };
}

function videoSource(video: Video) {
  return video.provider === "vimeo"
    ? `https://player.vimeo.com/video/${video.id}?title=0&byline=0&portrait=0&dnt=1`
    : `https://www.youtube-nocookie.com/embed/${video.id}?rel=0`;
}

export default async function SeriesPage({ params }: PageProps<"/work/[slug]">) {
  const series = findSeries((await params).slug);
  if (!series) notFound();
  const { next } = neighbours(series.slug);
  const hasDetails = series.statement.length > 0 || series.videos.length > 0 || series.notes.length > 0;

  return (
    <>
      <main>
        {series.images.length > 0 ? (
          <Viewer title={series.title} photos={series.images} />
        ) : (
          <h1 className={styles.filmTitle}>{series.title}</h1>
        )}

        {hasDetails && (
          <div className={styles.details}>
            {series.statement.length > 0 && (
              <div className={styles.statement}>
                {series.statement.map((version) => (
                  <div key={version.lang} lang={version.lang}>
                    {version.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {series.videos.map((video) => (
              <iframe
                key={video.id}
                className={video.height > video.width ? styles.portraitFilm : styles.film}
                src={videoSource(video)}
                title={`${series.title} film`}
                style={{ aspectRatio: `${video.width} / ${video.height}` }}
                loading="lazy"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ))}

            {series.notes.length > 0 && (
              <div className={styles.notes}>
                {series.notes.map((paragraph, position) => (
                  <p key={position}>
                    {paragraph.map((segment, part) =>
                      segment.href ? (
                        <a
                          key={part}
                          href={segment.href}
                          {...(segment.href.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                        >
                          {segment.text}
                        </a>
                      ) : (
                        <span key={part}>{segment.text}</span>
                      ),
                    )}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <Link href={seriesHref(next)} className={styles.next} aria-label={`Next series: ${next.title}`}>
          <span className={styles.nextFrame}>
            <img
              src={photoSrc(next.cover, 800)}
              srcSet={photoSrcSet(next.cover)}
              sizes="(min-width: 900px) 18vw, 52vw"
              width={next.cover.width}
              height={next.cover.height}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </span>
          <span className={styles.nextTitle}>{next.title}</span>
        </Link>
      </main>
    </>
  );
}
