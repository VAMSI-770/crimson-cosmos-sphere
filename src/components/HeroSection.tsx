import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Atmospheric lighting */}
      <div className="absolute top-1/4 left-[15%] w-[500px] h-[500px] rounded-full bg-blueberry-glow/[0.06] blur-[120px] animate-blob pointer-events-none" />
      <div className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] rounded-full bg-berry-pink/[0.05] blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: "5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-electric-violet/[0.03] blur-[140px] pointer-events-none" />

      {/* Cinema beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[30%] w-px h-full bg-gradient-to-b from-transparent via-blueberry-glow/[0.06] to-transparent" />
        <div className="absolute top-0 right-[25%] w-px h-full bg-gradient-to-b from-transparent via-berry-pink/[0.04] to-transparent" />
      </div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-border bg-secondary/40 backdrop-blur-sm mb-12">
              <span className="w-2 h-2 rounded-full bg-blueberry-glow animate-glow-pulse" />
              <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">Available for opportunities</span>
            </div>
          </motion.div>

          {/* Headline with cinematic reveal */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold font-display leading-[0.95] mb-8 tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="text-foreground tracking-[0.15em] uppercase text-3xl md:text-5xl lg:text-6xl font-medium">Bollepalli</span>
            <br />
            <span className="gradient-text tracking-[0.2em] uppercase">Vamsi</span>
            <br />
            <span className="text-secondary-foreground text-lg md:text-2xl lg:text-3xl font-light tracking-[0.25em] uppercase mt-2 inline-block">Portfolio</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-secondary-foreground font-display font-medium mb-4 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            A developer who designs immersive digital worlds.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto mb-14 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Data Science Student · Future AI Engineer · Creative Technologist
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
          >
            <a href="#projects" className="glow-btn">
              View Projects
            </a>
            <a
              href="#about"
              className="px-8 py-3.5 rounded-full border border-blueberry-glow/20 text-foreground font-semibold text-sm transition-all duration-400 hover:border-blueberry-glow/40 hover:bg-blueberry-glow/5 hover:shadow-[0_0_25px_hsla(245,100%,71%,0.1)]"
            >
              Explore Portfolio
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.4 }}
      >
        <div className="w-5 h-8 rounded-full border border-blueberry-glow/30 flex justify-center pt-2">
          <div className="w-0.5 h-2 rounded-full bg-blueberry-glow" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
