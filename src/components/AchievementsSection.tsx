import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const achievements = [
  {
    title: "MindSprint 2K25 National Hackathon",
    label: "Hackathon",
    description: "National-level hackathon participation",
    details: "Competed as Team 'The Space Savants' with members Bollepalli Vamsi, Iragala Susmitha, and Bora Pavan from NRI Institute of Technology. Mission: Develop intelligent solutions for sustainable space technology.",
    team: "The Space Savants",
  },
  {
    title: "Smart India Hackathon",
    label: "Hackathon",
    description: "Qualified for Level 2",
    details: "Top team at college level, qualified for Level 2 of the Smart India Hackathon. Built the AI Swarm Robotics Space Debris Cleanup project. Applied AI and robotics knowledge, improved teamwork and problem solving, and worked on real-world space challenges.",
    team: "Space Savants",
  },
];

const AchievementsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
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
          {achievements.map((achievement, i) => (
            <ScrollReveal key={achievement.title} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl p-5 md:p-7 h-full group cursor-pointer glow-ring"
                layout
                onClick={() => toggleExpand(i)}
                whileHover={{ y: expandedIndex === i ? 0 : -8, scale: expandedIndex === i ? 1 : 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-3 py-1.5 rounded-full bg-secondary/60 text-blue-bright border border-blue-primary/20 font-medium">
                    {achievement.label}
                  </span>
                  <motion.span
                    className="text-xs text-muted-foreground"
                    animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                  >
                    ↓
                  </motion.span>
                </div>

                <h3 className="text-base md:text-lg font-display font-semibold text-foreground mb-2 group-hover:text-blue-bright transition-colors">
                  {achievement.title}
                </h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                <p className="text-xs text-blue-bright/70 mt-2">Team: {achievement.team}</p>

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
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {achievement.details}
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

export default AchievementsSection;
