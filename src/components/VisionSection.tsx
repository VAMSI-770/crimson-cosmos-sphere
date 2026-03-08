import ScrollReveal from "./ScrollReveal";

const VisionSection = () => {
  return (
    <section id="vision" className="relative py-40 overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blueberry-glow/[0.05] blur-[150px] pointer-events-none animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-berry-pink/[0.04] blur-[100px] pointer-events-none animate-blob" style={{ animationDelay: "5s" }} />

      <div className="container mx-auto px-6 lg:px-16 relative z-10 text-center">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.3em] uppercase mb-8 font-semibold">Act V</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-12 leading-tight">
            The Future I'm{" "}
            <span className="gradient-text">Building</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="text-lg md:text-xl text-secondary-foreground max-w-2xl mx-auto leading-relaxed font-medium italic">
            "I want to create intelligent systems that combine data, design, and engineering to solve real world problems."
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {["AI Systems", "Intelligent Products", "Scalable Software", "Creative Technology"].map((item) => (
              <span key={item} className="px-6 py-3 rounded-full bg-blueberry-glow/[0.06] border border-blueberry-glow/15 text-secondary-foreground font-medium text-xs tracking-wider uppercase hover:bg-blueberry-glow/10 hover:border-blueberry-glow/25 hover:shadow-[0_0_20px_hsla(245,100%,71%,0.08)] transition-all duration-400 cursor-default">
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
