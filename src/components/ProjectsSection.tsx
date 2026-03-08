import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const projects = [
  {
    title: "AI Prediction Engine",
    description: "End-to-end ML pipeline for predictive analytics with data preprocessing, feature engineering, and model evaluation.",
    tags: ["Python", "Scikit-learn", "ML"],
    emoji: "🧠",
  },
  {
    title: "Data Dashboard",
    description: "Interactive visualization platform transforming raw datasets into actionable insights and narratives.",
    tags: ["Python", "Pandas", "Visualization"],
    emoji: "📊",
  },
  {
    title: "ML Classification System",
    description: "Intelligent classification engine with optimized hyperparameters delivering precision at scale.",
    tags: ["Python", "NumPy", "ML"],
    emoji: "⚡",
  },
  {
    title: "Portfolio Experience",
    description: "This cinematic portfolio — a premium dark-themed experience built with React and motion design.",
    tags: ["React", "Tailwind", "Framer Motion"],
    emoji: "🎬",
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="relative py-32 bg-cinema-subtle">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.3em] uppercase mb-4 font-semibold">Act III</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">
            Featured <span className="gradient-text">Work</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blueberry-glow to-berry-pink mb-16" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl overflow-hidden h-full group cursor-pointer glow-ring"
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 250 }}
              >
                {/* Preview area with atmospheric glow */}
                <div className="relative h-40 bg-gradient-to-br from-secondary via-muted to-secondary flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blueberry-glow/[0.05] to-berry-pink/[0.03] group-hover:from-blueberry-glow/[0.1] group-hover:to-berry-pink/[0.06] transition-all duration-700" />
                  <span className="text-4xl relative z-10">{project.emoji}</span>
                </div>

                <div className="p-7">
                  <h3 className="text-lg font-display font-semibold mb-2 text-foreground group-hover:text-blueberry-glow transition-colors duration-400">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-secondary/60 text-muted-foreground border border-border/50 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="accent-text text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-400">
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
