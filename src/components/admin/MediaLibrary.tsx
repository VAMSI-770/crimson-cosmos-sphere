import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Trash2, Copy, Image, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { logAudit } from "@/lib/audit";
import { buildStoragePath, validateUpload } from "@/lib/uploads";

interface MediaFile {
  name: string;
  id: string;
  url: string;
  created_at: string;
}

const MediaLibrary = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadFiles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.storage.from("media").list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    if (error) { toast.error("Failed to load media"); setIsLoading(false); return; }
    
    const items: MediaFile[] = (data || [])
      .filter(f => f.name !== ".emptyFolderPlaceholder")
      .map(f => ({
        name: f.name,
        id: f.id || f.name,
        url: supabase.storage.from("media").getPublicUrl(f.name).data.publicUrl,
        created_at: f.created_at || "",
      }));
    
    // Also load from subdirectories
    const folders = ["certifications", "projects", "internships", "achievements"];
    for (const folder of folders) {
      const { data: folderData } = await supabase.storage.from("media").list(folder, { limit: 200 });
      if (folderData) {
        folderData.filter(f => f.name !== ".emptyFolderPlaceholder").forEach(f => {
          items.push({
            name: `${folder}/${f.name}`,
            id: f.id || `${folder}/${f.name}`,
            url: supabase.storage.from("media").getPublicUrl(`${folder}/${f.name}`).data.publicUrl,
            created_at: f.created_at || "",
          });
        });
      }
    }
    
    setFiles(items);
    setIsLoading(false);
  };

  useEffect(() => { loadFiles(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length) return;
    setUploading(true);

    for (const file of Array.from(fileList)) {
      const invalid = validateUpload(file);
      if (invalid) {
        toast.error(`${file.name}: ${invalid}`);
        logAudit({ action: "media.upload", status: "rejected", details: { reason: invalid } });
        continue;
      }
      const path = buildStoragePath("uploads", file.name);
      const { error } = await supabase.storage
        .from("media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) {
        toast.error(`Failed to upload ${file.name}`);
        logAudit({ action: "media.upload", status: "failed" });
      } else {
        toast.success(`Uploaded ${file.name}`);
        logAudit({ action: "media.upload", entity: "storage", entity_id: path });
      }
    }

    setUploading(false);
    loadFiles();
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    const { error } = await supabase.storage.from("media").remove([name]);
    if (error) {
      toast.error("Delete failed");
      logAudit({ action: "media.delete", status: "failed", entity: "storage", entity_id: name });
    } else {
      toast.success("Deleted");
      logAudit({ action: "media.delete", entity: "storage", entity_id: name });
      loadFiles();
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);

  return (
    <div className="cinema-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-display font-bold text-foreground">Media Library</h2>
        <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-primary to-blue-bright text-white rounded-xl text-sm font-medium cursor-pointer hover:shadow-lg hover:shadow-blue-primary/30 transition-all">
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Files"}
          <input type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      <p className="text-muted-foreground text-sm mb-6">Manage your images, certificates, and documents.</p>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No files yet. Upload your first file.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <motion.div
              key={file.id}
              className="group relative bg-secondary/20 border border-border/30 rounded-xl overflow-hidden hover:border-blue-primary/20 transition-colors"
              whileHover={{ y: -4 }}
            >
              <div className="aspect-square flex items-center justify-center bg-secondary/30">
                {isImage(file.name) ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <FileText className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-foreground truncate">{file.name.split('/').pop()}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => copyUrl(file.url)} className="p-1.5 bg-background/80 backdrop-blur rounded-lg hover:bg-blue-primary/20 text-blue-bright">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(file.name)} className="p-1.5 bg-background/80 backdrop-blur rounded-lg hover:bg-destructive/20 text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
