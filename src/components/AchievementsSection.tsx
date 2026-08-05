import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Download, FileText, Image } from "lucide-react";
import CertificateViewer from "./CertificateViewer";
import { useAchievements } from "@/hooks/usePortfolioData";
import { useBlockchainConfig, useRecordIndex } from "@/hooks/useBlockchain";
import VerificationBadge from "./blockchain/VerificationBadge";

const AchievementsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [viewerFile, setViewerFile] = useState<{ url: string; title: string; type: "pdf" | "image" } | null>(null);
  const { data: achievements = [] } = useAchievements();
  const { data: blockchainConfig = null } = useBlockchainConfig();
  const { index: recordIndex } = useRecordIndex();

  const toggleExpand = (index: number) => setExpandedIndex(expandedIndex === index ? null : index);

  const handlePreview = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (item.file_url) {
      const previewUrl = item.preview_image_url || item.file_url;
      const previewType = item.preview_image_url ? "image" as const : (item.file_type === "pdf" ? "pdf" as const : "image" as const);
      setViewerFile({ url: previewUrl, title: item.title, type: previewType });
    }
  };

  const handleDownload = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (item.file_url) {
      const a = document.createElement("a");
      a.href = item.file_url;
      a.download = item.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      <section id="achievements" className="relative py-24 md:py-32 bg-cinema-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <ScrollReveal>
            <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Milestones</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display mb-5">
              Key <span className="gradient-text">Achievements</span>
            </h2>
            <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-12 md:mb-16" />
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            {achievements.map((achievement: any, i: number) => (
              <ScrollReveal key={achievement.id} delay={i * 0.1}>
                <motion.div
                  className="cinema-card rounded-2xl p-5 md:p-7 h-full group cursor-pointer glow-ring flex flex-col"
                  layout
                  onClick={() => toggleExpand(i)}
                  whileHover={{ y: expandedIndex === i ? 0 : -8, scale: expandedIndex === i ? 1 : 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {achievement.file_url && (
                        <div className="w-8 h-8 rounded-lg bg-secondary/60 border border-border/50 flex items-center justify-center">
                          {achievement.file_type === "pdf" ? <FileText className="w-4 h-4 text-blue-bright" /> : <Image className="w-4 h-4 text-blue-bright" />}
                        </div>
                      )}
                      <span className="text-xs px-3 py-1.5 rounded-full bg-secondary/60 text-blue-bright border border-blue-primary/20 font-medium">{achievement.label}</span>
                    </div>
                    <motion.span className="text-xs text-muted-foreground" animate={{ rotate: expandedIndex === i ? 180 : 0 }}>↓</motion.span>
                  </div>

                  <h3 className="text-base md:text-lg font-display font-semibold text-foreground mb-2 group-hover:text-blue-bright transition-colors">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.team && <p className="text-xs text-blue-bright/70 mt-2">Team: {achievement.team}</p>}

                  <div className="mt-3">
                    <VerificationBadge
                      type="achievement"
                      entity={achievement}
                      record={recordIndex.get(`achievements:${achievement.id}`) ?? null}
                      config={blockchainConfig}
                      compact
                    />
                  </div>

                  {achievement.file_url && (
                    <div className="flex gap-2 mt-auto pt-3 border-t border-border/20">
                      <button onClick={(e) => handlePreview(e, achievement)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-primary/10 text-blue-bright hover:bg-blue-primary/20 border border-blue-primary/20 transition-all duration-200 hover:scale-105">
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                      <button onClick={(e) => handleDownload(e, achievement)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/50 transition-all duration-200 hover:scale-105">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  )}

                  <AnimatePresence>
                    {expandedIndex === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="overflow-hidden">
                        <div className="pt-4 mt-3 border-t border-border/30">
                          <p className="text-sm text-muted-foreground leading-relaxed">{achievement.details}</p>
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

export default AchievementsSection;
