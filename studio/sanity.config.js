import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas/index.js";

export default defineConfig({
  name: "my-edu",
  title: "My Edu",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "2scgzaqk",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes }
});
