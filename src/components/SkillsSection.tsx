import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";
import { Code2, Server, Wrench, Palette } from "lucide-react";

const skillGroups = [
  {
    title: "Frontend",
    icon: Code2,
    skills: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Backend",
    icon: Server,
    skills: ["Node.js", "Express", "REST APIs", "Python", "Databases"],
  },
  {
    title: "Tools",
    icon: Wrench,
    skills: ["Git", "GitHub", "Docker", "Figma", "VS Code"],
  },
  {
    title: "Creative",
    icon: Palette,
    skills: ["UI Design", "Motion", "Framer Motion", "Prototyping"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="relative py-32">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Expertise</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-16" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {skillGroups.map((group, gi) => (
            <ScrollReveal key={group.title} delay={gi * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl p-7 h-full glow-ring"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 250 }}
              >
                <group.icon className="w-6 h-6 text-blue-bright mb-4" />
                <h3 className="text-sm font-display font-semibold text-foreground mb-5 tracking-wider uppercase">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      className="px-3.5 py-1.5 text-xs font-medium text-secondary-foreground bg-secondary/60 rounded-full border border-border/60 transition-all duration-300 hover:border-blue-primary/30 hover:text-foreground hover:bg-blue-primary/5 hover:shadow-[0_0_15px_hsla(221,83%,53%,0.08)] cursor-default"
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
