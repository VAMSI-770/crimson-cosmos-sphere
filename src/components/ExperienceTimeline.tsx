import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const timeline = [
  {
    year: "2022",
    title: "Started B.Tech in Data Science",
    description: "Began the journey into data science, learning Python, statistics, and foundational machine learning concepts.",
    emoji: "🎓",
  },
  {
    year: "2023",
    title: "First ML Projects",
    description: "Built prediction models and data dashboards. Discovered the thrill of turning raw data into meaningful insights.",
    emoji: "🫐",
  },
  {
    year: "2024",
    title: "Full Stack Exploration",
    description: "Expanded into frontend and backend development with React, Node.js, and modern web technologies.",
    emoji: "🚀",
  },
  {
    year: "2025",
    title: "Building the Future",
    description: "Combining AI, data science, and full-stack skills to build intelligent, production-grade systems.",
    emoji: "✨",
  },
];

const ExperienceTimeline = () => {
  return (
    <section id="experience" className="relative py-28">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.25em] uppercase mb-3 font-semibold">The Script</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Experience <span className="gradient-text">Timeline</span>
          </h2>
          <div className="w-20 h-1 rounded-full bg-gradient-to-r from-blueberry to-strawberry mb-14" />
        </ScrollReveal>

        <div className="relative max-w-2xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blueberry/20 via-strawberry/20 to-blueberry/20 md:-translate-x-px" />

          {timeline.map((item, i) => (
            <ScrollReveal key={item.year} delay={i * 0.12}>
              <div className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-blueberry border-4 border-background -translate-x-1.5 mt-2 z-10" />

                {/* Content */}
                <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                  <motion.div
                    className="dessert-card rounded-2xl p-6 bg-gradient-to-br from-blueberry/[0.04] to-strawberry/[0.04]"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-2xl mb-3">{item.emoji}</div>
                    <span className="text-xs font-semibold text-blueberry tracking-wider uppercase">{item.year}</span>
                    <h3 className="text-base font-display font-semibold text-foreground mt-1 mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </motion.div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
