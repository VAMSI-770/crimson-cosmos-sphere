import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

const certifications = [
  {
    title: "Machine Learning Specialization",
    issuer: "Stanford Online / Coursera",
    year: "2024",
    badge: "🏆",
  },
  {
    title: "Python for Data Science",
    issuer: "IBM",
    year: "2023",
    badge: "🐍",
  },
  {
    title: "Deep Learning Fundamentals",
    issuer: "DeepLearning.AI",
    year: "2024",
    badge: "🤖",
  },
  {
    title: "Full Stack Development",
    issuer: "Meta",
    year: "2024",
    badge: "💻",
  },
];

const CertificationsSection = () => {
  return (
    <section id="certifications" className="relative py-32">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Credentials</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">
            Professional <span className="gradient-text">Certifications</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-16" />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, i) => (
            <ScrollReveal key={cert.title} delay={i * 0.1}>
              <motion.div
                className="cinema-card rounded-2xl p-6 h-full group cursor-pointer glow-ring text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {cert.badge}
                </motion.div>
                <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-primary/20 to-blue-bright/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-bright" />
                </div>
                <h3 className="text-sm font-display font-semibold text-foreground mb-2 group-hover:text-blue-bright transition-colors">
                  {cert.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">{cert.issuer}</p>
                <span className="text-xs font-bold text-blue-bright/70">{cert.year}</span>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
