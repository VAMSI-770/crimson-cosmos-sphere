import { motion } from "framer-motion";
import { forwardRef } from "react";

interface CinematicArrowProps {
  onDoubleClick: () => void;
  isHighlighted: boolean;
}

const CinematicArrow = forwardRef<HTMLDivElement, CinematicArrowProps>(
  ({ onDoubleClick, isHighlighted }, ref) => {
    return (
      <section 
        ref={ref}
        id="arrow-section" 
        className="relative py-32 md:py-48 overflow-hidden"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsla(221, 83%, 53%, 0.08) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-16 flex flex-col items-center justify-center">
          <motion.p
            className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-8 font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Discover More
          </motion.p>

          {/* Cinematic Arrow */}
          <motion.div
            className="relative cursor-pointer select-none"
            onDoubleClick={onDoubleClick}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            animate={isHighlighted ? {
              scale: [1, 1.1, 1],
              filter: ["drop-shadow(0 0 20px hsla(221, 83%, 53%, 0.3))", "drop-shadow(0 0 40px hsla(221, 83%, 53%, 0.6))", "drop-shadow(0 0 20px hsla(221, 83%, 53%, 0.3))"],
            } : {
              y: [0, -15, 0],
            }}
            transition={isHighlighted ? {
              duration: 1.5,
              repeat: 3,
              ease: "easeInOut",
            } : {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.1,
              filter: "drop-shadow(0 0 30px hsla(221, 83%, 53%, 0.5))",
            }}
          >
            {/* Arrow SVG */}
            <svg
              width="120"
              height="180"
              viewBox="0 0 120 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-36 md:w-32 md:h-48"
            >
              {/* Arrow gradient definitions */}
              <defs>
                <linearGradient id="arrowGradient" x1="60" y1="0" x2="60" y2="180" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="hsl(221, 83%, 53%)" />
                  <stop offset="50%" stopColor="hsl(217, 91%, 60%)" />
                  <stop offset="100%" stopColor="hsl(213, 94%, 68%)" />
                </linearGradient>
                <linearGradient id="arrowShine" x1="40" y1="0" x2="80" y2="180" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="white" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Main arrow body */}
              <motion.path
                d="M60 0 L60 140"
                stroke="url(#arrowGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              {/* Arrow head */}
              <motion.path
                d="M30 130 L60 170 L90 130"
                stroke="url(#arrowGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
              />

              {/* Shine overlay */}
              <path
                d="M57 10 L57 130 M45 130 L60 155"
                stroke="url(#arrowShine)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* Pulsing rings */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute rounded-full border border-blue-primary/20"
                  style={{
                    width: `${80 + ring * 40}px`,
                    height: `${120 + ring * 40}px`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    delay: ring * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          <motion.p
            className="text-muted-foreground/60 text-xs tracking-wider mt-8 font-display"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 2 }}
          >
            Double-tap to unlock secrets
          </motion.p>
        </div>
      </section>
    );
  }
);

CinematicArrow.displayName = "CinematicArrow";

export default CinematicArrow;
