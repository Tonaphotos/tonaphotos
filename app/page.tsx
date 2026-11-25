import type { Metadata } from "next";
import { Spreads } from "./components/Spreads";
import { pageMeta, siteDescription } from "./seo";
import { inCollection } from "./work";

export const metadata: Metadata = pageMeta({ description: siteDescription, path: "/" });

export default function Home() {
  return <Spreads series={inCollection("portfolio")} label="Portfolio" />;
}
