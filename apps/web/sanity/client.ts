import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "bdqou49k",
  dataset: "production",
  apiVersion: "2025-07-09",
  useCdn: false,
});