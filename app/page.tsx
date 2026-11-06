import { Wall } from "./components/Wall";
import { inCollection } from "./work";

export default function Home() {
  return (
    <main>
      <Wall heading="Tóna Fritsdóttir" fit={9.38} series={inCollection("portfolio")} />
    </main>
  );
}
