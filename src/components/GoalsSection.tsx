import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { useGoals } from "@/hooks/usePortfolioData";

const GoalsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { data: goals = [] } = useGoals();

  const toggleExpand = (index: number) => setExpandedIndex(expandedIndex === index ? null : index);

  return (
    <section id="goals" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Vision</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display mb-5">
            Future <span className="gradient-text">Goals</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-12 md:mb-16" />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {goals.map((goal: any, i: number) => (
            <ScrollReveal key={goal.id} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl p-5 md:p-7 h-full group cursor-pointer glow-ring"
                layout
                onClick={() => toggleExpand(i)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: expandedIndex === i ? 0 : -6 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl md:text-3xl font-display font-bold gradient-text">{goal.title.charAt(0)}</span>
                  <motion.span className="text-xs text-muted-foreground" animate={{ rotate: expandedIndex === i ? 180 : 0 }}>↓</motion.span>
                </div>
                <h3 className="text-base md:text-lg font-display font-semibold text-foreground mb-2 group-hover:text-blue-bright transition-colors">{goal.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{goal.description}</p>

                <AnimatePresence>
                  {expandedIndex === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="overflow-hidden">
                      <div className="pt-5 mt-5 border-t border-border/30">
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{goal.full_description}</p>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Timeline:</span>
                          <span className="text-xs px-3 py-1 rounded-full bg-blue-primary/10 text-blue-bright border border-blue-primary/20">{goal.timeline}</span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Key Milestones</p>
                          <ul className="space-y-1">
                            {(goal.milestones || []).map((milestone: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground">• {milestone}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "0 0 50px hsla(221, 83%, 53%, 0.08)" }} />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;
