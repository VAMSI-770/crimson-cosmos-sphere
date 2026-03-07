import ScrollReveal from "./ScrollReveal";

const projects = [
  {
    title: "AI Prediction Model",
    description: "End-to-end ML pipeline for predictive analytics — data preprocessing, feature engineering, model training, and evaluation.",
    tags: ["Python", "Scikit-learn", "ML"],
  },
  {
    title: "Data Dashboard",
    description: "Interactive data visualization platform transforming raw datasets into actionable insights and clear narratives.",
    tags: ["Python", "Pandas", "Visualization"],
  },
  {
    title: "ML Classification System",
    description: "Intelligent classification engine with optimized hyperparameters delivering precision at production scale.",
    tags: ["Python", "NumPy", "ML"],
  },
  {
    title: "Portfolio Experience",
    description: "This cinematic portfolio — a product-grade website built with React, Three.js, and motion design.",
    tags: ["React", "Three.js", "Framer Motion"],
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="relative py-28 bg-gradient-subtle">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.25em] uppercase mb-3 font-medium">Scene IV</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-crimson to-violet mb-14" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.08}>
              <div className="module-card rounded-xl p-7 h-full group cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-crimson/[0.03] via-transparent to-violet/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h3 className="text-lg font-display font-semibold mb-2 text-foreground group-hover:text-crimson transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground border border-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 accent-text text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-400">
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
