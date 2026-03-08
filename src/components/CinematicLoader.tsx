import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CinematicLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 700);
    }, 2200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Cinema beams */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute w-[200px] h-[600px] bg-gradient-to-r from-transparent via-blueberry-glow/[0.04] to-transparent rotate-[15deg]"
              initial={{ x: "-200px" }}
              animate={{ x: "120vw" }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />
            <motion.div
              className="absolute w-[150px] h-[600px] bg-gradient-to-r from-transparent via-berry-pink/[0.03] to-transparent rotate-[-20deg]"
              initial={{ x: "120vw" }}
              animate={{ x: "-200px" }}
              transition={{ duration: 5, ease: "linear", repeat: Infinity, delay: 1 }}
            />
          </div>

          <motion.div
            className="absolute w-[350px] h-[350px] rounded-full bg-blueberry-glow/[0.08] blur-[100px]"
            initial={{ scale: 0 }}
            animate={{ scale: 1.3 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.div
            className="absolute w-[200px] h-[200px] rounded-full bg-berry-pink/[0.06] blur-[80px]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />

          <motion.div
            className="relative text-center z-10"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text tracking-tight">VB</h1>
            <motion.div
              className="w-12 h-[2px] mx-auto mt-4 rounded-full bg-gradient-to-r from-blueberry-glow to-berry-pink"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicLoader;
