import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const projects = [
  {
    title: "AI Prediction Model",
    description: "End-to-end ML pipeline for predictive analytics — data preprocessing, feature engineering, model training, and evaluation.",
    tags: ["Python", "Scikit-learn", "ML"],
    color: "from-blueberry/10 to-lavender/20",
  },
  {
    title: "Data Dashboard",
    description: "Interactive data visualization platform transforming raw datasets into actionable insights and clear narratives.",
    tags: ["Python", "Pandas", "Visualization"],
    color: "from-strawberry/10 to-cream",
  },
  {
    title: "ML Classification System",
    description: "Intelligent classification engine with optimized hyperparameters delivering precision at production scale.",
    tags: ["Python", "NumPy", "ML"],
    color: "from-lemon/15 to-mint/20",
  },
  {
    title: "Portfolio Experience",
    description: "This creative portfolio — a dessert-inspired cinematic website built with React and motion design.",
    tags: ["React", "Tailwind", "Framer Motion"],
    color: "from-blueberry/8 to-strawberry/8",
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="relative py-28">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.25em] uppercase mb-3 font-semibold">Cinema Gallery</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-20 h-1 rounded-full bg-gradient-to-r from-blueberry to-strawberry mb-14" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.08}>
              <motion.div
                className={`dessert-card rounded-2xl p-8 h-full group cursor-pointer relative overflow-hidden bg-gradient-to-br ${project.color}`}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 250 }}
              >
                <div className="relative z-10">
                  {/* Preview area */}
                  <div className="w-full h-32 rounded-xl bg-background/40 border border-border/40 mb-6 flex items-center justify-center">
                    <span className="text-3xl">
                      {i === 0 ? "🧠" : i === 1 ? "📊" : i === 2 ? "⚡" : "🎨"}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2 text-foreground group-hover:text-blueberry transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-background/60 text-muted-foreground border border-border/50 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 accent-text text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Project →
                  </p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
