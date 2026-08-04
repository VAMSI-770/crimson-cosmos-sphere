import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Download, FileText, Image } from "lucide-react";
import CertificateViewer from "./CertificateViewer";
import { useCertifications } from "@/hooks/usePortfolioData";
import { useBlockchainConfig, useRecordIndex } from "@/hooks/useBlockchain";
import VerificationBadge from "./blockchain/VerificationBadge";

const CertificationsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [viewerFile, setViewerFile] = useState<{ url: string; title: string; type: "pdf" | "image" } | null>(null);
  const { data: certifications = [] } = useCertifications();
  const { data: blockchainConfig = null } = useBlockchainConfig();
  const { index: recordIndex } = useRecordIndex();

  const toggleExpand = (index: number) => setExpandedIndex(expandedIndex === index ? null : index);

  const handlePreview = (e: React.MouseEvent, cert: any) => {
    e.stopPropagation();
    if (cert.file_url) {
      const previewUrl = cert.preview_image_url || cert.file_url;
      const previewType = cert.preview_image_url ? "image" as const : (cert.file_type === "pdf" ? "pdf" as const : "image" as const);
      setViewerFile({ url: previewUrl, title: cert.title, type: previewType });
    }
  };

  const handleDownload = (e: React.MouseEvent, cert: any) => {
    e.stopPropagation();
    if (cert.file_url) {
      const a = document.createElement("a");
      a.href = cert.file_url;
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
            {certifications.map((cert: any, i: number) => (
              <ScrollReveal key={cert.id} delay={i * 0.1}>
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
                      {cert.file_type === "pdf" ? <FileText className="w-5 h-5 text-blue-bright" /> : cert.file_type === "image" ? <Image className="w-5 h-5 text-blue-bright" /> : <span className="text-lg font-display font-bold gradient-text">{cert.title.charAt(0)}</span>}
                    </div>
                    <span className="text-xs font-bold text-blue-bright/70">{cert.year}</span>
                    <motion.span className="text-xs text-muted-foreground ml-auto" animate={{ rotate: expandedIndex === i ? 180 : 0 }}>↓</motion.span>
                  </div>

                  <h3 className="text-sm font-display font-semibold text-foreground mb-2 group-hover:text-blue-bright transition-colors">{cert.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{cert.issuer}</p>

                  <div className="mb-4">
                    <VerificationBadge
                      type="certificate"
                      entity={cert}
                      record={recordIndex.get(`certifications:${cert.id}`) ?? null}
                      config={blockchainConfig}
                      compact
                    />
                  </div>


                  {cert.file_url && (
                    <div className="flex gap-2 mt-auto pt-3 border-t border-border/20">
                      <button onClick={(e) => handlePreview(e, cert)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-primary/10 text-blue-bright hover:bg-blue-primary/20 border border-blue-primary/20 transition-all duration-200 hover:scale-105">
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                      <button onClick={(e) => handleDownload(e, cert)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/50 transition-all duration-200 hover:scale-105">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  )}

                  <AnimatePresence>
                    {expandedIndex === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="overflow-hidden">
                        <div className="pt-4 mt-3 border-t border-border/30">
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{cert.description}</p>
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Skills Covered</p>
                            <div className="flex flex-wrap gap-1">
                              {(cert.skills || []).map((skill: string) => (
                                <span key={skill} className="text-xs px-2 py-1 rounded-full bg-secondary/60 text-muted-foreground border border-border/50">{skill}</span>
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

      <CertificateViewer isOpen={!!viewerFile} onClose={() => setViewerFile(null)} file={viewerFile} />
    </>
  );
};

export default CertificationsSection;
