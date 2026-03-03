import ScrollReveal from "./ScrollReveal";

const projects = [
  {
    title: "Data Analysis Dashboard",
    description: "Interactive dashboard for exploring datasets with dynamic charts, filters, and real-time insights.",
    tags: ["Python", "Pandas", "Visualization"],
  },
  {
    title: "ML Prediction App",
    description: "End-to-end machine learning pipeline for predicting outcomes with trained models and clean UI.",
    tags: ["Python", "Scikit-learn", "Streamlit"],
  },
  {
    title: "Portfolio Website",
    description: "This immersive, 3D-powered portfolio built with React, Three.js, and Framer Motion.",
    tags: ["React", "Three.js", "Tailwind"],
  },
  {
    title: "Data Cleaning Toolkit",
    description: "Automated data preprocessing pipeline handling missing values, outliers, and feature engineering.",
    tags: ["Python", "NumPy", "Pandas"],
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="relative py-32 bg-gradient-radial">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Projects</p>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-16">
            Things I've <span className="glow-text">Built</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.1}>
              <div className="glass-card p-8 h-full group cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:rotate-[0.3deg]">
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
