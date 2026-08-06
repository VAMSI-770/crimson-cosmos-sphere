import { motion } from "framer-motion";
import { useSiteContent } from "@/hooks/usePortfolioData";
import { toast } from "sonner";
import { useBlockchainConfig, useRecordIndex } from "@/hooks/useBlockchain";
import VerificationBadge from "./blockchain/VerificationBadge";
import CopyButton from "./blockchain/CopyButton";
import { shortHash, txUrl } from "@/lib/blockchain/networks";

const letterVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.3 + i * 0.05,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const AnimatedWord = ({ text, className, startIndex = 0 }: { text: string; className?: string; startIndex?: number }) => (
  <span className={className}>
    {text.split("").map((char, i) => (
      <motion.span
        key={i}
        custom={startIndex + i}
        variants={letterVariants}
        initial="hidden"
        animate="visible"
        className="inline-block"
        style={{ display: char === " " ? "inline" : "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </span>
);

const HeroSection = () => {
  const { data: content } = useSiteContent("hero");
  const { data: blockchainConfig = null } = useBlockchainConfig();
  const { index: recordIndex } = useRecordIndex();

  const nameFirst = content?.name_first || "BOLLEPALLI";
  const nameLast = content?.name_last || "VAMSI";
  const subtitle = content?.subtitle || "AI & Data Science Developer";
  const tagline = content?.tagline || "Building intelligent systems with AI, Computer Vision, and emerging technologies — from Hyderabad, India.";
  const badgeText = content?.badge_text || "Available for opportunities";
  const resumeUrl = content?.resume_url || "";

  const handleResumeDownload = async () => {
    if (!resumeUrl) {
      toast.error("Resume currently unavailable.");
      return;
    }
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Bollepalli_Vamsi_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab if fetch fails (e.g. CORS)
      window.open(resumeUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute top-1/4 left-[15%] w-[500px] h-[500px] rounded-full bg-blue-primary/[0.04] blur-[140px] animate-blob pointer-events-none" />
      <div className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] rounded-full bg-blue-bright/[0.03] blur-[120px] animate-blob pointer-events-none" style={{ animationDelay: "5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-primary/[0.02] blur-[160px] pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[30%] w-px h-full bg-gradient-to-b from-transparent via-blue-primary/[0.08] to-transparent" />
        <div className="absolute top-0 right-[25%] w-px h-full bg-gradient-to-b from-transparent via-blue-bright/[0.05] to-transparent" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-blue-glow/[0.04] to-transparent" />
      </div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-blue-primary/20 bg-secondary/40 backdrop-blur-sm mb-14">
              <span className="w-2 h-2 rounded-full bg-blue-bright animate-glow-pulse" />
              <span className="text-xs text-text-soft font-medium tracking-[0.3em] uppercase">{badgeText}</span>
            </div>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-[5.5rem] font-bold font-display leading-[1.1] mb-3 tracking-tight whitespace-nowrap">
            <AnimatedWord text={nameFirst} className="text-foreground tracking-[0.08em] md:tracking-[0.12em] mr-2 md:mr-5" startIndex={0} />
            <AnimatedWord text={nameLast} className="text-blue-bright tracking-[0.08em] md:tracking-[0.12em]" startIndex={10} />
          </h1>

          <motion.div
            className="h-[2px] max-w-[280px] md:max-w-md mx-auto mb-6 rounded-full overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div
              className="h-full w-full bg-gradient-to-r from-transparent via-blue-bright to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <motion.span
              className="text-blue-bright text-xs tracking-[0.5em] uppercase font-display font-medium"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              ✦
            </motion.span>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl text-text-soft font-display font-medium mb-4 tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto mb-14 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            {tagline}
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.7 }}
          >
            <a href="#projects" className="glow-btn">View Projects</a>
            <button
              type="button"
              onClick={handleResumeDownload}
              className="px-8 py-3.5 rounded-full border border-blue-bright/30 text-blue-bright font-display font-semibold text-sm tracking-wider uppercase transition-all duration-400 hover:border-blue-bright/60 hover:bg-blue-bright/5 hover:shadow-[0_0_25px_hsla(217,91%,60%,0.15)] flex items-center gap-2 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Resume
            </button>
            <a href="#contact" className="px-8 py-3.5 rounded-full border border-blue-primary/25 text-foreground font-display font-semibold text-sm tracking-wider uppercase transition-all duration-400 hover:border-blue-primary/50 hover:bg-blue-primary/5 hover:shadow-[0_0_25px_hsla(221,83%,53%,0.15)]">
              Contact Me
            </a>
          </motion.div>

          {resumeUrl && (
            <motion.div
              className="flex flex-col items-center gap-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3, duration: 0.7 }}
            >
              <VerificationBadge
                type="resume"
                entity={{ id: "resume", url: resumeUrl }}
                record={recordIndex.get("site_content:resume") ?? null}
                config={blockchainConfig}
              />
              {(() => {
                const resumeRecord = recordIndex.get("site_content:resume");
                if (!resumeRecord?.tx_hash) return null;
                return (
                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <span>Version v{resumeRecord.version}</span>
                    <span aria-hidden>·</span>
                    <span>
                      {new Date(resumeRecord.registered_at ?? resumeRecord.created_at).toLocaleDateString()}
                    </span>
                    <a
                      href={txUrl(resumeRecord.network, resumeRecord.tx_hash)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-blue-bright hover:underline normal-case tracking-normal font-mono"
                    >
                      {shortHash(resumeRecord.tx_hash)} ↗
                    </a>
                    <CopyButton value={resumeRecord.tx_hash} label="Copy Tx" />
                  </div>
                );
              })()}
            </motion.div>
          )}

        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.4 }}
      >
        <div className="w-5 h-8 rounded-full border border-blue-primary/30 flex justify-center pt-2">
          <div className="w-0.5 h-2 rounded-full bg-blue-bright" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
