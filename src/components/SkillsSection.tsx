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
    <section id="skills" className="relative py-36 brush-texture">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="gold-text text-sm tracking-[0.3em] uppercase mb-3 font-body font-medium">Chapter II</p>
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-4">
            Tools of{" "}
            <span className="glow-text italic">My Craft</span>
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-primary to-gold mb-16" />
        </ScrollReveal>

        <div className="space-y-14">
          {skillGroups.map((group, gi) => (
            <ScrollReveal key={group.title} delay={gi * 0.1}>
              <h3 className="text-lg font-display italic text-gold-light mb-5">{group.title}</h3>
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill, si) => (
                  <span
                    key={skill}
                    className="emblem px-6 py-3 text-sm font-medium text-foreground cursor-default animate-pulse-glow"
                    style={{ animationDelay: `${si * 0.7}s` }}
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
