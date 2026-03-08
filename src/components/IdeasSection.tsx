import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const ideas = [
  {
    title: "AI Study Companion",
    description: "An intelligent tutoring system that adapts to individual learning styles using ML.",
    category: "EdTech",
    fullDescription: "A personalized learning platform that uses machine learning to analyze student performance and adapt content delivery. Features include progress tracking, adaptive quizzes, and AI-generated study plans tailored to each learner's pace and preferences.",
    potentialImpact: "Could improve learning outcomes by 40% through personalized education paths.",
    technologies: ["Python", "TensorFlow", "React", "PostgreSQL"],
  },
  {
    title: "Carbon Footprint Tracker",
    description: "App that uses data science to help users reduce their environmental impact.",
    category: "Sustainability",
    fullDescription: "A comprehensive sustainability app that tracks daily activities and calculates carbon emissions. Uses predictive analytics to suggest eco-friendly alternatives and gamifies the reduction process to encourage sustainable habits.",
    potentialImpact: "Target to help users reduce personal carbon emissions by 25% within 6 months.",
    technologies: ["React Native", "Node.js", "ML", "APIs"],
  },
  {
    title: "Smart Health Monitor",
    description: "Predictive analytics for personal health using wearable data integration.",
    category: "HealthTech",
    fullDescription: "An AI-powered health monitoring system that integrates with wearables to provide early warning signs for potential health issues. Uses pattern recognition to detect anomalies and provides actionable health recommendations.",
    potentialImpact: "Early detection of health issues could improve intervention success rates significantly.",
    technologies: ["Python", "TensorFlow", "HealthKit", "Firebase"],
  },
  {
    title: "Code Mentor Bot",
    description: "AI-powered code review assistant that helps developers write better code.",
    category: "DevTools",
    fullDescription: "An intelligent code review system that analyzes code quality, suggests improvements, and explains best practices. Integrates with popular IDEs and version control systems to provide real-time feedback during development.",
    potentialImpact: "Could reduce code review time by 60% and improve code quality scores.",
    technologies: ["Python", "GPT", "VS Code API", "GitHub API"],
  },
];

const floatingAnimation = {
  y: [0, -6, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const IdeasSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="ideas" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Innovation</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display mb-5">
            Creative <span className="gradient-text">Ideas</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-12 md:mb-16" />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {ideas.map((idea, i) => (
            <ScrollReveal key={idea.title} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl p-5 md:p-7 h-full group cursor-pointer relative overflow-hidden"
                layout
                onClick={() => toggleExpand(i)}
                animate={expandedIndex === i ? {} : floatingAnimation}
                style={{ animationDelay: `${i * 0.5}s` }}
                whileHover={{ scale: expandedIndex === i ? 1 : 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Gradient glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/0 via-transparent to-blue-bright/0 group-hover:from-blue-primary/10 group-hover:to-blue-bright/5 transition-all duration-700" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl md:text-3xl font-display font-bold gradient-text">
                      {idea.title.charAt(0)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-3 py-1.5 rounded-full bg-secondary/60 text-blue-bright border border-blue-primary/20">
                        {idea.category}
                      </span>
                      <motion.span 
                        className="text-xs text-muted-foreground"
                        animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                      >
                        ↓
                      </motion.span>
                    </div>
                  </div>
                  <h3 className="text-base md:text-lg font-display font-semibold text-foreground mb-2 group-hover:text-blue-bright transition-colors">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {idea.description}
                  </p>

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
                            {idea.fullDescription}
                          </p>
                          
                          <div className="mb-4 p-3 rounded-lg bg-blue-primary/5 border border-blue-primary/10">
                            <p className="text-xs font-semibold text-blue-bright mb-1">Potential Impact</p>
                            <p className="text-sm text-muted-foreground">{idea.potentialImpact}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Proposed Stack</p>
                            <div className="flex flex-wrap gap-2">
                              {idea.technologies.map((tech) => (
                                <span key={tech} className="text-xs px-3 py-1 rounded-full bg-secondary/60 text-muted-foreground border border-border/50">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hover glow ring */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none glow-ring" />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IdeasSection;
