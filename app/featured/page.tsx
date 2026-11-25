import type { Metadata } from "next";
import { Collection } from "../components/Collection";
import { pageMeta } from "../seo";

export const metadata: Metadata = pageMeta({
  title: "Featured",
  description: "Magazine features and published editorials by Tóna Fritsdóttir, fashion and beauty photographer.",
  path: "/featured",
});

export default function Featured() {
  return <Collection name="featured" title="Featured" />;
}
