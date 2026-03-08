import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const skillGroups = [
  {
    title: "Data Science",
    emoji: "🫐",
    gradient: "from-blueberry/10 to-lavender/30",
    skills: ["Python", "Pandas", "NumPy", "Machine Learning", "Data Visualization"],
  },
  {
    title: "Frontend",
    emoji: "🍰",
    gradient: "from-strawberry/10 to-cream",
    skills: ["HTML", "CSS", "JavaScript", "React", "Tailwind"],
  },
  {
    title: "Backend & Tools",
    emoji: "🍋",
    gradient: "from-lemon/20 to-mint/30",
    skills: ["Node.js", "APIs", "Git", "Figma", "Docker"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="relative py-28">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.25em] uppercase mb-3 font-semibold">Dessert Showcase</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <div className="w-20 h-1 rounded-full bg-gradient-to-r from-blueberry to-strawberry mb-14" />
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {skillGroups.map((group, gi) => (
            <ScrollReveal key={group.title} delay={gi * 0.12}>
              <motion.div
                className={`dessert-card rounded-2xl p-7 h-full bg-gradient-to-br ${group.gradient}`}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl mb-4">{group.emoji}</div>
                <h3 className="text-base font-display font-semibold text-foreground mb-5 tracking-wide">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      className="px-4 py-2 text-xs font-medium text-secondary-foreground bg-background/60 rounded-full border border-border/60 transition-all duration-300 hover:border-blueberry/30 hover:text-foreground hover:bg-background cursor-default"
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
