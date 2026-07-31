import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Save, X, Upload } from "lucide-react";

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "array" | "file" | "video";
  placeholder?: string;
}

interface Props {
  title: string;
  description: string;
  tableName: string;
  queryKey: string;
  items: any[];
  fields: FieldDef[];
  isLoading: boolean;
}

const GenericCrudManager = ({ title, description, tableName, queryKey, items, fields, isLoading }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  const getDefaultFormData = () => {
    const defaults: Record<string, any> = {};
    fields.forEach(f => {
      defaults[f.key] = f.type === "array" ? [] : "";
    });
    defaults.sort_order = items.length;
    return defaults;
  };

  const startAdd = () => {
    setFormData(getDefaultFormData());
    setIsAdding(true);
    setEditingId(null);
  };

  const startEdit = (item: any) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setIsAdding(false);
  };

  const cancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleFileUpload = async (field: string, file: File) => {
    const invalid = validateUpload(file);
    if (invalid) {
      toast.error(invalid);
      logAudit({ action: "media.upload", status: "rejected", entity: tableName, details: { reason: invalid } });
      return;
    }
    const path = buildStoragePath(tableName, file.name);
    const { error } = await supabase.storage.from("media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      toast.error("Upload failed");
      logAudit({ action: "media.upload", status: "failed", entity: tableName });
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
    setFormData(prev => ({ ...prev, [field]: publicUrl }));
    logAudit({ action: "media.upload", entity: tableName, entity_id: path });
    toast.success("File uploaded");
  };

  const save = async () => {
    try {
      const payload: Record<string, any> = {};
      fields.forEach(f => {
        if (f.key in formData) payload[f.key] = formData[f.key];
      });
      if ("sort_order" in formData) payload.sort_order = formData.sort_order;

      if (isAdding) {
        const { error } = await supabase.from(tableName as any).insert(payload);
        if (error) throw error;
        logAudit({ action: "content.create", entity: tableName });
        toast.success(`${title} added`);
      } else if (editingId) {
        const { error } = await supabase.from(tableName as any).update(payload).eq("id", editingId);
        if (error) throw error;
        logAudit({ action: "content.update", entity: tableName, entity_id: editingId });
        toast.success(`${title} updated`);
      }
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      cancel();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      const { error } = await supabase.from(tableName as any).delete().eq("id", id);
      if (error) throw error;
      logAudit({ action: "content.delete", entity: tableName, entity_id: id });
      toast.success("Deleted");
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const renderField = (field: FieldDef) => {
    const value = formData[field.key] ?? "";
    
    if (field.type === "array") {
      const arr = Array.isArray(value) ? value : [];
      return (
        <div key={field.key}>
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">{field.label}</label>
          <div className="space-y-2">
            {arr.map((item: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => {
                    const newArr = [...arr];
                    newArr[idx] = e.target.value;
                    setFormData(prev => ({ ...prev, [field.key]: newArr }));
                  }}
                  className="flex-1 bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground"
                />
                <button
                  onClick={() => setFormData(prev => ({ ...prev, [field.key]: arr.filter((_: any, i: number) => i !== idx) }))}
                  className="px-2 text-destructive hover:bg-destructive/10 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setFormData(prev => ({ ...prev, [field.key]: [...arr, ""] }))}
              className="text-xs text-blue-bright hover:underline"
            >
              + Add item
            </button>
          </div>
        </div>
      );
    }

    if (field.type === "video") {
      return (
        <div key={field.key}>
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">{field.label}</label>
          {value && (
            <div className="mb-2">
              <video src={value} controls className="w-full max-w-md rounded-lg border border-border/30" />
            </div>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm cursor-pointer hover:bg-secondary transition-colors">
            <Upload className="w-4 h-4" />
            Upload Video
            <input type="file" accept="video/*" className="hidden" onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(field.key, e.target.files[0]);
            }} />
          </label>
          <p className="text-xs text-muted-foreground mt-1">Supports MP4, WebM, etc.</p>
        </div>
      );
    }

    if (field.type === "file") {
      return (
        <div key={field.key}>
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">{field.label}</label>
          {value && (
            <div className="mb-2 text-xs text-muted-foreground truncate">{value}</div>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm cursor-pointer hover:bg-secondary transition-colors">
            <Upload className="w-4 h-4" />
            Upload
            <input type="file" className="hidden" onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(field.key, e.target.files[0]);
            }} />
          </label>
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={field.key}>
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">{field.label}</label>
          <textarea
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
            rows={3}
            placeholder={field.placeholder}
            className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-blue-primary/50"
          />
        </div>
      );
    }

    return (
      <div key={field.key}>
        <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">{field.label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
          placeholder={field.placeholder}
          className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-primary/50"
        />
      </div>
    );
  };

  const isEditing = isAdding || editingId !== null;

  return (
    <div className="cinema-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-display font-bold text-foreground">{title}</h2>
        {!isEditing && (
          <motion.button
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-primary to-blue-bright text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-primary/30 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" /> Add New
          </motion.button>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-6">{description}</p>

      {/* Edit/Add Form */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-secondary/20 border border-border/30 rounded-xl p-5 space-y-4">
              {fields.map(renderField)}
              <div className="flex gap-3 pt-2">
                <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-primary to-blue-bright text-white rounded-xl text-sm font-medium">
                  <Save className="w-4 h-4" /> {isAdding ? "Add" : "Save Changes"}
                </button>
                <button onClick={cancel} className="flex items-center gap-2 px-5 py-2.5 bg-secondary/50 border border-border/50 text-foreground rounded-xl text-sm font-medium">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items List */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No items yet. Click "Add New" to get started.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="flex items-center justify-between bg-secondary/20 border border-border/30 rounded-xl p-4 group hover:border-blue-primary/20 transition-colors"
              layout
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground text-sm truncate">
                  {item.title || item.company || item.name || item.key || "Untitled"}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {item.description || item.role || item.issuer || item.value || ""}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 rounded-lg hover:bg-blue-primary/10 text-blue-bright transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenericCrudManager;
