import ScrollReveal from "./ScrollReveal";

const VisionSection = () => {
  return (
    <section id="vision" className="relative py-36 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blueberry/[0.06] blur-[120px] pointer-events-none animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-strawberry/[0.05] blur-[80px] pointer-events-none animate-blob" style={{ animationDelay: "4s" }} />

      <div className="container mx-auto px-6 lg:px-16 relative z-10 text-center">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.25em] uppercase mb-6 font-semibold">Sweet Ending</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-10 leading-tight">
            The Future I'm{" "}
            <span className="gradient-text">Building</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="text-lg md:text-xl text-secondary-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            "I want to create intelligent systems that combine data, design, and engineering to solve real world problems."
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <div className="mt-14 flex flex-wrap justify-center gap-3 text-sm">
            {["AI Systems", "Intelligent Products", "Scalable Software", "Creative Technology"].map((item) => (
              <span key={item} className="px-6 py-3 rounded-full bg-blueberry/[0.06] border border-blueberry/15 text-secondary-foreground font-medium text-xs tracking-wide hover:bg-blueberry/10 transition-colors duration-300 cursor-default">
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
