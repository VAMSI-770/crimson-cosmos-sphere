import { useRef, useEffect, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, useInView, AnimatePresence } from "framer-motion";

const achievements = [
  {
    value: 5,
    suffix: "+",
    label: "Hackathons",
    description: "Participated & Won",
    details: "Competed in national and international hackathons including HackMIT, TreeHacks, and local university competitions. Won 2 first-place awards and 3 special category prizes.",
  },
  {
    value: 15,
    suffix: "+",
    label: "Projects Built",
    description: "End-to-end solutions",
    details: "Developed full-stack applications, ML models, and data pipelines. Projects range from personal tools to production-grade systems serving real users.",
  },
  {
    value: 10,
    suffix: "+",
    label: "Technologies",
    description: "Mastered & Applied",
    details: "Proficient in Python, JavaScript/TypeScript, React, Node.js, TensorFlow, and various cloud platforms. Continuously expanding skill set with emerging technologies.",
  },
  {
    value: 500,
    suffix: "+",
    label: "GitHub Stars",
    description: "Community Recognition",
    details: "Open-source contributions recognized by the developer community. Repositories featured in GitHub trending and referenced in technical articles.",
  },
];

const CountUp = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {achievements.map((achievement, i) => (
            <ScrollReveal key={achievement.label} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl p-4 md:p-6 text-center group cursor-pointer glow-ring"
                layout
                onClick={() => toggleExpand(i)}
                whileHover={{ y: expandedIndex === i ? 0 : -8, scale: expandedIndex === i ? 1 : 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold gradient-text mb-2">
                  <CountUp target={achievement.value} suffix={achievement.suffix} />
                </div>
                <h3 className="text-xs sm:text-sm font-display font-semibold text-foreground mb-1 group-hover:text-blue-bright transition-colors">
                  {achievement.label}
                </h3>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                
                <motion.span 
                  className="inline-block text-xs text-muted-foreground mt-2"
                  animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                >
                  ↓
                </motion.span>

                <AnimatePresence>
                  {expandedIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-border/30 text-left">
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
