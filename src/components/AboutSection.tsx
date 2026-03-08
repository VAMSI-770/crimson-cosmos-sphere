import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const metrics = [
  { value: "10+", label: "Projects Built", bg: "bg-blueberry/[0.06]" },
  { value: "15+", label: "Technologies", bg: "bg-strawberry/[0.06]" },
  { value: "AI/ML", label: "Current Focus", bg: "bg-lemon/[0.1]" },
  { value: "∞", label: "Curiosity", bg: "bg-mint" },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative py-28">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.25em] uppercase mb-3 font-semibold">The Story</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            About <span className="gradient-text">the Journey</span>
          </h2>
          <div className="w-20 h-1 rounded-full bg-gradient-to-r from-blueberry to-strawberry mb-14" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal delay={0.1}>
            <div className="space-y-5">
              <p className="text-secondary-foreground leading-relaxed text-base">
                A curious mind drawn to the intersection of data and intelligence. As a 3rd year B.Tech Data Science student, I don't just study algorithms — I see patterns in the world waiting to be decoded.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                Passionate about AI and machine learning, I'm building the foundation to create intelligent products that think, adapt, and evolve. Currently exploring full-stack development to bring ideas to life end-to-end.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                I believe technology can shape the future — and I'm building the skills to be part of that transformation.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  className={`dessert-card p-6 text-center ${m.bg}`}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-2xl font-bold font-display gradient-text mb-1">{m.value}</p>
                  <p className="text-xs text-muted-foreground tracking-wide uppercase font-medium">{m.label}</p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
