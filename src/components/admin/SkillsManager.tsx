import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSkillCategories } from "@/hooks/usePortfolioData";
import { Plus, Pencil, Trash2, Save, X, ChevronDown, ChevronRight } from "lucide-react";

const SkillsManager = () => {
  const { data: categories = [], isLoading } = useSkillCategories();
  const queryClient = useQueryClient();
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);

  // Category editing
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState({ title: "", description: "", proficiency: "Intermediate" });
  const [isAddingCat, setIsAddingCat] = useState(false);

  // Skill editing
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState({ name: "" });
  const [addingSkillForCat, setAddingSkillForCat] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["skill_categories"] });

  // --- Category CRUD ---
  const startAddCat = () => {
    setCatForm({ title: "", description: "", proficiency: "Intermediate" });
    setIsAddingCat(true);
    setEditingCatId(null);
  };

  const startEditCat = (cat: any) => {
    setCatForm({ title: cat.title, description: cat.description, proficiency: cat.proficiency });
    setEditingCatId(cat.id);
    setIsAddingCat(false);
  };

  const cancelCat = () => { setEditingCatId(null); setIsAddingCat(false); };

  const saveCat = async () => {
    try {
      if (isAddingCat) {
        const { error } = await supabase.from("skill_categories" as any).insert({
          title: catForm.title,
          description: catForm.description,
          proficiency: catForm.proficiency,
          sort_order: categories.length,
        });
        if (error) throw error;
        toast.success("Category added");
      } else if (editingCatId) {
        const { error } = await supabase.from("skill_categories" as any).update({
          title: catForm.title,
          description: catForm.description,
          proficiency: catForm.proficiency,
        }).eq("id", editingCatId);
        if (error) throw error;
        toast.success("Category updated");
      }
      invalidate();
      cancelCat();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    }
  };

  const deleteCat = async (id: string) => {
    if (!confirm("Delete this category and all its skills?")) return;
    const { error } = await supabase.from("skill_categories" as any).delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Category deleted"); invalidate(); }
  };

  // --- Skill CRUD ---
  const startAddSkill = (catId: string) => {
    setSkillForm({ name: "" });
    setAddingSkillForCat(catId);
    setEditingSkillId(null);
  };

  const startEditSkill = (skill: any) => {
    setSkillForm({ name: skill.name });
    setEditingSkillId(skill.id);
    setAddingSkillForCat(null);
  };

  const cancelSkill = () => { setEditingSkillId(null); setAddingSkillForCat(null); };

  const saveSkill = async (catId: string) => {
    try {
      if (addingSkillForCat) {
        const cat = categories.find((c: any) => c.id === catId);
        const { error } = await supabase.from("skills" as any).insert({
          category_id: catId,
          name: skillForm.name,
          sort_order: (cat?.skills || []).length,
        });
        if (error) throw error;
        toast.success("Skill added");
      } else if (editingSkillId) {
        const { error } = await supabase.from("skills" as any).update({ name: skillForm.name }).eq("id", editingSkillId);
        if (error) throw error;
        toast.success("Skill updated");
      }
      invalidate();
      cancelSkill();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    const { error } = await supabase.from("skills" as any).delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Skill deleted"); invalidate(); }
  };

  const isCatEditing = isAddingCat || editingCatId !== null;

  return (
    <div className="cinema-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-display font-bold text-foreground">Skills Manager</h2>
        {!isCatEditing && (
          <motion.button
            onClick={startAddCat}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-primary to-blue-bright text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-primary/30 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" /> Add Category
          </motion.button>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-6">Manage skill categories and individual skills within each.</p>

      {/* Category Add/Edit Form */}
      <AnimatePresence>
        {isCatEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-secondary/20 border border-border/30 rounded-xl p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Category Name</label>
                <input
                  type="text"
                  value={catForm.title}
                  onChange={(e) => setCatForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. AI & ML"
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={catForm.description}
                  onChange={(e) => setCatForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:border-blue-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Proficiency</label>
                <select
                  value={catForm.proficiency}
                  onChange={(e) => setCatForm(prev => ({ ...prev, proficiency: e.target.value }))}
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-primary/50"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Proficient">Proficient</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={saveCat} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-primary to-blue-bright text-white rounded-xl text-sm font-medium">
                  <Save className="w-4 h-4" /> {isAddingCat ? "Add Category" : "Save"}
                </button>
                <button onClick={cancelCat} className="flex items-center gap-2 px-5 py-2.5 bg-secondary/50 border border-border/50 text-foreground rounded-xl text-sm font-medium">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category List */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No categories yet.</div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat: any) => {
            const isExpanded = expandedCatId === cat.id;
            const skills = cat.skills || [];

            return (
              <motion.div
                key={cat.id}
                className="bg-secondary/20 border border-border/30 rounded-xl overflow-hidden hover:border-blue-primary/20 transition-colors"
                layout
              >
                {/* Category Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setExpandedCatId(isExpanded ? null : cat.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-blue-bright flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm">{cat.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {skills.length} skill{skills.length !== 1 ? "s" : ""} · {cat.proficiency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEditCat(cat); }}
                      className="p-2 rounded-lg hover:bg-blue-primary/10 text-blue-bright transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteCat(cat.id); }}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Skills inside category */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-border/20">
                        {/* Skill list */}
                        <div className="space-y-2 mb-3">
                          {skills.length === 0 && (
                            <p className="text-xs text-muted-foreground py-2">No skills in this category yet.</p>
                          )}
                          {skills
                            .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                            .map((skill: any) => (
                              <div key={skill.id} className="flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-2 group">
                                {editingSkillId === skill.id ? (
                                  <div className="flex items-center gap-2 flex-1">
                                    <input
                                      type="text"
                                      value={skillForm.name}
                                      onChange={(e) => setSkillForm({ name: e.target.value })}
                                      className="flex-1 bg-secondary/50 border border-border/50 rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-blue-primary/50"
                                      autoFocus
                                      onKeyDown={(e) => { if (e.key === "Enter") saveSkill(cat.id); if (e.key === "Escape") cancelSkill(); }}
                                    />
                                    <button onClick={() => saveSkill(cat.id)} className="p-1.5 rounded-lg bg-blue-primary/10 text-blue-bright hover:bg-blue-primary/20">
                                      <Save className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={cancelSkill} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <span className="text-sm text-foreground">{skill.name}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => startEditSkill(skill)} className="p-1.5 rounded-lg hover:bg-blue-primary/10 text-blue-bright">
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button onClick={() => deleteSkill(skill.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                        </div>

                        {/* Add skill inline */}
                        {addingSkillForCat === cat.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={skillForm.name}
                              onChange={(e) => setSkillForm({ name: e.target.value })}
                              placeholder="Skill name..."
                              className="flex-1 bg-secondary/50 border border-border/50 rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-blue-primary/50"
                              autoFocus
                              onKeyDown={(e) => { if (e.key === "Enter") saveSkill(cat.id); if (e.key === "Escape") cancelSkill(); }}
                            />
                            <button onClick={() => saveSkill(cat.id)} className="p-1.5 rounded-lg bg-blue-primary/10 text-blue-bright hover:bg-blue-primary/20">
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={cancelSkill} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startAddSkill(cat.id)}
                            className="flex items-center gap-1.5 text-xs text-blue-bright hover:text-blue-bright/80 font-medium mt-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Skill
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillsManager;
