import type { Photo } from "./work";

export const paypalAccount: string | null = null;

export type Product = {
  slug: string;
  title: string;
  price: number;
  currency: "EUR";
  format: string;
  description: string[];
  photos: Photo[];
  maxQuantity: number;
};

const bookPhoto = (n: number): Photo => ({ src: `/images/store/livandi-steinar-0${n}`, width: 1600, height: 1200 });

export const products: Product[] = [
  {
    slug: "livandi-steinar",
    title: "Livandi Steinar",
    price: 20,
    currency: "EUR",
    format: "A5 book, 62 pages",
    description: [
      "Sometimes, home is tangible, a place you can return to. Other times, it’s abstract, something you can’t quite see or fully understand. It’s the quiet longing to belong somewhere, to feel seen.",
      "There are moments when you question why this feeling even matters, but it just does. It lingers, unresolved, pulling you toward something just out of reach.",
      "In my work, I draw on the folklore of Huldufólk to explore this idea. It is deeply rooted in the culture I grew up in, yet it is slowly fading, like many fragile traditions. Through this, I want to bring it back to life, not as something fixed or fully understood, but as a feeling, a presence.",
      "Something you search for, even when you don’t know what you’re looking for.",
    ],
    photos: [1, 2, 3, 4, 5].map(bookPhoto),
    maxQuantity: 9,
  },
];

export function priceLabel(product: Product) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: product.currency }).format(product.price);
}
