import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_experience",
  title: "List experience and credentials",
  description:
    "List Vamsi's education, internships and certifications — the record of where he studied, worked and what he is certified in.",
  inputSchema: {
    kind: z
      .enum(["all", "education", "internships", "certifications"])
      .optional()
      .describe("Which record type to return. Defaults to all."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ kind }) => {
    const supabase = supabaseAnon();
    const want = kind ?? "all";
    const result: Record<string, unknown> = {};

    if (want === "all" || want === "education") {
      const { data, error } = await supabase.from("education").select("*").order("sort_order");
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      result.education = data ?? [];
    }
    if (want === "all" || want === "internships") {
      const { data, error } = await supabase.from("internships").select("*").order("sort_order");
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      result.internships = data ?? [];
    }
    if (want === "all" || want === "certifications") {
      const { data, error } = await supabase
        .from("certifications")
        .select("id,title,issuer,year,description,skills,sort_order")
        .order("sort_order");
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      result.certifications = data ?? [];
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
});
