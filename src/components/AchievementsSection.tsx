import { useRef, useEffect, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, useInView } from "framer-motion";
import { Trophy, Code, Rocket, Users } from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    value: 5,
    suffix: "+",
    label: "Hackathons",
    description: "Participated & Won",
  },
  {
    icon: Code,
    value: 15,
    suffix: "+",
    label: "Projects Built",
    description: "End-to-end solutions",
  },
  {
    icon: Rocket,
    value: 10,
    suffix: "+",
    label: "Technologies",
    description: "Mastered & Applied",
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "GitHub Stars",
    description: "Community Recognition",
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
  return (
    <section id="achievements" className="relative py-32 bg-cinema-subtle">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Milestones</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">
            Key <span className="gradient-text">Achievements</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-16" />
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, i) => (
            <ScrollReveal key={achievement.label} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl p-6 text-center group cursor-pointer glow-ring"
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-primary/20 to-blue-bright/10 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <achievement.icon className="w-7 h-7 text-blue-bright" />
                </motion.div>
                <div className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2">
                  <CountUp target={achievement.value} suffix={achievement.suffix} />
                </div>
                <h3 className="text-sm font-display font-semibold text-foreground mb-1 group-hover:text-blue-bright transition-colors">
                  {achievement.label}
                </h3>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
