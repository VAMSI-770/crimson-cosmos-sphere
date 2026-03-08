import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const timeline = [
  {
    year: "2022",
    title: "Started B.Tech in Data Science",
    description: "Began the journey into data science — learning Python, statistics, and foundational machine learning.",
  },
  {
    year: "2023",
    title: "First ML Projects",
    description: "Built prediction models and data dashboards. Discovered the thrill of turning raw data into insights.",
  },
  {
    year: "2024",
    title: "Full Stack Exploration",
    description: "Expanded into frontend and backend development with React, Node.js, and modern web technologies.",
  },
  {
    year: "2025",
    title: "Building the Future",
    description: "Combining AI, data science, and full-stack skills to build intelligent, production-grade systems.",
  },
];

const ExperienceTimeline = () => {
  return (
    <section id="experience" className="relative py-32">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Experience</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">
            The <span className="gradient-text">Timeline</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-16" />
        </ScrollReveal>

        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px">
            <div className="w-full h-full bg-gradient-to-b from-blue-primary/30 via-blue-bright/20 to-blue-glow/10" />
          </div>

          {timeline.map((item, i) => (
            <ScrollReveal key={item.year} delay={i * 0.12}>
              <div className={`relative flex items-start gap-8 mb-14 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="absolute left-6 md:left-1/2 -translate-x-1.5 mt-2 z-10">
                  <div className="w-3 h-3 rounded-full bg-blue-bright border-4 border-background shadow-[0_0_12px_hsla(217,91%,60%,0.5)]" />
                </div>

                <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                  <motion.div
                    className="cinema-card rounded-2xl p-6 glow-ring"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-xs font-bold text-blue-bright tracking-[0.3em] uppercase font-display">{item.year}</span>
                    <h3 className="text-base font-display font-semibold text-foreground mt-2 mb-2">{item.title}</h3>
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
