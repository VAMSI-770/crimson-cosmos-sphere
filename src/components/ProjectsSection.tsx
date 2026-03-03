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
    title: "This Portfolio",
    description: "A cinematic digital world — not a website. Built with React, Three.js, and obsessive attention to detail.",
    tags: ["React", "Three.js", "Framer Motion"],
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="relative py-32 bg-gradient-radial">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Portfolio</p>
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-16">
            Iconic <span className="glow-text">Creations</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.1}>
              <div className="glass-card p-8 h-full group cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_hsla(0,100%,45%,0.15)] relative overflow-hidden">
                {/* Red gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h3 className="text-xl font-display font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Project →
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
