import type { Product } from "./content";

export { products, revolutUsername, type Product } from "./content";

export function priceLabel(product: Product) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: product.currency }).format(product.price);
}

export function revolutLink(username: string, product: Product, quantity: number) {
  const query = new URLSearchParams({
    amount: String(Math.round(product.price * quantity * 100)),
    currency: product.currency,
    note: `${product.title} x${quantity}`,
  });
  return `https://revolut.me/${encodeURIComponent(username)}?${query}`;
}
