import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: { list: [{ title: "Project", value: "Project" }, { title: "App", value: "App" }], layout: "radio" },
      initialValue: "Project"
    }),
    defineField({ name: "title", title: "Project name", type: "string", validation: function (rule) { return rule.required(); } }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "stack", title: "Technologies", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "githubUrl", title: "GitHub repository URL", type: "url" }),
    defineField({ name: "demoUrl", title: "Live demo URL", type: "url" }),
    defineField({ name: "featured", title: "Feature on top", type: "boolean", initialValue: false })
  ],
  preview: { select: { title: "title", subtitle: "category" } }
});
