import type { Metadata } from "next";
import { Product } from "../components/Product";
import { absolute, brand, imageUrl, JsonLd, pageMeta, personId, summary } from "../seo";
import { products } from "../store";

export const metadata: Metadata = pageMeta({
  title: "Store",
  description: summary(
    products.length > 0
      ? `${products.map((product) => `${product.title}, ${product.format}`).join(". ")}. ${products[0].description[0] ?? ""}`
      : "Books and prints by Tóna Fritsdóttir.",
  ),
  path: "/store",
});

export default function Store() {
  return (
    <main>
      {products.map((product) => (
        <JsonLd
          key={`${product.slug}-data`}
          data={{
            "@type": "Product",
            name: product.title,
            description: summary(product.description.join(" "), 500),
            image: product.photos.map(imageUrl),
            brand: { "@type": "Brand", name: brand },
            author: { "@id": personId },
            offers: {
              "@type": "Offer",
              price: product.price.toFixed(2),
              priceCurrency: product.currency,
              availability: "https://schema.org/InStock",
              url: absolute("/store"),
            },
          }}
        />
      ))}
      {products.map((product) => (
        <Product key={product.slug} product={product} />
      ))}
    </main>
  );
}
