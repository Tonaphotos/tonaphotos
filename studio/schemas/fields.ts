import { defineArrayMember, defineField } from "sanity";
import { BulkImageInput } from "../components/BulkImageInput";

export function photosField(name: string, title: string, required = true) {
  return defineField({
    name,
    title,
    type: "array",
    of: [defineArrayMember({ type: "image", options: { hotspot: false } })],
    options: { layout: "grid" },
    components: { input: BulkImageInput },
    validation: (rule) => (required ? rule.required().min(1) : rule),
  });
}

export function orderedSeriesField() {
  return defineField({
    name: "series",
    title: "Series",
    description: "Drag to change the order.",
    type: "array",
    of: [defineArrayMember({ type: "reference", to: [{ type: "series" }] })],
    validation: (rule) => rule.unique(),
  });
}
