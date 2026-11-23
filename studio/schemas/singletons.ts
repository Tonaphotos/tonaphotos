import { defineArrayMember, defineField, defineType } from "sanity";
import { orderedSeriesField, photosField } from "./fields";

function collection(name: string, title: string) {
  return defineType({
    name,
    title,
    type: "document",
    fields: [orderedSeriesField()],
    preview: { prepare: () => ({ title }) },
  });
}

export const portfolio = collection("portfolio", "Portfolio");
export const featured = collection("featured", "Featured");
export const commercial = collection("commercial", "Commercial");

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({ name: "portrait", type: "image", validation: (rule) => rule.required() }),
    defineField({ name: "lead", title: "Opening paragraph", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({ name: "body", title: "Second paragraph", type: "text", rows: 8 }),
  ],
  preview: { prepare: () => ({ title: "About" }) },
});

export const settings = defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  fields: [
    defineField({ name: "email", type: "string", validation: (rule) => rule.required().email() }),
    defineField({ name: "instagram", type: "url" }),
    defineField({ name: "linkedin", type: "url" }),
    defineField({
      name: "revolutUsername",
      title: "Revolut username",
      type: "string",
      description: "Store payments go to revolut.me/<username>.",
      validation: (rule) => rule.regex(/^[A-Za-z0-9._-]+$/, { name: "username" }),
    }),
  ],
  preview: { prepare: () => ({ title: "Settings" }) },
});

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "available", type: "boolean", initialValue: true, description: "Only available products are shown." }),
    defineField({ name: "price", title: "Price (EUR)", type: "number", validation: (rule) => rule.required().positive() }),
    defineField({ name: "format", type: "string", description: "For example A5 book, 62 pages." }),
    defineField({ name: "description", type: "text", rows: 10, description: "Separate paragraphs with an empty line." }),
    photosField("photos", "Photos"),
    defineField({ name: "maxQuantity", title: "Most per order", type: "number", initialValue: 9, validation: (rule) => rule.min(1).integer() }),
  ],
  preview: { select: { title: "title", subtitle: "format", media: "photos.0" } },
});

export const store = defineType({
  name: "store",
  title: "Store",
  type: "document",
  fields: [
    defineField({
      name: "products",
      description: "Drag to change the order.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: { prepare: () => ({ title: "Store" }) },
});
