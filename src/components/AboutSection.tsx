import ScrollReveal from "./ScrollReveal";

const stats = [
  { value: "10+", label: "Creations" },
  { value: "15+", label: "Technologies" },
  { value: "5+", label: "Certifications" },
  { value: "∞", label: "Passion" },
];

const timelineItems = [
  { year: "2022", text: "The journey begins — entered the world of Data Science" },
  { year: "2023", text: "First ML models built — intelligence starts taking shape" },
  { year: "2024", text: "Full-stack exploration — building intelligent digital worlds" },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative py-36 bg-gradient-radial brush-texture">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="gold-text text-sm tracking-[0.3em] uppercase mb-3 font-body font-medium">Chapter I</p>
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-4">
            The Story Behind{" "}
            <span className="glow-text italic">The Code</span>
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-gold to-primary mb-16" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal delay={0.1}>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6 italic font-display">
              In a quiet room lit by the glow of a screen, a curious mind discovered the language of data — and everything changed.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              A 3rd year B.Tech Data Science student with an insatiable hunger for understanding how intelligence can be built — layer by layer, model by model. Inspired by cinema, art, and the hidden poetry inside algorithms.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mb-10">
              I don't just write code. <span className="text-ivory font-medium">I paint systems that think.</span>
            </p>

            {/* Timeline */}
            <div className="space-y-5 border-l border-gold/25 pl-7">
              {timelineItems.map((item, i) => (
                <ScrollReveal key={item.year} delay={0.2 + i * 0.1}>
                  <div className="relative">
                    <div className="absolute -left-[32px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_12px_hsla(43,74%,45%,0.5)]" />
                    <p className="gold-text text-xs tracking-[0.2em] uppercase font-body font-medium">{item.year}</p>
                    <p className="text-secondary-foreground text-sm mt-1">{item.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="gold-border-frame rounded-lg p-1">
              <div className="grid grid-cols-2 gap-4 p-4">
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
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
