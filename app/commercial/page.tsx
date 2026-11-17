import type { Metadata } from "next";
import { Collection } from "../components/Collection";

export const metadata: Metadata = { title: "Commercial" };

export default function Commercial() {
  return <Collection name="commercial" title="Commercial" />;
}
