import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const showcaseSkills = [
  {
    title: "Frontend Development",
    description: "Building responsive, performant user interfaces with modern React ecosystem.",
    fullDescription: "Expertise in creating pixel-perfect, accessible web applications using React, Next.js, and TypeScript. Proficient in state management, component architecture, and performance optimization techniques.",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    examples: ["Interactive dashboards", "E-commerce platforms", "Portfolio websites", "Admin panels"],
    proficiency: "Advanced",
  },
  {
    title: "Backend Development",
    description: "Designing scalable server architectures and RESTful APIs.",
    fullDescription: "Strong foundation in building robust backend systems with Node.js and Express. Experience with database design, API security, authentication systems, and cloud deployment.",
    technologies: ["Node.js", "Express", "PostgreSQL", "MongoDB"],
    examples: ["REST APIs", "Authentication systems", "Database design", "Microservices"],
    proficiency: "Advanced",
  },
  {
    title: "Machine Learning",
    description: "Developing intelligent systems with modern ML frameworks.",
    fullDescription: "Hands-on experience with machine learning pipelines, from data preprocessing to model deployment. Skilled in classification, regression, and natural language processing tasks.",
    technologies: ["Python", "TensorFlow", "Scikit-learn", "Pandas"],
    examples: ["Prediction engines", "Classification systems", "Data analysis", "NLP applications"],
    proficiency: "Intermediate",
  },
  {
    title: "UI/UX Design",
    description: "Crafting intuitive interfaces with modern design principles.",
    fullDescription: "Combining technical skills with design sensibility to create visually compelling and user-friendly interfaces. Proficient in prototyping, wireframing, and implementing smooth animations.",
    technologies: ["Figma", "Framer Motion", "CSS Animation", "Design Systems"],
    examples: ["Motion design", "Prototyping", "Responsive layouts", "Component libraries"],
    proficiency: "Intermediate",
  },
  {
    title: "DevOps & Tools",
    description: "Streamlining development workflows with modern tooling.",
    fullDescription: "Experience with version control, CI/CD pipelines, containerization, and cloud platforms. Focused on creating efficient development environments and deployment processes.",
    technologies: ["Git", "Docker", "GitHub Actions", "AWS"],
    examples: ["CI/CD pipelines", "Container orchestration", "Cloud deployment", "Automated testing"],
    proficiency: "Proficient",
  },
  {
    title: "Problem Solving",
    description: "Algorithmic thinking and competitive programming mindset.",
    fullDescription: "Strong analytical skills developed through competitive programming and hackathons. Proficient in data structures, algorithms, and optimizing solutions for complex problems.",
    technologies: ["DSA", "System Design", "Optimization", "Debugging"],
    examples: ["Algorithm design", "Code optimization", "System architecture", "Technical interviews"],
    proficiency: "Advanced",
  },
];

const ShowcaseSkillsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="showcase-skills" className="relative py-24 md:py-32 bg-cinema-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Expertise</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display mb-5">
            Showcase <span className="gradient-text">Skills</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-12 md:mb-16" />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {showcaseSkills.map((skill, i) => (
            <ScrollReveal key={skill.title} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl overflow-hidden h-full group cursor-pointer glow-ring"
                layout
                onClick={() => toggleExpand(i)}
                whileHover={{ y: expandedIndex === i ? 0 : -8, scale: expandedIndex === i ? 1 : 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative h-28 sm:h-36 bg-gradient-to-br from-secondary via-muted to-secondary flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/[0.04] to-blue-bright/[0.02] group-hover:from-blue-primary/[0.15] group-hover:to-blue-bright/[0.1] transition-all duration-700" />
                  <span className="text-4xl sm:text-5xl font-display font-bold gradient-text relative z-10">
                    {skill.title.charAt(0)}
                  </span>
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base md:text-lg font-display font-semibold text-foreground group-hover:text-blue-bright transition-colors duration-400">
                      {skill.title}
                    </h3>
                    <motion.span 
                      className="text-xs text-muted-foreground"
                      animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                    >
                      ↓
                    </motion.span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {skill.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-xs px-3 py-1 rounded-full bg-secondary/60 text-muted-foreground border border-border/50 font-medium">
                        {tech}
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
                            {skill.fullDescription}
                          </p>
                          
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Technologies</p>
                            <div className="flex flex-wrap gap-2">
                              {skill.technologies.map((tech) => (
                                <span key={tech} className="text-xs px-3 py-1 rounded-full bg-blue-primary/10 text-blue-bright border border-blue-primary/20">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Project Examples</p>
                            <ul className="space-y-1">
                              {skill.examples.map((example, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground">
                                  • {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Level:</span>
                            <span className="text-xs px-3 py-1 rounded-full bg-blue-primary/10 text-blue-bright border border-blue-primary/20">
                              {skill.proficiency}
                            </span>
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

export default ShowcaseSkillsSection;
