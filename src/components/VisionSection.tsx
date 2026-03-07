import ScrollReveal from "./ScrollReveal";

const VisionSection = () => {
  return (
    <section id="vision" className="relative py-36 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-crimson/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-violet/[0.05] blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10 text-center">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.25em] uppercase mb-6 font-medium">Scene V</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-10 leading-tight">
            The Future I Want{" "}
            <span className="gradient-text">to Build</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="text-lg md:text-xl text-secondary-foreground max-w-2xl mx-auto leading-relaxed">
            "I want to create intelligent systems that combine data, design, and engineering to solve real world problems."
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <div className="mt-14 flex flex-wrap justify-center gap-3 text-sm">
            {["AI Systems", "Intelligent Products", "Scalable Software", "Creative Technology"].map((item) => (
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
