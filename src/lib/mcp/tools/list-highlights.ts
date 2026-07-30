import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_highlights",
  title: "List ideas, achievements and goals",
  description:
    "List Vamsi's innovation ideas, achievements and future goals — useful for understanding his interests and direction.",
  inputSchema: {
    kind: z
      .enum(["all", "ideas", "achievements", "goals"])
      .optional()
      .describe("Which record type to return. Defaults to all."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ kind }) => {
    const supabase = supabaseAnon();
    const want = kind ?? "all";
    const result: Record<string, unknown> = {};

    if (want === "all" || want === "ideas") {
      const { data, error } = await supabase
        .from("ideas")
        .select("id,title,category,description,full_description,technologies,potential_impact,sort_order")
        .order("sort_order");
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      result.ideas = data ?? [];
    }
    if (want === "all" || want === "achievements") {
      const { data, error } = await supabase
        .from("achievements")
        .select("id,title,label,description,details,team,sort_order")
        .order("sort_order");
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      result.achievements = data ?? [];
    }
    if (want === "all" || want === "goals") {
      const { data, error } = await supabase
        .from("goals")
        .select("id,title,description,full_description,milestones,timeline,sort_order")
        .order("sort_order");
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      result.goals = data ?? [];
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
});
