import ScrollReveal from "./ScrollReveal";

const stats = [
  { value: "10+", label: "Projects" },
  { value: "15+", label: "Technologies" },
  { value: "5+", label: "Certifications" },
  { value: "∞", label: "Curiosity" },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative py-32 bg-gradient-radial">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">About</p>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-16">
            Welcome to <span className="glow-text">My World</span>
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal delay={0.1}>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              I'm a 3rd year B.Tech Data Science student with an insatiable curiosity for how data shapes our world. My journey began with a simple question: <em className="text-foreground">"What if machines could truly understand?"</em>
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              From building machine learning models to crafting data visualizations that tell stories, I'm constantly pushing myself to learn more — whether it's AI architectures, full-stack development, or the art of turning raw data into actionable intelligence.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              I don't just write code. I build systems that think.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card p-6 text-center group cursor-default"
                >
                  <p className="text-3xl font-bold font-display glow-text mb-1 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
