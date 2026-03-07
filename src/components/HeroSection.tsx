import { lazy, Suspense } from "react";
import { motion } from "framer-motion";

const FloatingOrb = lazy(() => import("./FloatingCube"));

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-crimson/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet/[0.04] blur-[100px] pointer-events-none" />

      {/* Cinematic light streaks */}
      <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-crimson/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-violet/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="w-2 h-2 rounded-full bg-crimson animate-glow-pulse" />
              <span className="text-xs text-muted-foreground font-medium tracking-wide">Available for opportunities</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display leading-[0.95] mb-6 tracking-tight">
              <span className="text-foreground">VAMSI</span>
              <br />
              <span className="gradient-text">BOLLEPALLI</span>
            </h1>

            <motion.p
              className="text-lg md:text-xl text-secondary-foreground font-display font-medium mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Future AI Engineer • Data Science Explorer
            </motion.p>

            <motion.p
              className="text-sm md:text-base text-muted-foreground max-w-md mb-10 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Building intelligent systems with data and code.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <a
                href="#projects"
                className="px-7 py-3 rounded-lg bg-gradient-to-r from-crimson to-violet text-primary-foreground font-medium text-sm transition-all duration-400 hover:shadow-[0_0_30px_hsla(1,95%,48%,0.3)] hover:scale-[1.03]"
              >
                Start the Journey
              </a>
              <a
                href="#contact"
                className="px-7 py-3 rounded-lg border border-border text-foreground font-medium text-sm transition-all duration-400 hover:border-crimson/40 hover:bg-secondary/50"
              >
                View My Work
              </a>
            </motion.div>
          </motion.div>

          {/* Right - 3D Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="hidden lg:block h-[420px]"
          >
            <Suspense fallback={<div className="w-full h-full" />}>
              <FloatingOrb />
            </Suspense>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
      >
        <div className="w-5 h-8 rounded-full border border-border flex justify-center pt-2">
          <div className="w-0.5 h-1.5 rounded-full bg-crimson" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
