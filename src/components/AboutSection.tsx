import ScrollReveal from "./ScrollReveal";

const stats = [
  { value: "10+", label: "Projects" },
  { value: "15+", label: "Technologies" },
  { value: "5+", label: "Certifications" },
  { value: "∞", label: "Curiosity" },
];

const timelineItems = [
  { year: "2022", text: "Began the B.Tech Data Science journey" },
  { year: "2023", text: "Built first ML models & data pipelines" },
  { year: "2024", text: "Exploring full-stack & AI architecture" },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative py-32 bg-gradient-radial">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Origin Story</p>
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-16">
            The <span className="glow-text">Beginning</span>
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal delay={0.1}>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6 italic">
              In the quiet hum of a classroom, a curious mind discovered the language of data — and everything changed.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              A 3rd year B.Tech Data Science student with an insatiable hunger for understanding how intelligence can be built, layer by layer, model by model. Inspired by cinema, storytelling, and the poetry hidden inside algorithms.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mb-8">
              I don't just write code. <span className="text-foreground font-medium">I build systems that think.</span>
            </p>

            {/* Timeline */}
            <div className="space-y-4 border-l border-primary/30 pl-6">
              {timelineItems.map((item, i) => (
                <ScrollReveal key={item.year} delay={0.2 + i * 0.1}>
                  <div className="relative">
                    <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsla(0,100%,45%,0.5)]" />
                    <p className="text-primary text-xs tracking-widest uppercase font-body">{item.year}</p>
                    <p className="text-secondary-foreground text-sm mt-1">{item.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
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
