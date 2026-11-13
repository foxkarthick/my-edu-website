import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page content",
  type: "document",
  fields: [
    defineField({
      name: "route",
      title: "Page",
      type: "string",
      options: {
        list: [
          { title: "Dashboard", value: "dashboard" },
          { title: "About", value: "about" },
          { title: "Projects", value: "projects" },
          { title: "Contact us", value: "contact" }
        ],
        layout: "dropdown"
      },
      validation: function (rule) { return rule.required(); }
    }),
    defineField({ name: "title", title: "Page title", type: "string", validation: function (rule) { return rule.required(); } }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 3 }),
    defineField({ name: "body", title: "Additional content", type: "text", rows: 8, description: "Separate paragraphs with a blank line." })
  ],
  preview: { select: { title: "title", subtitle: "route" } }
});
