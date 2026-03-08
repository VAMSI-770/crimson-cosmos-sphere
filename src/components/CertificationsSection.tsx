import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Download, FileText, Image } from "lucide-react";
import CertificateViewer from "./CertificateViewer";

const certifications = [
  {
    title: "Workshop Certificate – Brainic Academy",
    issuer: "Brainic Academy",
    year: "2024",
    description: "Completed a 3-day workshop covering resume building, LinkedIn profile optimization, and interview preparation.",
    skills: ["Resume Building", "LinkedIn Optimization", "Interview Prep"],
    file: { url: "/certificates/brainic_workshop.pdf", type: "pdf" as const },
    previewImage: "/certificates/brainic_workshop_img.png",
  },
  {
    title: "Getting Started with Artificial Intelligence",
    issuer: "IBM SkillsBuild",
    year: "2024",
    description: "Completed IBM's foundational course on Artificial Intelligence concepts, applications, and ethical considerations.",
    skills: ["AI Fundamentals", "Machine Learning Basics", "IBM Cloud"],
    file: { url: "/certificates/IBM_SkillsBuild_AI_Certificate.jpeg", type: "image" as const },
  },
  {
    title: "Say Yes to Life, No to Drugs Pledge",
    issuer: "Narcotics Control Bureau, Ministry of Home Affairs, Govt. of India",
    year: "2024",
    description: "Commitment to promoting a drug-free and healthy society, organized by the Narcotics Control Bureau under the Ministry of Home Affairs.",
    skills: ["Social Responsibility", "Health Awareness"],
    file: null,
  },
  {
    title: "Python Programming Internship Certificate",
    issuer: "Micro Information Technology Services, Haryana",
    year: "2024",
    description: "Completed Python programming internship with hands-on development experience and real-world project exposure.",
    skills: ["Python", "Programming", "Software Development"],
    file: { url: "/certificates/Micro_IT_certificate_1.pdf", type: "pdf" as const },
    previewImage: "/certificates/Micro_IT_certificate_img.png",
  },
  {
    title: "SQL Certificate",
    issuer: "NRI Institute of Technology",
    year: "2024",
    description: "Completed SQL coursework demonstrating proficiency in database querying and management.",
    skills: ["SQL", "Database Management", "Data Querying"],
    file: { url: "/certificates/SQL_Certificate.pdf", type: "pdf" as const },
  },
  {
    title: "SQL (Basic) – HackerRank",
    issuer: "HackerRank",
    year: "2025",
    description: "Passed the HackerRank SQL (Basic) skill certification test, demonstrating proficiency in SQL fundamentals.",
    skills: ["SQL", "Database Querying", "HackerRank"],
    file: { url: "/certificates/HackerRank_SQL_Certificate.png", type: "image" as const },
  },
];

const CertificationsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [viewerFile, setViewerFile] = useState<{ url: string; title: string; type: "pdf" | "image" } | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handlePreview = (e: React.MouseEvent, cert: typeof certifications[0]) => {
    e.stopPropagation();
    if (cert.file) {
      const previewUrl = (cert as any).previewImage || cert.file.url;
      const previewType = (cert as any).previewImage ? "image" as const : cert.file.type;
      setViewerFile({ url: previewUrl, title: cert.title, type: previewType });
    }
  };

  const handleDownload = (e: React.MouseEvent, cert: typeof certifications[0]) => {
    e.stopPropagation();
    if (cert.file) {
      const a = document.createElement("a");
      a.href = cert.file.url;
      a.download = cert.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      <section id="certifications" className="relative py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <ScrollReveal>
            <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Credentials</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display mb-5">
              Professional <span className="gradient-text">Certifications</span>
            </h2>
            <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-12 md:mb-16" />
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {certifications.map((cert, i) => (
              <ScrollReveal key={cert.title} delay={i * 0.1}>
                <motion.div
                  className="cinema-card rounded-2xl p-5 md:p-6 h-full group cursor-pointer glow-ring flex flex-col"
                  layout
                  onClick={() => toggleExpand(i)}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: expandedIndex === i ? 0 : -8, scale: expandedIndex === i ? 1 : 1.03 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/60 border border-border/50 flex items-center justify-center shrink-0">
                      {cert.file?.type === "pdf" ? (
                        <FileText className="w-5 h-5 text-blue-bright" />
                      ) : cert.file?.type === "image" ? (
                        <Image className="w-5 h-5 text-blue-bright" />
                      ) : (
                        <span className="text-lg font-display font-bold gradient-text">{cert.title.charAt(0)}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-blue-bright/70">{cert.year}</span>
                    <motion.span
                      className="text-xs text-muted-foreground ml-auto"
                      animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                    >
                      ↓
                    </motion.span>
                  </div>

                  <h3 className="text-sm font-display font-semibold text-foreground mb-2 group-hover:text-blue-bright transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">{cert.issuer}</p>

                  {/* Action Buttons */}
                  {cert.file && (
                    <div className="flex gap-2 mt-auto pt-3 border-t border-border/20">
                      <button
                        onClick={(e) => handlePreview(e, cert)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-primary/10 text-blue-bright hover:bg-blue-primary/20 border border-blue-primary/20 transition-all duration-200 hover:scale-105"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </button>
                      <button
                        onClick={(e) => handleDownload(e, cert)}
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
                        <div className="pt-4 mt-3 border-t border-border/30">
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {cert.description}
                          </p>
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Skills Covered</p>
                            <div className="flex flex-wrap gap-1">
                              {cert.skills.map((skill) => (
                                <span key={skill} className="text-xs px-2 py-1 rounded-full bg-secondary/60 text-muted-foreground border border-border/50">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
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

      <CertificateViewer
        isOpen={!!viewerFile}
        onClose={() => setViewerFile(null)}
        file={viewerFile}
      />
    </>
  );
};

export default CertificationsSection;
