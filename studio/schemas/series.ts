import { defineArrayMember, defineField, defineType } from "sanity";
import { photosField } from "./fields";

export const series = defineType({
  name: "series",
  title: "Series",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cover",
      type: "image",
      description: "Shown on the Portfolio, Featured and Commercial pages.",
      validation: (rule) => rule.required(),
    }),
    photosField("photos", "Photos", false),
    defineField({
      name: "statement",
      type: "array",
      description: "One entry per language. Separate paragraphs with an empty line.",
      of: [
        defineArrayMember({
          type: "object",
          name: "statementVersion",
          title: "Statement",
          fields: [
            defineField({ name: "language", type: "string", description: "For example en or fo." }),
            defineField({ name: "text", type: "text", rows: 10 }),
          ],
          preview: { select: { title: "language", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "credits",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [defineField({ name: "href", type: "url", validation: (rule) => rule.uri({ allowRelative: true }) })],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "films",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "film",
          fields: [
            defineField({ name: "url", type: "url", description: "A YouTube or Vimeo link.", validation: (rule) => rule.required() }),
            defineField({ name: "vertical", type: "boolean", initialValue: false }),
          ],
          preview: { select: { title: "url" } },
        }),
      ],
    }),
  ],
  validation: (rule) =>
    rule.custom((document) => {
      const photos = (document?.photos as unknown[] | undefined) ?? [];
      const films = (document?.films as unknown[] | undefined) ?? [];
      return photos.length > 0 || films.length > 0 ? true : "Add at least one photo or one film.";
    }),
  orderings: [{ title: "Title", name: "title", by: [{ field: "title", direction: "asc" }] }],
  preview: { select: { title: "title", media: "cover" } },
});
