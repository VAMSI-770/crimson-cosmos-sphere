import ScrollReveal from "./ScrollReveal";

const VisionSection = () => {
  return (
    <section id="vision" className="relative py-44 bg-gradient-vision overflow-hidden brush-texture">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/6 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-gold/4 blur-[120px] pointer-events-none animate-light-drift" />
      {/* Beams */}
      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-gold/12 via-transparent to-primary/8 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10 text-center">
        <ScrollReveal>
          <p className="gold-text text-sm tracking-[0.3em] uppercase mb-6 font-body font-medium">The Climax</p>
          <h2 className="text-5xl md:text-7xl font-bold font-display mb-10 leading-tight italic">
            This Is Only The{" "}
            <span className="glow-text">Beginning</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <div className="max-w-2xl mx-auto space-y-5">
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light italic font-display">
              "I don't just study data.
            </p>
            <p className="text-xl md:text-2xl text-secondary-foreground leading-relaxed font-medium font-display">
              I transform it into intelligence.
            </p>
            <p className="text-xl md:text-2xl text-ivory leading-relaxed font-bold font-display">
              I build systems that think."
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <div className="mt-16 flex flex-wrap justify-center gap-5 text-sm">
            {["AI Systems", "Intelligent Products", "Scalable Software", "Startup Mindset"].map((item) => (
              <span key={item} className="emblem px-7 py-3.5 font-medium text-secondary-foreground">
                {item}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default VisionSection;
