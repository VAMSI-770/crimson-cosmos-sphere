import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";
import { Target, Zap, Globe, Heart } from "lucide-react";

const goals = [
  {
    icon: Target,
    title: "Build Impactful Products",
    description: "Create solutions that solve real-world problems and make a positive difference in people's lives.",
  },
  {
    icon: Zap,
    title: "Master Advanced Technologies",
    description: "Continuously learn and master cutting-edge AI, ML, and full-stack technologies.",
  },
  {
    icon: Globe,
    title: "Contribute to Open Source",
    description: "Give back to the developer community through meaningful open-source contributions.",
  },
  {
    icon: Heart,
    title: "Inspire Future Developers",
    description: "Share knowledge and mentor aspiring developers on their journey.",
  },
];

const GoalsSection = () => {
  return (
    <section id="goals" className="relative py-32">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Vision</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">
            Future <span className="gradient-text">Goals</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-16" />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {goals.map((goal, i) => (
            <ScrollReveal key={goal.title} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl p-7 h-full group cursor-pointer glow-ring"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -6 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-blue-primary/20 to-blue-bright/10 flex items-center justify-center"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <goal.icon className="w-6 h-6 text-blue-bright" />
                  </motion.div>
                  <div>
                    <h3 className="text-base font-display font-semibold text-foreground mb-2 group-hover:text-blue-bright transition-colors">
                      {goal.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {goal.description}
                    </p>
                  </div>
                </div>

                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: "0 0 50px hsla(221, 83%, 53%, 0.08)"
                  }}
                />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;
