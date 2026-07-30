import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_skills",
  title: "List skills",
  description:
    "List Vamsi's skill categories with their proficiency level and the individual skills in each category.",
  inputSchema: {
    search: z.string().optional().describe("Optional case-insensitive filter on the category title."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search }) => {
    const supabase = supabaseAnon();
    let query = supabase
      .from("skill_categories")
      .select("id,title,description,proficiency,sort_order,skills(name,sort_order)")
      .order("sort_order");
    if (search) query = query.ilike("title", `%${search}%`);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { categories: data ?? [] },
    };
  },
});
