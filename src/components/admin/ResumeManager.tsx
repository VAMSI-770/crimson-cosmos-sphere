import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSiteContent } from "@/hooks/usePortfolioData";
import { Upload, Trash2, FileText, Download } from "lucide-react";
import { motion } from "framer-motion";

const ResumeManager = () => {
  const { data: content, isLoading } = useSiteContent("hero");
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (content?.resume_url) setResumeUrl(content.resume_url);
  }, [content]);

  const handleUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF file");
      return;
    }
    setUploading(true);
    try {
      const path = `resume/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);

      const { error } = await supabase
        .from("site_content")
        .upsert(
          { section: "hero", key: "resume_url", value: publicUrl, updated_at: new Date().toISOString() },
          { onConflict: "section,key" }
        );
      if (error) throw error;

      setResumeUrl(publicUrl);
      queryClient.invalidateQueries({ queryKey: ["site_content", "hero"] });
      toast.success("Resume uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    }
    setUploading(false);
  };

  const handleRemove = async () => {
    if (!confirm("Remove the current resume?")) return;
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert(
          { section: "hero", key: "resume_url", value: "", updated_at: new Date().toISOString() },
          { onConflict: "section,key" }
        );
      if (error) throw error;

      setResumeUrl("");
      queryClient.invalidateQueries({ queryKey: ["site_content", "hero"] });
      toast.success("Resume removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove");
    }
  };

  if (isLoading) return <div className="cinema-card rounded-2xl p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="cinema-card rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-display font-bold text-foreground mb-2">Resume</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Upload your resume PDF. Visitors can download it from the homepage.
      </p>

      {resumeUrl ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-secondary/30 border border-border/30 rounded-xl">
            <div className="p-3 rounded-lg bg-blue-primary/10">
              <FileText className="w-6 h-6 text-blue-bright" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Resume uploaded</p>
              <p className="text-xs text-muted-foreground truncate">{resumeUrl}</p>
            </div>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-blue-primary/10 text-blue-bright transition-colors"
              title="Preview"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>

          <div className="flex gap-3">
            <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-primary to-blue-bright text-white rounded-xl text-sm font-medium cursor-pointer hover:shadow-lg hover:shadow-blue-primary/30 transition-all">
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Replace Resume"}
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                disabled={uploading}
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
            </label>
            <motion.button
              onClick={handleRemove}
              className="flex items-center gap-2 px-5 py-2.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium hover:bg-destructive/20 transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">No resume uploaded yet</p>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-primary to-blue-bright text-white rounded-xl text-sm font-medium cursor-pointer hover:shadow-lg hover:shadow-blue-primary/30 transition-all">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Resume (PDF)"}
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;
