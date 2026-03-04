import ScrollReveal from "./ScrollReveal";

const metrics = [
  { value: "10+", label: "Projects" },
  { value: "15+", label: "Technologies" },
  { value: "AI/ML", label: "Focus Area" },
  { value: "∞", label: "Curiosity" },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative py-28 bg-gradient-subtle">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.25em] uppercase mb-3 font-medium">About</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            About the <span className="gradient-text">Builder</span>
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-violet to-indigo mb-14" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal delay={0.1}>
            <div className="space-y-5">
              <p className="text-secondary-foreground leading-relaxed text-base">
                A 3rd year B.Tech Data Science student with a deep focus on building intelligent systems. I think in systems, not features — and I'm driven by the intersection of data, design, and engineering.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                Currently exploring full-stack development to complement my AI/ML foundation. My goal is to build scalable, production-grade products that solve real problems.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                Passionate about machine learning pipelines, data-driven decision making, and creating technology that feels as good as it works.
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
