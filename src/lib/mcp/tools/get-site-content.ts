import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

const SECTIONS = ["about", "skills", "projects", "contact", "hero", "vision"] as const;

export default defineTool({
  name: "get_site_content",
  title: "Get site content",
  description:
    "Fetch the public portfolio's editable text content (hero, about, contact and other section copy), optionally filtered by section.",
  inputSchema: {
    section: z
      .string()
      .optional()
      .describe(`Optional section key to filter by, e.g. ${SECTIONS.join(", ")}.`),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ section }) => {
    const supabase = supabaseAnon();
    let query = supabase.from("site_content").select("section,key,value");
    if (section) query = query.eq("section", section);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { items: data ?? [] },
    };
  },
});
