import type { Metadata } from "next";
import { Product } from "../components/Product";
import { products } from "../store";

export const metadata: Metadata = { title: "Store | Tóna Fritsdóttir" };

export default function Store() {
  return (
    <main>
      {products.map((product) => (
        <Product key={product.slug} product={product} />
      ))}
    </main>
  );
}
