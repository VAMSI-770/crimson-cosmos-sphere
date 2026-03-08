import { useState, useRef, useCallback } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects } from "@/hooks/usePortfolioData";

const fallbackProjects = [
  { id: "1", title: "AI Swarm Robotics for Space Debris Cleanup", description: "AI-powered swarm robotics system.", full_description: "", tags: ["AI", "Robotics"], team: "The Space Savants", challenges: "", outcome: "", github_link: null, video_url: null },
];

const ProjectsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bufferingIndex, setBufferingIndex] = useState<number | null>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const { data: dbProjects } = useProjects();
  const projects = dbProjects && dbProjects.length > 0 ? dbProjects : fallbackProjects;

  const toggleExpand = (index: number) => setExpandedIndex(expandedIndex === index ? null : index);

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
    setBufferingIndex(index);
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    setHoveredIndex(null);
    setBufferingIndex(null);
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  return (
    <section id="projects" className="relative py-24 md:py-32 bg-cinema-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Portfolio</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display mb-5">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-12 md:mb-16" />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {projects.map((project: any, i: number) => (
            <ScrollReveal key={project.id} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl overflow-hidden h-full group cursor-pointer glow-ring"
                layout
                onClick={() => toggleExpand(i)}
                onMouseEnter={() => project.video_url && handleMouseEnter(i)}
                onMouseLeave={() => project.video_url && handleMouseLeave(i)}
                whileHover={{ y: expandedIndex === i ? 0 : -8, scale: expandedIndex === i ? 1 : 1.01 }}
                transition={{ type: "spring", stiffness: 250 }}
              >
                <div className="relative h-36 sm:h-44 bg-gradient-to-br from-secondary via-muted to-secondary flex items-center justify-center overflow-hidden">
                  {/* Hover video preview - muted autoplay */}
                  {project.video_url && (
                    <video
                      ref={(el) => { videoRefs.current[i] = el; }}
                      src={project.video_url}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-10 ${
                        hoveredIndex === i ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  )}
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/[0.04] to-blue-bright/[0.02] group-hover:from-blue-primary/[0.1] group-hover:to-blue-bright/[0.06] transition-all duration-700" />
                      <motion.span className="text-4xl sm:text-5xl font-display font-bold gradient-text relative z-10" whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                        {project.title.charAt(0)}
                      </motion.span>
                    </>
                  )}
                  {/* Play icon indicator for videos */}
                  {project.video_url && hoveredIndex !== i && (
                    <div className="absolute bottom-2 right-2 z-20 bg-background/70 backdrop-blur-sm rounded-full p-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-bright">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-5 md:p-7">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base md:text-lg font-display font-semibold text-foreground group-hover:text-blue-bright transition-colors duration-400 tracking-wide">{project.title}</h3>
                    <motion.span className="text-xs text-muted-foreground flex-shrink-0 ml-2" animate={{ rotate: expandedIndex === i ? 180 : 0 }}>↓</motion.span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(project.tags || []).map((tag: string) => (
                      <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-secondary/60 text-muted-foreground border border-border/50 font-medium">{tag}</span>
                    ))}
                  </div>

                  <AnimatePresence>
                    {expandedIndex === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="overflow-hidden">
                        <div className="pt-5 mt-5 border-t border-border/30">
                          {project.team && <p className="text-xs text-blue-bright/70 mb-3 font-medium">Team: {project.team}</p>}
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.full_description}</p>
                          {project.challenges && (
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">Challenge</p>
                              <p className="text-sm text-muted-foreground">{project.challenges}</p>
                            </div>
                          )}
                          {project.outcome && (
                            <div className="p-3 rounded-lg bg-blue-primary/5 border border-blue-primary/10">
                              <p className="text-xs font-semibold text-blue-bright mb-1">Outcome</p>
                              <p className="text-sm text-muted-foreground">{project.outcome}</p>
                            </div>
                          )}
                          {project.video_url && (
                            <div className="mt-4 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
                              <video
                                src={project.video_url}
                                controls
                                preload="metadata"
                                className="w-full rounded-lg"
                                style={{ maxHeight: "360px" }}
                              />
                            </div>
                          )}
                          <div className="flex gap-4 mt-4">
                            {project.github_link && (
                              <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-bright hover:underline font-medium" onClick={(e) => e.stopPropagation()}>
                                View on GitHub →
                              </a>
                            )}
                            {project.demo_link && (
                              <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-bright hover:underline font-medium" onClick={(e) => e.stopPropagation()}>
                                Live Demo →
                              </a>
                            )}
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

export default ProjectsSection;
