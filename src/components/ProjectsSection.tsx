import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const projects = [
  {
    title: "AI Prediction Engine",
    description: "End-to-end ML pipeline for predictive analytics with data preprocessing, feature engineering, and model evaluation.",
    tags: ["Python", "Scikit-learn", "ML"],
    fullDescription: "A comprehensive machine learning pipeline that handles the complete workflow from data ingestion to model deployment. Features automated data cleaning, intelligent feature selection, and ensemble model training with cross-validation.",
    challenges: "Handling imbalanced datasets and optimizing for both precision and recall.",
    outcome: "Achieved 94% accuracy on production data with 3x faster inference than baseline.",
  },
  {
    title: "Data Dashboard",
    description: "Interactive visualization platform transforming raw datasets into actionable insights and narratives.",
    tags: ["Python", "Pandas", "Visualization"],
    fullDescription: "A dynamic dashboard application that connects to multiple data sources and provides real-time analytics. Features include custom chart builders, automated report generation, and collaborative annotation tools.",
    challenges: "Real-time data synchronization and maintaining performance with large datasets.",
    outcome: "Reduced data analysis time by 70% for the analytics team.",
  },
  {
    title: "ML Classification System",
    description: "Intelligent classification engine with optimized hyperparameters delivering precision at scale.",
    tags: ["Python", "NumPy", "ML"],
    fullDescription: "A production-grade classification system capable of handling multi-class problems with high accuracy. Includes automated hyperparameter tuning, feature importance analysis, and model interpretability tools.",
    challenges: "Balancing model complexity with interpretability for stakeholder presentations.",
    outcome: "Deployed to production handling 50K+ daily classification requests.",
  },
  {
    title: "Portfolio Experience",
    description: "This cinematic portfolio — a premium dark-themed experience built with React and motion design.",
    tags: ["React", "Tailwind", "Framer Motion"],
    fullDescription: "A modern, performant portfolio website showcasing professional work and skills. Built with attention to design details, smooth animations, and optimal user experience across all devices.",
    challenges: "Achieving 60fps animations while maintaining accessibility and SEO.",
    outcome: "Lighthouse score of 95+ across all metrics.",
  },
];

const ProjectsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="projects" className="relative py-24 md:py-32 bg-cinema-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Portfolio</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display mb-5">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-12 md:mb-16" />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl overflow-hidden h-full group cursor-pointer glow-ring"
                layout
                onClick={() => toggleExpand(i)}
                whileHover={{ y: expandedIndex === i ? 0 : -8, scale: expandedIndex === i ? 1 : 1.01 }}
                transition={{ type: "spring", stiffness: 250 }}
              >
                <div className="relative h-36 sm:h-44 bg-gradient-to-br from-secondary via-muted to-secondary flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/[0.04] to-blue-bright/[0.02] group-hover:from-blue-primary/[0.1] group-hover:to-blue-bright/[0.06] transition-all duration-700" />
                  <motion.span
                    className="text-4xl sm:text-5xl font-display font-bold gradient-text relative z-10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {project.title.charAt(0)}
                  </motion.span>
                </div>

                <div className="p-5 md:p-7">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base md:text-lg font-display font-semibold text-foreground group-hover:text-blue-bright transition-colors duration-400 tracking-wide">
                      {project.title}
                    </h3>
                    <motion.span 
                      className="text-xs text-muted-foreground"
                      animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                    >
                      ↓
                    </motion.span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-secondary/60 text-muted-foreground border border-border/50 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <AnimatePresence>
                    {expandedIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-5 mt-5 border-t border-border/30">
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            {project.fullDescription}
                          </p>
                          
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">Challenge</p>
                            <p className="text-sm text-muted-foreground">{project.challenges}</p>
                          </div>
                          
                          <div className="p-3 rounded-lg bg-blue-primary/5 border border-blue-primary/10">
                            <p className="text-xs font-semibold text-blue-bright mb-1">Outcome</p>
                            <p className="text-sm text-muted-foreground">{project.outcome}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
