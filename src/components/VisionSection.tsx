import ScrollReveal from "./ScrollReveal";

const VisionSection = () => {
  return (
    <section id="vision" className="relative py-36 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet/[0.05] blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10 text-center">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.25em] uppercase mb-6 font-medium">Vision</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-10 leading-tight">
            Building Beyond{" "}
            <span className="gradient-text">Today</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="text-lg md:text-xl text-secondary-foreground max-w-2xl mx-auto leading-relaxed">
            I'm focused on building intelligent systems that combine data, design, and engineering — creating technology that thinks, adapts, and scales.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <div className="mt-14 flex flex-wrap justify-center gap-3 text-sm">
            {["AI Systems", "Intelligent Products", "Scalable Software", "Startup Mindset"].map((item) => (
              <span key={item} className="px-5 py-2.5 rounded-lg bg-secondary border border-border text-secondary-foreground font-medium text-xs tracking-wide">
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
