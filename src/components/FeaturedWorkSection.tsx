import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const featuredProjects = [
  {
    title: "AI Prediction Engine",
    description: "End-to-end ML pipeline for predictive analytics with advanced model evaluation.",
    image: "🧠",
    tags: ["Python", "Scikit-learn", "TensorFlow"],
    demo: "#",
    github: "#",
  },
  {
    title: "Real-time Dashboard",
    description: "Interactive visualization platform transforming raw datasets into insights.",
    image: "📊",
    tags: ["React", "D3.js", "Node.js"],
    demo: "#",
    github: "#",
  },
  {
    title: "Smart Classifier",
    description: "Intelligent classification system with optimized hyperparameters.",
    image: "⚡",
    tags: ["Python", "NumPy", "ML"],
    demo: "#",
    github: "#",
  },
];

const FeaturedWorkSection = () => {
  return (
    <section id="featured-work" className="relative py-32 bg-cinema-subtle">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Showcase</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">
            Featured <span className="gradient-text">Work</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-16" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl overflow-hidden h-full group cursor-pointer glow-ring"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative h-40 bg-gradient-to-br from-secondary via-muted to-secondary flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/[0.04] to-blue-bright/[0.02] group-hover:from-blue-primary/[0.15] group-hover:to-blue-bright/[0.1] transition-all duration-700" />
                  <motion.span
                    className="text-6xl relative z-10"
                    whileHover={{ scale: 1.3, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {project.image}
                  </motion.span>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-display font-semibold mb-2 text-foreground group-hover:text-blue-bright transition-colors duration-400">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-secondary/60 text-muted-foreground border border-border/50 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <motion.a
                      href={project.demo}
                      className="flex items-center gap-2 text-xs font-semibold text-blue-bright hover:text-blue-glow transition-colors"
                      whileHover={{ x: 3 }}
                    >
                      <ExternalLink size={14} /> Live Demo
                    </motion.a>
                    <motion.a
                      href={project.github}
                      className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                      whileHover={{ x: 3 }}
                    >
                      <Github size={14} /> GitHub
                    </motion.a>
                  </div>
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
