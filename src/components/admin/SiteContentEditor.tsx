import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSiteContent } from "@/hooks/usePortfolioData";
import { Save } from "lucide-react";
import { logAudit } from "@/lib/audit";

interface Props {
  section: "hero" | "about" | "contact";
}

const sectionConfig = {
  hero: {
    title: "Hero Section",
    description: "Edit your homepage hero area.",
    fields: [
      { key: "name_first", label: "First Name" },
      { key: "name_last", label: "Last Name" },
      { key: "subtitle", label: "Subtitle" },
      { key: "tagline", label: "Tagline", textarea: true },
      { key: "badge_text", label: "Badge Text" },
    ],
  },
  about: {
    title: "About Section",
    description: "Edit your bio and metrics.",
    fields: [
      { key: "paragraph_1", label: "Paragraph 1", textarea: true },
      { key: "paragraph_2", label: "Paragraph 2", textarea: true },
      { key: "paragraph_3", label: "Paragraph 3", textarea: true },
      { key: "metric_1_value", label: "Metric 1 Value" },
      { key: "metric_1_label", label: "Metric 1 Label" },
      { key: "metric_2_value", label: "Metric 2 Value" },
      { key: "metric_2_label", label: "Metric 2 Label" },
      { key: "metric_3_value", label: "Metric 3 Value" },
      { key: "metric_3_label", label: "Metric 3 Label" },
      { key: "metric_4_value", label: "Metric 4 Value" },
      { key: "metric_4_label", label: "Metric 4 Label" },
    ],
  },
  contact: {
    title: "Contact Settings",
    description: "Update your contact information.",
    fields: [
      { key: "email", label: "Email" },
      { key: "linkedin", label: "LinkedIn URL" },
      { key: "github", label: "GitHub URL" },
    ],
  },
};

const SiteContentEditor = ({ section }: Props) => {
  const { data: content, isLoading } = useSiteContent(section);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const config = sectionConfig[section];

  useEffect(() => {
    if (content) setFormData(content);
  }, [content]);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const field of config.fields) {
        const value = formData[field.key] || "";
        const { error } = await supabase
          .from("site_content")
          .upsert({ section, key: field.key, value, updated_at: new Date().toISOString() }, { onConflict: "section,key" });
        if (error) throw error;
      }
      logAudit({ action: "content.update", entity: "site_content", entity_id: section });
      toast.success("Saved successfully");
      queryClient.invalidateQueries({ queryKey: ["site_content", section] });
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    }
    setSaving(false);
  };

  if (isLoading) return <div className="cinema-card rounded-2xl p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="cinema-card rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-display font-bold text-foreground mb-2">{config.title}</h2>
      <p className="text-muted-foreground text-sm mb-6">{config.description}</p>

      <div className="space-y-4">
        {config.fields.map(field => (
          <div key={field.key}>
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              {field.label}
            </label>
            {(field as any).textarea ? (
              <textarea
                value={formData[field.key] || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                rows={3}
                className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-primary/50 transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                value={formData[field.key] || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-primary/50 transition-colors"
              />
            )}
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-primary to-blue-bright text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-blue-primary/30 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default SiteContentEditor;
