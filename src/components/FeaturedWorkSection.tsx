import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const featuredProjects = [
  {
    title: "AI Prediction Engine",
    description: "End-to-end ML pipeline for predictive analytics with advanced model evaluation.",
    fullDescription: "A comprehensive machine learning system that processes large datasets, performs automated feature engineering, and delivers accurate predictions. The pipeline includes data validation, model training with hyperparameter optimization, and real-time inference capabilities.",
    tags: ["Python", "Scikit-learn", "TensorFlow"],
    features: ["Automated feature engineering", "Real-time predictions", "Model versioning", "A/B testing framework"],
    demo: "#",
    github: "#",
  },
  {
    title: "Real-time Dashboard",
    description: "Interactive visualization platform transforming raw datasets into insights.",
    fullDescription: "A powerful analytics dashboard that connects to multiple data sources and provides real-time visualizations. Features include customizable charts, automated reporting, and collaborative annotations for team insights.",
    tags: ["React", "D3.js", "Node.js"],
    features: ["Live data streaming", "Custom chart builder", "Export to PDF/Excel", "Team collaboration"],
    demo: "#",
    github: "#",
  },
  {
    title: "Smart Classifier",
    description: "Intelligent classification system with optimized hyperparameters.",
    fullDescription: "A production-ready classification system capable of handling multiple data types with high accuracy. Includes automated preprocessing, ensemble methods, and confidence scoring for reliable predictions.",
    tags: ["Python", "NumPy", "ML"],
    features: ["Multi-class support", "Confidence scoring", "Batch processing", "API integration"],
    demo: "#",
    github: "#",
  },
];

const FeaturedWorkSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="portfolio" className="relative py-24 md:py-32 bg-cinema-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Showcase</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display mb-5">
            Portfolio <span className="gradient-text">Showcase</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-12 md:mb-16" />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredProjects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl overflow-hidden h-full group cursor-pointer glow-ring"
                layout
                onClick={() => toggleExpand(i)}
                whileHover={{ y: expandedIndex === i ? 0 : -8, scale: expandedIndex === i ? 1 : 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative h-32 sm:h-40 bg-gradient-to-br from-secondary via-muted to-secondary flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/[0.04] to-blue-bright/[0.02] group-hover:from-blue-primary/[0.15] group-hover:to-blue-bright/[0.1] transition-all duration-700" />
                  <span className="text-4xl sm:text-5xl font-display font-bold gradient-text relative z-10">
                    {project.title.charAt(0)}
                  </span>
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base md:text-lg font-display font-semibold text-foreground group-hover:text-blue-bright transition-colors duration-400">
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
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-secondary/60 text-muted-foreground border border-border/50 font-medium">
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
                          
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Key Features</p>
                            <ul className="space-y-1">
                              {project.features.map((feature, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground">
                                  • {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex gap-4 pt-2">
                            <a
                              href={project.demo}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-semibold text-blue-bright hover:text-blue-glow transition-colors"
                            >
                              Live Demo →
                            </a>
                            <a
                              href={project.github}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Source Code →
                            </a>
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

export default FeaturedWorkSection;
