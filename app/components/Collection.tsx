import { inCollection, type Collection as Name } from "../work";
import { Spreads } from "./Spreads";

type CollectionProps = { name: Exclude<Name, "portfolio">; title: string };

export function Collection({ name, title }: CollectionProps) {
  return <Spreads series={inCollection(name)} label={title} />;
}
