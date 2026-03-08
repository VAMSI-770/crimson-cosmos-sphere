import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { useSkillCategories } from "@/hooks/usePortfolioData";

const fallbackSkillGroups = [
  { title: "AI & ML", skills: [{ name: "Python" }, { name: "TensorFlow" }, { name: "YOLOv8" }, { name: "Scikit-learn" }, { name: "OpenCV" }], description: "Building intelligent models for object detection, image classification, and predictive analytics.", proficiency: "Advanced" },
  { title: "Computer Vision", skills: [{ name: "YOLOv8" }, { name: "Roboflow" }, { name: "OpenCV" }, { name: "Image Processing" }, { name: "CNNs" }], description: "Real-time object detection and image analysis.", proficiency: "Advanced" },
  { title: "Data Science", skills: [{ name: "Pandas" }, { name: "NumPy" }, { name: "Matplotlib" }, { name: "SQL" }, { name: "Data Visualization" }], description: "Extracting insights from data.", proficiency: "Proficient" },
  { title: "Development", skills: [{ name: "React" }, { name: "HTML/CSS" }, { name: "JavaScript" }, { name: "Git" }, { name: "GitHub" }], description: "Building web applications.", proficiency: "Intermediate" },
];

const SkillsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { data: dbSkillGroups } = useSkillCategories();
  
  const skillGroups = dbSkillGroups && dbSkillGroups.length > 0 ? dbSkillGroups : fallbackSkillGroups;

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Expertise</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display mb-5">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-12 md:mb-16" />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {skillGroups.map((group: any, gi: number) => {
            const skills = group.skills || [];
            return (
              <ScrollReveal key={group.title} delay={gi * 0.1}>
                <motion.div
                  className="cinema-card rounded-2xl p-5 md:p-7 h-full glow-ring cursor-pointer"
                  layout
                  onClick={() => toggleExpand(gi)}
                  whileHover={{ y: expandedIndex === gi ? 0 : -8 }}
                  transition={{ type: "spring", stiffness: 250 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl md:text-3xl font-display font-bold gradient-text">{group.title.charAt(0)}</span>
                    <motion.span className="text-xs text-muted-foreground" animate={{ rotate: expandedIndex === gi ? 180 : 0 }}>↓</motion.span>
                  </div>
                  <h3 className="text-sm font-display font-semibold text-foreground mb-4 tracking-wider uppercase">{group.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: any) => (
                      <motion.span
                        key={typeof skill === "string" ? skill : skill.name}
                        className="px-3 py-1.5 text-xs font-medium text-secondary-foreground bg-secondary/60 rounded-full border border-border/60 transition-all duration-300 hover:border-blue-primary/30 hover:text-foreground hover:bg-blue-primary/5 cursor-default"
                        whileHover={{ scale: 1.05 }}
                      >
                        {typeof skill === "string" ? skill : skill.name}
                      </motion.span>
                    ))}
                  </div>

                  <AnimatePresence>
                    {expandedIndex === gi && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="overflow-hidden">
                        <div className="pt-4 mt-4 border-t border-border/30">
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{group.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Level:</span>
                            <span className="text-xs px-3 py-1 rounded-full bg-blue-primary/10 text-blue-bright border border-blue-primary/20">{group.proficiency}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
