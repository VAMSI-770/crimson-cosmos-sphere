import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CinematicLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 600);
    }, 2000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-cream flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Floating blobs */}
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full bg-blueberry/10 blur-[80px]"
            initial={{ scale: 0, x: -100 }}
            animate={{ scale: 1.2, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.div
            className="absolute w-[200px] h-[200px] rounded-full bg-strawberry/10 blur-[60px]"
            initial={{ scale: 0, x: 100, y: 50 }}
            animate={{ scale: 1, x: 50, y: -20 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />

          <motion.div
            className="relative text-center z-10"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text">VB</h1>
            <motion.p
              className="text-sm text-muted-foreground mt-3 font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Loading something sweet...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicLoader;
