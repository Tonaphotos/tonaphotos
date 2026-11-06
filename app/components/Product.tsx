"use client";

import { useState } from "react";
import { email } from "../content";
import { paypalAccount, priceLabel, type Product as Item } from "../store";
import { photoSrc, photoSrcSet } from "../work";
import styles from "./product.module.css";

type QuantityProps = { max: number; value: number; onChange: (value: number) => void; named?: boolean };

function Quantity({ max, value, onChange, named = false }: QuantityProps) {
  return (
    <label className={styles.quantity}>
      Quantity
      <select name={named ? "quantity" : undefined} value={value} onChange={(event) => onChange(Number(event.target.value))}>
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
  const photo = product.photos[shown];
  const total = new Intl.NumberFormat("en-IE", { style: "currency", currency: product.currency }).format(product.price * quantity);
  const orderMail = `mailto:${email}?subject=${encodeURIComponent(`Order: ${product.title} x${quantity}`)}`;

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

        {paypalAccount ? (
          <form className={styles.buy} action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick" />
            <input type="hidden" name="business" value={paypalAccount} />
            <input type="hidden" name="item_name" value={`${product.title}, ${product.format}`} />
            <input type="hidden" name="amount" value={product.price.toFixed(2)} />
            <input type="hidden" name="currency_code" value={product.currency} />
            <input type="hidden" name="no_note" value="1" />
            <Quantity max={product.maxQuantity} value={quantity} onChange={setQuantity} named />
            <button type="submit" className={styles.pay}>
              Buy with PayPal · {total}
            </button>
          </form>
        ) : (
          <div className={styles.buy}>
            <Quantity max={product.maxQuantity} value={quantity} onChange={setQuantity} />
            <a className={styles.pay} href={orderMail}>
              Order by email · {total}
            </a>
          </div>
        )}
        <p className={styles.shipping}>Shipping is calculated at checkout.</p>
      </div>
    </article>
  );
}
