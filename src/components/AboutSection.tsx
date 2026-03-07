import ScrollReveal from "./ScrollReveal";

const metrics = [
  { value: "10+", label: "Projects" },
  { value: "15+", label: "Technologies" },
  { value: "AI/ML", label: "Current Focus" },
  { value: "∞", label: "Passion" },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative py-28 bg-gradient-subtle">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.25em] uppercase mb-3 font-medium">Origin</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            The <span className="gradient-text">Journey</span>
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-violet to-indigo mb-14" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal delay={0.1}>
            <div className="space-y-5">
               <p className="text-secondary-foreground leading-relaxed text-base">
                A 3rd year B.Tech Data Science student passionate about AI and machine learning. I believe technology can shape the future — and I'm building the skills to make that happen.
               </p>
               <p className="text-muted-foreground leading-relaxed text-base">
                Exploring full-stack development alongside my data science foundation. Interested in building intelligent products that combine data, design, and engineering.
               </p>
               <p className="text-muted-foreground leading-relaxed text-base">
                Driven by curiosity, inspired by the potential of AI, and focused on creating systems that solve real-world problems at scale.
               </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((m) => (
                <div key={m.label} className="glass-card p-6 text-center">
                  <p className="text-2xl font-bold font-display gradient-text mb-1">{m.value}</p>
                  <p className="text-xs text-muted-foreground tracking-wide uppercase">{m.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
