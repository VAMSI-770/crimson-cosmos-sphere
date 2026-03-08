import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const projects = [
  {
    title: "AI Swarm Robotics for Space Debris Cleanup",
    description: "AI-powered swarm robotics system designed to track, capture, and recycle space debris for sustainable space operations.",
    tags: ["AI", "Robotics", "Space Engineering"],
    team: "The Space Savants — NRI Institute of Technology",
    fullDescription: "An innovative AI-powered swarm robotics system designed to address the growing threat of space debris to satellites and future missions. The system uses AI detection models, robotic capture arms and magnetic systems, on-orbit debris processing, and space-based 3D printing of satellite components from recycled debris.",
    challenges: "Designing AI models that can detect and classify fast-moving space debris in real-time with limited computing resources.",
    outcome: "Presented at MindSprint 2K25 National Hackathon and qualified in Smart India Hackathon.",
  },
  {
    title: "Space Debris Collection System",
    description: "End-to-end workflow for AI-driven debris detection, robotic capture, on-orbit processing, and 3D printing of satellite parts.",
    tags: ["AI", "Robotics", "3D Printing"],
    team: "The Space Savants",
    fullDescription: "A comprehensive system covering AI model development for debris detection, robotic capture design using nets, arms, and magnetic tools, an on-orbit processing unit for melting and refining debris, and a 3D printing mechanism for producing satellite components.",
    challenges: "Integrating multiple subsystems — detection, capture, processing, and manufacturing — into a unified autonomous workflow.",
    outcome: "Prototype developed through team collaboration and iterative testing.",
    link: "https://lnkd.in/g2f_6rBK",
  },
  {
    title: "Skin Diseases Detection using YOLO",
    description: "Computer vision model to detect human skin diseases in real-time using YOLOv8 with custom dataset preparation.",
    tags: ["Python", "YOLOv8", "Roboflow", "Computer Vision"],
    fullDescription: "Developed a computer vision model to detect human skin diseases using YOLOv8. Features include custom dataset preparation with annotated medical images, real-time object detection for skin conditions, and high accuracy predictions for early diagnosis support.",
    challenges: "Curating and annotating a diverse medical image dataset for reliable detection across skin types.",
    outcome: "Achieved high accuracy predictions suitable for early diagnosis assistance.",
  },
  {
    title: "Football Player Detection using YOLO",
    description: "Real-time detection system to identify football players on the field using YOLO object detection for sports analytics.",
    tags: ["Python", "YOLOv8", "Roboflow", "Sports Analytics"],
    fullDescription: "Built a real-time detection system to identify and track football players on the field using YOLO object detection. The system processes video feeds to detect player positions, movements, and formations for sports analytics applications.",
    challenges: "Handling occlusion, varying player sizes, and fast motion in live match footage.",
    outcome: "Successfully detects and tracks players in real-time video feeds.",
  },
];

const ProjectsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl overflow-hidden h-full group cursor-pointer glow-ring"
                layout
                onClick={() => toggleExpand(i)}
                whileHover={{ y: expandedIndex === i ? 0 : -8, scale: expandedIndex === i ? 1 : 1.01 }}
                transition={{ type: "spring", stiffness: 250 }}
              >
                <div className="relative h-36 sm:h-44 bg-gradient-to-br from-secondary via-muted to-secondary flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/[0.04] to-blue-bright/[0.02] group-hover:from-blue-primary/[0.1] group-hover:to-blue-bright/[0.06] transition-all duration-700" />
                  <motion.span
                    className="text-4xl sm:text-5xl font-display font-bold gradient-text relative z-10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {project.title.charAt(0)}
                  </motion.span>
                </div>

                <div className="p-5 md:p-7">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base md:text-lg font-display font-semibold text-foreground group-hover:text-blue-bright transition-colors duration-400 tracking-wide">
                      {project.title}
                    </h3>
                    <motion.span 
                      className="text-xs text-muted-foreground flex-shrink-0 ml-2"
                      animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                    >
                      ↓
                    </motion.span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-secondary/60 text-muted-foreground border border-border/50 font-medium">
                        {tag}
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
                          {"team" in project && project.team && (
                            <p className="text-xs text-blue-bright/70 mb-3 font-medium">Team: {project.team}</p>
                          )}
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            {project.fullDescription}
                          </p>
                          
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">Challenge</p>
                            <p className="text-sm text-muted-foreground">{project.challenges}</p>
                          </div>
                          
                          <div className="p-3 rounded-lg bg-blue-primary/5 border border-blue-primary/10">
                            <p className="text-xs font-semibold text-blue-bright mb-1">Outcome</p>
                            <p className="text-sm text-muted-foreground">{project.outcome}</p>
                          </div>

                          {"link" in project && project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-4 text-xs text-blue-bright hover:underline font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View on GitHub →
                            </a>
                          )}
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
