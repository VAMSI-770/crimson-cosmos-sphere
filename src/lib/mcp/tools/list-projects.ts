import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_projects",
  title: "List projects",
  description:
    "List Vamsi's portfolio projects, including descriptions, tags, challenges, outcomes and demo/GitHub links.",
  inputSchema: {
    search: z.string().optional().describe("Optional case-insensitive filter on the project title."),
    limit: z.number().int().optional().describe("Maximum number of projects to return (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, limit }) => {
    const supabase = supabaseAnon();
    let query = supabase
      .from("projects")
      .select("id,title,description,full_description,tags,challenges,outcome,team,demo_link,github_link,sort_order")
      .order("sort_order")
      .limit(Math.min(Math.max(limit ?? 50, 1), 100));
    if (search) query = query.ilike("title", `%${search}%`);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { projects: data ?? [] },
    };
  },
});
