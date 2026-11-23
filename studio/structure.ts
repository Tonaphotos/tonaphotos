import type { StructureResolver } from "sanity/structure";

const single = (S: Parameters<StructureResolver>[0], id: string, title: string) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Tona")
    .items([
      single(S, "portfolio", "Portfolio"),
      single(S, "featured", "Featured"),
      single(S, "commercial", "Commercial"),
      S.divider(),
      S.documentTypeListItem("series").title("All series"),
      S.divider(),
      single(S, "store", "Store"),
      S.documentTypeListItem("product").title("Products"),
      S.divider(),
      single(S, "about", "About"),
      single(S, "settings", "Settings"),
    ]);
