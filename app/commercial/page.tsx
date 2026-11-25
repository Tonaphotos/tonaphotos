import type { Metadata } from "next";
import { Collection } from "../components/Collection";
import { pageMeta } from "../seo";

export const metadata: Metadata = pageMeta({
  title: "Commercial",
  description: "Commercial fashion and beauty photography by Tóna Fritsdóttir for brands and designers.",
  path: "/commercial",
});

export default function Commercial() {
  return <Collection name="commercial" title="Commercial" />;
}
