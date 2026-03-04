import ScrollReveal from "./ScrollReveal";

const skillGroups = [
  {
    title: "Data Science",
    skills: ["Python", "Pandas", "NumPy", "Machine Learning", "Data Visualization"],
  },
  {
    title: "Frontend",
    skills: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "APIs", "Python"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="relative py-28">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.25em] uppercase mb-3 font-medium">Stack</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Core <span className="gradient-text">Stack</span>
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-violet to-indigo mb-14" />
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {skillGroups.map((group, gi) => (
            <ScrollReveal key={group.title} delay={gi * 0.1}>
              <div className="module-card rounded-xl p-6 h-full">
                <h3 className="text-sm font-display font-semibold text-foreground mb-5 tracking-wide">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 text-xs font-medium text-secondary-foreground bg-secondary rounded-md border border-border transition-all duration-300 hover:border-violet/30 hover:text-foreground cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
