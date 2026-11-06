import { inCollection, type Collection as Name } from "../work";
import { Wall } from "./Wall";

const fits = { featured: 5.021, commercial: 6.612 };

type CollectionProps = { name: Exclude<Name, "portfolio">; title: string };

export function Collection({ name, title }: CollectionProps) {
  return (
    <main>
      <Wall heading={title} fit={fits[name]} series={inCollection(name)} />
    </main>
  );
}
