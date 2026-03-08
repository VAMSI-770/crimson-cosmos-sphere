import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CinematicLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 800);
      }, 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 200 + i * 60,
                  height: 200 + i * 60,
                  background: i % 2 === 0
                    ? "radial-gradient(circle, hsla(221, 83%, 53%, 0.06), transparent 70%)"
                    : "radial-gradient(circle, hsla(217, 91%, 60%, 0.04), transparent 70%)",
                  left: `${15 + i * 12}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                animate={{
                  x: [0, 30 * (i % 2 === 0 ? 1 : -1), 0],
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* Light rays */}
          <motion.div
            className="absolute w-[2px] h-[80vh] bg-gradient-to-b from-transparent via-blue-primary/20 to-transparent rotate-[15deg]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute w-[1px] h-[60vh] bg-gradient-to-b from-transparent via-blue-bright/15 to-transparent rotate-[-20deg]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />

          {/* Main blue glow backdrop */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full bg-blue-primary/[0.06] blur-[120px]"
            initial={{ scale: 0 }}
            animate={{ scale: phase >= 1 ? 1.5 : 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* Phase 1: VB Initials */}
          <AnimatePresence>
            {phase >= 0 && phase < 2 && (
              <motion.div
                className="relative z-10 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.3, filter: "blur(10px)" }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-7xl md:text-9xl font-display font-bold tracking-[0.3em] gradient-text">
                  VB
                </h1>
                <motion.div
                  className="w-20 h-[2px] mx-auto mt-6 rounded-full bg-gradient-to-r from-blue-primary to-blue-bright"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2: Full name reveal */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                className="relative z-10 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-[0.15em] text-foreground mb-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  BOLLEPALLI
                </motion.h1>
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-[0.15em] text-blue-bright"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                  VAMSI
                </motion.h1>
                <motion.div
                  className="w-32 h-[2px] mx-auto mt-6 rounded-full bg-gradient-to-r from-transparent via-blue-primary to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
                {phase >= 3 && (
                  <motion.p
                    className="text-text-soft text-sm tracking-[0.4em] uppercase mt-4 font-body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 1 }}
                  >
                    Full Stack Developer
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicLoader;
