import { defineMcp } from "@lovable.dev/mcp-js";
import getSiteContentTool from "./tools/get-site-content";
import listSkillsTool from "./tools/list-skills";
import listProjectsTool from "./tools/list-projects";
import listExperienceTool from "./tools/list-experience";
import listHighlightsTool from "./tools/list-highlights";

export default defineMcp({
  name: "vamsi-s-digital-realm",
  title: "Vamsi's Digital Realm",
  version: "0.1.0",
  instructions:
    "Read-only tools for Vamsi's public portfolio. Use `get_site_content` for section copy, `list_skills` for skill categories, `list_projects` for projects, `list_experience` for education/internships/certifications, and `list_highlights` for ideas, achievements and goals. No private or contact-message data is exposed.",
  tools: [
    getSiteContentTool,
    listSkillsTool,
    listProjectsTool,
    listExperienceTool,
    listHighlightsTool,
  ],
});
