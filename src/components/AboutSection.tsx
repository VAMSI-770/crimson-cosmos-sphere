import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const metrics = [
  { value: "4+", label: "Projects Built" },
  { value: "10+", label: "Technologies" },
  { value: "2+", label: "Hackathons" },
  { value: "∞", label: "Ambition" },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative py-32 bg-cinema-subtle">
      <div className="absolute top-0 right-[20%] w-[300px] h-[500px] bg-blue-primary/[0.02] blur-[100px] pointer-events-none rotate-12" />

      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">About Me</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">
            The <span className="gradient-text">Journey</span> of a Developer
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-16" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal delay={0.1}>
            <div className="space-y-6">
              <p className="text-secondary-foreground leading-relaxed text-base">
                I am a passionate Data Science student with strong interests in Artificial Intelligence, Computer Vision, and innovative technology solutions.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                I enjoy building intelligent systems that solve real-world problems, especially in areas like space technology, robotics, and AI-powered automation.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                Through hackathons, internships, and hands-on projects, I continuously explore new technologies and improve my problem-solving skills. My goal is to create impactful solutions using AI and emerging technologies.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m) => (
                <motion.div
                  key={m.label}
                  className="cinema-card p-7 text-center glow-ring rounded-2xl"
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-3xl font-bold font-display gradient-text mb-2">{m.value}</p>
                  <p className="text-xs text-muted-foreground tracking-widest uppercase font-medium">{m.label}</p>
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
