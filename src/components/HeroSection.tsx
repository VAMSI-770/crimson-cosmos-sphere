import { lazy, Suspense } from "react";
import { motion } from "framer-motion";

const FloatingCube = lazy(() => import("./FloatingCube"));

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-glow/5 blur-[100px] pointer-events-none" />
      {/* Red light beams */}
      <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-primary/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-px h-2/3 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.p
              className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6 font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Data Scientist in the Making
            </motion.p>
            <h1 className="text-6xl md:text-8xl font-bold font-display leading-none mb-4 tracking-tight">
              VAMSI{" "}
              <span className="glow-text">BOLLEPALLI</span>
            </h1>
            <motion.p
              className="text-lg md:text-xl text-secondary-foreground font-light mb-2 font-display"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Architect of Intelligent Worlds
            </motion.p>
            <motion.p
              className="text-base text-muted-foreground max-w-md mb-10 leading-relaxed italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              "Every line of code is a scene in my story."
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <a
                href="#about"
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-300 hover:shadow-[0_0_40px_hsla(0,100%,45%,0.4)] hover:scale-105"
              >
                Enter My World
              </a>
              <a
                href="#projects"
                className="px-8 py-3 rounded-lg border border-border text-foreground font-medium transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_hsla(0,100%,45%,0.15)]"
              >
                Watch My Journey
              </a>
            </motion.div>
          </motion.div>

          {/* Right - 3D Cube */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="hidden lg:block h-[450px]"
          >
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground" />}>
              <FloatingCube />
            </Suspense>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        initial={{ opacity: 0 }}
      >
        <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
