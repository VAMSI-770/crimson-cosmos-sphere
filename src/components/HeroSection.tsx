import { lazy, Suspense } from "react";
import { motion } from "framer-motion";

const FloatingCube = lazy(() => import("./FloatingCube"));

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden brush-texture">
      {/* Ambient light leaks */}
      <div className="light-leak absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 animate-light-drift" />
      <div className="light-leak absolute bottom-1/3 right-1/3 w-72 h-72 bg-gold/5 animate-light-drift" style={{ animationDelay: "3s" }} />
      <div className="light-leak absolute top-1/2 right-1/5 w-48 h-48 bg-glow/6 animate-light-drift" style={{ animationDelay: "5s" }} />

      {/* Red light beams */}
      <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-primary/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-px h-2/3 bg-gradient-to-b from-gold/10 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            <motion.p
              className="text-gold text-xs tracking-[0.4em] uppercase mb-8 font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.6, duration: 1.2 }}
            >
              A Digital Canvas Awakens
            </motion.p>
            <h1 className="text-6xl md:text-8xl font-bold font-display leading-[0.9] mb-6 tracking-tight">
              <span className="text-ivory">VAMSI</span>{" "}
              <span className="glow-text italic">BOLLEPALLI</span>
            </h1>
            <motion.p
              className="text-xl md:text-2xl text-secondary-foreground font-light mb-2 font-display italic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              Engineering Intelligence. Painting the Future.
            </motion.p>
            <motion.p
              className="text-base text-muted-foreground max-w-md mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.3, duration: 1 }}
            >
              "Code is my brush. Data is my canvas."
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              <a
                href="#about"
                className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium transition-all duration-500 hover:shadow-[0_0_40px_hsla(0,100%,40%,0.4),0_0_15px_hsla(43,74%,45%,0.2)] hover:scale-105"
              >
                Step Into My World
              </a>
              <a
                href="#projects"
                className="px-8 py-3.5 rounded-lg border border-gold/30 text-ivory font-medium transition-all duration-500 hover:border-gold/60 hover:shadow-[0_0_25px_hsla(43,74%,45%,0.15)]"
              >
                View My Creations
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
            <Suspense fallback={<div className="w-full h-full" />}>
              <FloatingCube />
            </Suspense>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        initial={{ opacity: 0 }}
      >
        <div className="w-5 h-9 rounded-full border border-gold/30 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-gold" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
