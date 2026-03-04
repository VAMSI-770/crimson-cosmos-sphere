import ScrollReveal from "./ScrollReveal";

const projects = [
  {
    title: "AI Prediction Model",
    description: "An end-to-end ML pipeline that sees patterns humans can't — trained, tuned, and battle-tested.",
    tags: ["Python", "Scikit-learn", "ML"],
  },
  {
    title: "Data Dashboard",
    description: "Interactive visual storytelling — where raw data transforms into decisions and clarity.",
    tags: ["Python", "Pandas", "Visualization"],
  },
  {
    title: "ML Classification System",
    description: "Intelligent classification engine that learns, adapts, and delivers precision at scale.",
    tags: ["Python", "NumPy", "ML"],
  },
  {
    title: "This Portfolio Experience",
    description: "A living digital painting — not a website. Built with React, Three.js, and obsessive artistic vision.",
    tags: ["React", "Three.js", "Framer Motion"],
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="relative py-36 bg-gradient-radial brush-texture">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="gold-text text-sm tracking-[0.3em] uppercase mb-3 font-body font-medium">Chapter III</p>
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-4">
            Digital{" "}
            <span className="glow-text italic">Masterpieces</span>
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-gold to-primary mb-16" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.1}>
              <div className="painting-frame rounded-lg p-8 h-full group cursor-pointer transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_0_50px_hsla(0,100%,40%,0.15),0_0_20px_hsla(43,74%,45%,0.1)] relative overflow-hidden bg-card">
                {/* Red gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10">
                  <h3 className="text-xl font-display font-semibold mb-3 text-ivory group-hover:text-gold-light transition-colors duration-500 italic">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 gold-text text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-display italic">
                    View Masterpiece →
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
