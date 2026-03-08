import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const certifications = [
  {
    title: "Machine Learning Specialization",
    issuer: "Stanford Online / Coursera",
    year: "2024",
    description: "Comprehensive ML course covering supervised learning, neural networks, and practical implementation.",
    skills: ["Supervised Learning", "Neural Networks", "Decision Trees", "Recommender Systems"],
    credentialId: "ML-STANFORD-2024",
  },
  {
    title: "Python for Data Science",
    issuer: "IBM",
    year: "2023",
    description: "Professional certification in Python programming for data analysis and visualization.",
    skills: ["Python", "Pandas", "NumPy", "Data Visualization"],
    credentialId: "IBM-PY-DS-2023",
  },
  {
    title: "Deep Learning Fundamentals",
    issuer: "DeepLearning.AI",
    year: "2024",
    description: "Advanced deep learning techniques including CNNs, RNNs, and transformer architectures.",
    skills: ["TensorFlow", "CNNs", "RNNs", "Transformers"],
    credentialId: "DL-AI-2024",
  },
  {
    title: "Full Stack Development",
    issuer: "Meta",
    year: "2024",
    description: "End-to-end web development covering frontend, backend, and deployment strategies.",
    skills: ["React", "Node.js", "Databases", "API Design"],
    credentialId: "META-FS-2024",
  },
];

const CertificationsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="certifications" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Credentials</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display mb-5">
            Professional <span className="gradient-text">Certifications</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-12 md:mb-16" />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {certifications.map((cert, i) => (
            <ScrollReveal key={cert.title} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl p-5 md:p-6 h-full group cursor-pointer glow-ring"
                layout
                onClick={() => toggleExpand(i)}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: expandedIndex === i ? 0 : -8, scale: expandedIndex === i ? 1 : 1.03 }}
              >
                <div className="text-center mb-4">
                  <span className="text-3xl md:text-4xl font-display font-bold gradient-text">
                    {cert.title.charAt(0)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-blue-bright/70">{cert.year}</span>
                  <motion.span 
                    className="text-xs text-muted-foreground"
                    animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                  >
                    ↓
                  </motion.span>
                </div>
                
                <h3 className="text-sm font-display font-semibold text-foreground mb-2 group-hover:text-blue-bright transition-colors">
                  {cert.title}
                </h3>
                <p className="text-xs text-muted-foreground">{cert.issuer}</p>

                <AnimatePresence>
                  {expandedIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-border/30">
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {cert.description}
                        </p>
                        
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Skills Covered</p>
                          <div className="flex flex-wrap gap-1">
                            {cert.skills.map((skill) => (
                              <span key={skill} className="text-xs px-2 py-1 rounded-full bg-secondary/60 text-muted-foreground border border-border/50">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          ID: {cert.credentialId}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
