import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const internships = [
  {
    company: "Tech Startup XYZ",
    role: "Data Science Intern",
    duration: "Summer 2024",
    description: "Built predictive models and automated data pipelines for business analytics.",
  },
  {
    company: "Innovation Labs",
    role: "ML Research Intern",
    duration: "Winter 2024",
    description: "Researched NLP techniques and implemented text classification systems.",
  },
  {
    company: "Digital Solutions Inc",
    role: "Full Stack Intern",
    duration: "Spring 2025",
    description: "Developed React applications and integrated RESTful APIs.",
  },
];

const InternshipsSection = () => {
  return (
    <section id="internships" className="relative py-32 bg-cinema-subtle">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Experience</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">
            Professional <span className="gradient-text">Internships</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-16" />
        </ScrollReveal>

        <div className="relative max-w-3xl mx-auto">
          {/* Glowing timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px">
            <motion.div
              className="w-full h-full bg-gradient-to-b from-blue-primary via-blue-bright to-blue-glow"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
            />
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-blue-primary via-blue-bright to-blue-glow blur-sm opacity-50" />
          </div>

          {internships.map((item, i) => (
            <motion.div
              key={item.company}
              className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              {/* Timeline dot */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1.5 mt-6 z-10">
                <motion.div
                  className="w-4 h-4 rounded-full bg-blue-bright border-4 border-background"
                  whileHover={{ scale: 1.3 }}
                  style={{ boxShadow: "0 0 20px hsla(217, 91%, 60%, 0.6)" }}
                />
              </div>

              <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                <motion.div
                  className="cinema-card rounded-2xl p-6 glow-ring group"
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`flex items-center gap-3 mb-3 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-primary/30 to-blue-bright/20 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-blue-bright" />
                    </div>
                    <span className="text-xs font-bold text-blue-bright tracking-wider uppercase">{item.duration}</span>
                  </div>
                  <h3 className="text-base font-display font-semibold text-foreground mb-1 group-hover:text-blue-bright transition-colors">
                    {item.role}
                  </h3>
                  <p className="text-sm text-blue-bright/70 mb-2">{item.company}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InternshipsSection;
