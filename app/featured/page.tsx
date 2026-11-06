import type { Metadata } from "next";
import { Collection } from "../components/Collection";

export const metadata: Metadata = { title: "Featured | Tóna Fritsdóttir" };

export default function Featured() {
  return <Collection name="featured" title="Featured" />;
}
