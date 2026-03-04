import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CinematicLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => setPhase(3), 3500);
    const t4 = setTimeout(() => onComplete(), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Red glow */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-primary/8 blur-[150px]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />
          {/* Gold accent glow */}
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full bg-gold/5 blur-[120px]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 0.6 : 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Name reveal */}
          <div className="relative text-center z-10">
            <motion.p
              className="text-gold text-xs tracking-[0.6em] uppercase mb-5 font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 0.7 : 0 }}
              transition={{ duration: 1.2 }}
            >
              The Canvas Awakens
            </motion.p>
            <motion.h1
              className="text-5xl md:text-7xl font-display font-bold glow-text italic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              VAMSI
            </motion.h1>
            <motion.div
              className="mt-8 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 1.4 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicLoader;
