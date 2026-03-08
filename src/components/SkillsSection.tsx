import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const skillGroups = [
  {
    title: "Frontend",
    icon: "◈",
    skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind"],
  },
  {
    title: "Data Science",
    icon: "◉",
    skills: ["Python", "Pandas", "NumPy", "Machine Learning", "Visualization"],
  },
  {
    title: "Backend & Tools",
    icon: "◊",
    skills: ["Node.js", "APIs", "Git", "Figma", "Docker"],
  },
  {
    title: "Creative",
    icon: "✦",
    skills: ["UI Design", "Motion", "Framer Motion", "Prototyping"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="relative py-32">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.3em] uppercase mb-4 font-semibold">Act II</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">
            Tech <span className="gradient-text">Grid</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blueberry-glow to-berry-pink mb-16" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {skillGroups.map((group, gi) => (
            <ScrollReveal key={group.title} delay={gi * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl p-7 h-full glow-ring"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 250 }}
              >
                <span className="text-2xl text-blueberry-glow mb-4 block">{group.icon}</span>
                <h3 className="text-sm font-display font-semibold text-foreground mb-5 tracking-wide">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      className="px-3.5 py-1.5 text-xs font-medium text-secondary-foreground bg-secondary/60 rounded-full border border-border/60 transition-all duration-300 hover:border-blueberry-glow/30 hover:text-foreground hover:bg-blueberry-glow/5 hover:shadow-[0_0_15px_hsla(245,100%,71%,0.08)] cursor-default"
                      whileHover={{ scale: 1.05 }}
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
