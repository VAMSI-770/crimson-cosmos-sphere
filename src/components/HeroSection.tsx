import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-[10%] w-[400px] h-[400px] rounded-full bg-blueberry/[0.07] blur-[100px] animate-blob pointer-events-none" />
      <div className="absolute bottom-20 left-[5%] w-[350px] h-[350px] rounded-full bg-strawberry/[0.06] blur-[80px] animate-blob pointer-events-none" style={{ animationDelay: "4s" }} />
      <div className="absolute top-1/3 left-1/3 w-[250px] h-[250px] rounded-full bg-lemon/[0.08] blur-[70px] animate-blob pointer-events-none" style={{ animationDelay: "8s" }} />

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-border bg-card/60 backdrop-blur-sm mb-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blueberry animate-pulse" />
              <span className="text-xs text-secondary-foreground font-medium tracking-wide">Available for opportunities</span>
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-display leading-[0.95] mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <span className="text-foreground">Crafting</span>
            <br />
            <span className="gradient-text">Beautiful Digital</span>
            <br />
            <span className="text-foreground">Experiences</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-secondary-foreground font-display font-medium mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Data Science Student • Future AI Engineer • Creative Technologist
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-muted-foreground max-w-md mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Building intelligent systems with data, design, and a touch of magic.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <a href="#projects" className="frosting-btn">
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-3 rounded-full border-2 border-blueberry/20 text-foreground font-semibold text-sm transition-all duration-300 hover:border-blueberry/40 hover:bg-blueberry/5 hover:scale-[1.03]"
            >
              Contact Me
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
        whileInView={{ opacity: 0.6 }}
      >
        <div className="w-6 h-9 rounded-full border-2 border-blueberry/30 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-blueberry" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
