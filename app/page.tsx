import { Spreads } from "./components/Spreads";
import { inCollection } from "./work";

export default function Home() {
  return <Spreads series={inCollection("portfolio")} label="Portfolio" />;
}
