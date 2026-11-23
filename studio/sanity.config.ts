import { defineConfig } from "sanity";
import { media } from "sanity-plugin-media";
import { structureTool } from "sanity/structure";
import { schemaTypes, singletons } from "./schemas";
import { structure } from "./structure";

export default defineConfig({
  name: "tona",
  title: "Tona",
  projectId: "riebh78y",
  dataset: "production",
  plugins: [structureTool({ structure }), media()],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletons.includes(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
});
