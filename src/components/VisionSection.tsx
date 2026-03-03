import ScrollReveal from "./ScrollReveal";

const VisionSection = () => {
  return (
    <section id="vision" className="relative py-40 bg-gradient-vision overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      {/* Red beams */}
      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-primary/15 via-transparent to-primary/10 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10 text-center">
        <ScrollReveal>
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-6 font-body">Climax</p>
          <h2 className="text-5xl md:text-7xl font-bold font-display mb-8 leading-tight">
            This Is Only The{" "}
            <span className="glow-text">Beginning</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light italic">
              "I am not just learning technology.
            </p>
            <p className="text-xl md:text-2xl text-secondary-foreground leading-relaxed font-medium">
              I am building intelligence.
            </p>
            <p className="text-xl md:text-2xl text-foreground leading-relaxed font-bold">
              I am building the future."
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <div className="mt-14 flex flex-wrap justify-center gap-6 text-sm text-secondary-foreground">
            {["AI Systems", "Intelligent Products", "Scalable Software", "Startup Mindset"].map((item) => (
              <span key={item} className="glass-card px-6 py-3 font-medium">
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
