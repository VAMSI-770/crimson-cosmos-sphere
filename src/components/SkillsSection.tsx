import ScrollReveal from "./ScrollReveal";

const skillGroups = [
  {
    title: "Frontend",
    skills: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    title: "Backend",
    skills: ["Python", "Node.js"],
  },
  {
    title: "Data Science",
    skills: ["Python", "Pandas", "NumPy", "Machine Learning", "Data Visualization"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="relative py-32">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Skills</p>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-16">
            My Tech <span className="glow-text">Arsenal</span>
          </h2>
        </ScrollReveal>

        <div className="space-y-12">
          {skillGroups.map((group, gi) => (
            <ScrollReveal key={group.title} delay={gi * 0.1}>
              <h3 className="text-lg font-display text-secondary-foreground mb-4">{group.title}</h3>
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="glass-card px-5 py-2.5 text-sm font-medium text-foreground cursor-default transition-all duration-300 hover:shadow-[0_0_25px_hsla(0,100%,45%,0.2)] hover:scale-105 hover:border-primary/40"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
