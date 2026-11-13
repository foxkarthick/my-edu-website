import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "brandName", title: "Site name", type: "string", initialValue: "my edu" }),
    defineField({ name: "contactEmail", title: "Contact email", type: "string" }),
    defineField({ name: "githubUsername", title: "GitHub username", type: "string", description: "Public repositories from this profile appear in the Projects page." })
  ],
  preview: { select: { title: "brandName" }, prepare: function (selection) { return { title: selection.title || "Site settings" }; } }
});
