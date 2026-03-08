import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Download, FileText } from "lucide-react";
import CertificateViewer from "./CertificateViewer";

const internships = [
  {
    company: "AIMERS Society",
    role: "Data Science Intern",
    duration: "2024",
    description: "Hands-on training and project development experience in Data Science and Technology.",
    fullDescription: "Gained practical experience in data science methodologies, working on real datasets and developing analytical solutions. Participated in collaborative projects focusing on data analysis, visualization, and machine learning applications.",
    technologies: ["Python", "Pandas", "Data Analysis", "Machine Learning"],
    highlights: ["Hands-on data science training", "Real-world project development", "Collaborative team experience"],
    file: { url: "/certificates/AIMERS_intern_certificate.pdf", type: "pdf" as const },
    previewImage: "/certificates/AIMERS_intern_certificate_img.png",
  },
  {
    company: "Micro Information Technology Services",
    role: "Python Programming Intern",
    duration: "Batch 26",
    description: "Python programming and real-world development exposure with hands-on coding experience.",
    fullDescription: "Completed an intensive internship focused on Python programming fundamentals and advanced concepts. Worked on real-world development projects gaining practical coding experience and software development methodologies.",
    technologies: ["Python", "Programming", "Software Development"],
    highlights: ["Python programming proficiency", "Real-world coding projects", "Software development practices"],
    file: { url: "/certificates/Micro_IT_certificate_1.pdf", type: "pdf" as const },
    previewImage: "/certificates/Micro_IT_certificate_img.png",
  },
];

const InternshipsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [viewerFile, setViewerFile] = useState<{ url: string; title: string; type: "pdf" | "image" } | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handlePreview = (e: React.MouseEvent, item: typeof internships[0]) => {
    e.stopPropagation();
    if (item.file) {
      setViewerFile({ url: item.file.url, title: `${item.role} - ${item.company}`, type: item.file.type });
    }
  };

  const handleDownload = (e: React.MouseEvent, item: typeof internships[0]) => {
    e.stopPropagation();
    if (item.file) {
      const a = document.createElement("a");
      a.href = item.file.url;
      a.download = `${item.role} - ${item.company}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      <section id="internships" className="relative py-24 md:py-32 bg-cinema-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <ScrollReveal>
            <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Experience</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display mb-5">
              Professional <span className="gradient-text">Internships</span>
            </h2>
            <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-12 md:mb-16" />
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            {internships.map((item, i) => (
              <ScrollReveal key={item.company} delay={i * 0.1}>
                <motion.div
                  className="cinema-card rounded-2xl overflow-hidden h-full group cursor-pointer glow-ring"
                  layout
                  onClick={() => toggleExpand(i)}
                  whileHover={{ y: expandedIndex === i ? 0 : -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="p-5 md:p-7 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-secondary/60 border border-border/50 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-bright" />
                        </div>
                        <span className="text-xs font-bold text-blue-bright tracking-wider uppercase">
                          {item.duration}
                        </span>
                      </div>
                      <motion.span
                        className="text-xs text-muted-foreground"
                        animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                      >
                        ↓
                      </motion.span>
                    </div>

                    <h3 className="text-base md:text-lg font-display font-semibold text-foreground mb-1 group-hover:text-blue-bright transition-colors">
                      {item.role}
                    </h3>
                    <p className="text-sm text-blue-bright/70 mb-3">{item.company}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Action Buttons */}
                    {item.file && (
                      <div className="flex gap-2 mt-auto pt-3 border-t border-border/20">
                        <button
                          onClick={(e) => handlePreview(e, item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-primary/10 text-blue-bright hover:bg-blue-primary/20 border border-blue-primary/20 transition-all duration-200 hover:scale-105"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview
                        </button>
                        <button
                          onClick={(e) => handleDownload(e, item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/50 transition-all duration-200 hover:scale-105"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>
                    )}

                    <AnimatePresence>
                      {expandedIndex === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-5 mt-4 border-t border-border/30">
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                              {item.fullDescription}
                            </p>
                            <div className="mb-4">
                              <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Technologies</p>
                              <div className="flex flex-wrap gap-2">
                                {item.technologies.map((tech) => (
                                  <span key={tech} className="text-xs px-3 py-1.5 rounded-full bg-secondary/60 text-muted-foreground border border-border/50">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Key Highlights</p>
                              <ul className="space-y-1">
                                {item.highlights.map((highlight, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground">
                                    • {highlight}
                                  </li>
                                ))}
                              </ul>
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

      <CertificateViewer
        isOpen={!!viewerFile}
        onClose={() => setViewerFile(null)}
        file={viewerFile}
      />
    </>
  );
};

export default InternshipsSection;
