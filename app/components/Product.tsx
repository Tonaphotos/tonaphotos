"use client";

import { useState } from "react";
import { email } from "../content";
import { priceLabel, revolutLink, revolutUsername, type Product as Item } from "../store";
import { photoSrc, photoSrcSet } from "../work";
import styles from "./product.module.css";

type QuantityProps = { max: number; value: number; onChange: (value: number) => void };

function Quantity({ max, value, onChange }: QuantityProps) {
  return (
    <label className={styles.quantity}>
      Quantity
      <select value={value} onChange={(event) => onChange(Number(event.target.value))}>
        {Array.from({ length: max }, (_, index) => (
          <option key={index + 1} value={index + 1}>
            {index + 1}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Product({ product }: { product: Item }) {
  const [shown, setShown] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [paying, setPaying] = useState(false);
  const photo = product.photos[shown];
  const total = new Intl.NumberFormat("en-IE", { style: "currency", currency: product.currency }).format(product.price * quantity);
  const subject = `Order: ${product.title} x${quantity}`;
  const orderMail = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  const addressMail = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `Paid ${total} with Revolut.\n\nName:\nShipping address:\n`,
  )}`;

  function choose(value: number) {
    setQuantity(value);
    setPaying(false);
  }

  return (
    <article className={styles.product}>
      <div className={styles.gallery}>
        <div className={styles.view}>
          <img
            key={photo.src}
            src={photoSrc(photo, 1600)}
            srcSet={photoSrcSet(photo)}
            sizes="(min-width: 900px) 52vw, 92vw"
            width={photo.width}
            height={photo.height}
            alt={`${product.title}, view ${shown + 1} of ${product.photos.length}`}
            fetchPriority="high"
          />
        </div>
        <ol className={styles.thumbs} aria-label={`${product.title} views`}>
          {product.photos.map((item, index) => (
            <li key={item.src}>
              <button
                type="button"
                onClick={() => setShown(index)}
                aria-label={`View ${index + 1}`}
                aria-current={index === shown ? "true" : undefined}
              >
                <img src={photoSrc(item, 800)} width={item.width} height={item.height} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.details}>
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.meta}>
          <span>{priceLabel(product)}</span>
          <span>{product.format}</span>
        </p>
        <div className={styles.copy}>
          {product.description.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <div className={styles.buy}>
          <Quantity max={product.maxQuantity} value={quantity} onChange={choose} />
          {revolutUsername ? (
            <a
              className={styles.pay}
              href={revolutLink(revolutUsername, product, quantity)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setPaying(true)}
            >
              Buy · {total}
            </a>
          ) : (
            <a className={styles.pay} href={orderMail}>
              Order by email · {total}
            </a>
          )}
        </div>
        <p className={styles.shipping} aria-live="polite">
          {paying && <a href={addressMail}>Send your shipping address</a>}
        </p>
      </div>
    </article>
  );
}
