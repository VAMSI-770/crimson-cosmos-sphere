import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";
import { Lightbulb, Sparkles } from "lucide-react";

const ideas = [
  {
    title: "AI Study Companion",
    description: "An intelligent tutoring system that adapts to individual learning styles using ML.",
    category: "EdTech",
  },
  {
    title: "Carbon Footprint Tracker",
    description: "App that uses data science to help users reduce their environmental impact.",
    category: "Sustainability",
  },
  {
    title: "Smart Health Monitor",
    description: "Predictive analytics for personal health using wearable data integration.",
    category: "HealthTech",
  },
  {
    title: "Code Mentor Bot",
    description: "AI-powered code review assistant that helps developers write better code.",
    category: "DevTools",
  },
];

const floatingAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const IdeasSection = () => {
  return (
    <section id="ideas" className="relative py-32">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Innovation</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">
            Creative <span className="gradient-text">Ideas</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-16" />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {ideas.map((idea, i) => (
            <ScrollReveal key={idea.title} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl p-7 h-full group cursor-pointer relative overflow-hidden"
                animate={floatingAnimation}
                style={{ animationDelay: `${i * 0.5}s` }}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Gradient glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/0 via-transparent to-blue-bright/0 group-hover:from-blue-primary/10 group-hover:to-blue-bright/5 transition-all duration-700" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-primary/20 to-blue-bright/10 flex items-center justify-center"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <Lightbulb className="w-6 h-6 text-blue-bright" />
                    </motion.div>
                    <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-secondary/60 text-blue-bright border border-blue-primary/20">
                      <Sparkles size={12} />
                      {idea.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2 group-hover:text-blue-bright transition-colors">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {idea.description}
                  </p>
                </div>

                {/* Hover glow ring */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: "inset 0 0 30px hsla(217, 91%, 60%, 0.1), 0 0 40px hsla(221, 83%, 53%, 0.1)"
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

export default IdeasSection;
