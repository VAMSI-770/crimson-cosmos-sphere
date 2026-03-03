import { lazy, Suspense } from "react";
import { motion } from "framer-motion";

const FloatingCube = lazy(() => import("./FloatingCube"));

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-glow/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4 font-body">
              Data Science Engineer
            </p>
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-4">
              Vamsi{" "}
              <span className="glow-text">Bollepalli</span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary-foreground font-light mb-2 font-display">
              Future AI Architect
            </p>
            <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
              I build intelligence from data.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#about"
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-300 hover:shadow-[0_0_30px_hsla(0,100%,45%,0.3)] hover:scale-105"
              >
                Explore My World
              </a>
              <a
                href="#contact"
                className="px-8 py-3 rounded-lg border border-border text-foreground font-medium transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_hsla(0,100%,45%,0.1)]"
              >
                Contact Me
              </a>
            </div>
          </motion.div>

          {/* Right - 3D Cube */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block h-[400px]"
          >
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading...</div>}>
              <FloatingCube />
            </Suspense>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
