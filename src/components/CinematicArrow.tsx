import { motion, useInView } from "framer-motion";
import { forwardRef, useRef, useState, useEffect } from "react";

interface CinematicArrowProps {
  onDoubleClick: () => void;
  isHighlighted: boolean;
  isUnlocked: boolean;
}

const CinematicArrow = forwardRef<HTMLDivElement, CinematicArrowProps>(
  ({ onDoubleClick, isHighlighted }, ref) => {
    const localRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(localRef, { once: true, margin: "-100px" });
    const [isClicked, setIsClicked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 800);
    };

    // Floating particles
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
    }));

    return (
      <section 
        ref={ref}
        id="arrow-section" 
        className="relative py-32 md:py-48 lg:py-56 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-primary/[0.02] to-transparent" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" ref={localRef}>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-blue-bright/20"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Main glow background */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{
            opacity: isHighlighted ? [0.5, 1, 0.5] : isHovered ? 0.8 : 0.5,
          }}
          transition={{ duration: isHighlighted ? 1 : 0.3 }}
        >
          <motion.div
            className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsla(221, 83%, 53%, 0.12) 0%, hsla(221, 83%, 53%, 0.04) 40%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Click ripple effect */}
        {isClicked && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-32 h-32 rounded-full border-2 border-blue-bright/60" />
          </motion.div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-16 flex flex-col items-center justify-center relative z-10">
          {/* Section label */}
          <motion.p
            className="text-muted-foreground text-xs sm:text-sm tracking-[0.4em] uppercase mb-10 md:mb-14 font-display"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover More
          </motion.p>

          {/* Cinematic Arrow Container */}
          <motion.div
            className="relative cursor-pointer select-none group"
            onDoubleClick={onDoubleClick}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute -inset-16 sm:-inset-20 md:-inset-24 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, hsla(221, 83%, 53%, 0.15) 0%, transparent 70%)",
              }}
              animate={isHighlighted ? {
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              } : isHovered ? {
                scale: 1.2,
                opacity: 0.8,
              } : {
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={isHighlighted ? {
                duration: 1.5,
                repeat: 3,
              } : {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Arrow with animations */}
            <motion.div
              animate={isHighlighted ? {
                y: [0, -10, 0],
                filter: [
                  "drop-shadow(0 0 30px hsla(221, 83%, 53%, 0.4))",
                  "drop-shadow(0 0 60px hsla(221, 83%, 53%, 0.8))",
                  "drop-shadow(0 0 30px hsla(221, 83%, 53%, 0.4))",
                ],
              } : {
                y: [0, -20, 0],
              }}
              transition={isHighlighted ? {
                duration: 1.2,
                repeat: 4,
                ease: "easeInOut",
              } : {
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.15,
                filter: "drop-shadow(0 0 40px hsla(221, 83%, 53%, 0.6))",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Arrow SVG */}
              <svg
                width="140"
                height="200"
                viewBox="0 0 140 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-28 h-40 sm:w-32 sm:h-48 md:w-40 md:h-56"
              >
                {/* Definitions */}
                <defs>
                  {/* Main gradient */}
                  <linearGradient id="arrowMainGradient" x1="70" y1="0" x2="70" y2="200" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="hsl(221, 83%, 53%)" />
                    <stop offset="40%" stopColor="hsl(217, 91%, 60%)" />
                    <stop offset="100%" stopColor="hsl(213, 94%, 68%)" />
                  </linearGradient>
                  
                  {/* Metallic gradient for body */}
                  <linearGradient id="metallicGradient" x1="50" y1="0" x2="90" y2="200" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="hsl(221, 70%, 45%)" />
                    <stop offset="30%" stopColor="hsl(217, 91%, 60%)" />
                    <stop offset="50%" stopColor="hsl(213, 94%, 75%)" />
                    <stop offset="70%" stopColor="hsl(217, 91%, 60%)" />
                    <stop offset="100%" stopColor="hsl(221, 70%, 45%)" />
                  </linearGradient>

                  {/* Light sweep gradient */}
                  <linearGradient id="lightSweep" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="40%" stopColor="white" stopOpacity="0" />
                    <stop offset="50%" stopColor="white" stopOpacity="0.6" />
                    <stop offset="60%" stopColor="white" stopOpacity="0" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </linearGradient>

                  {/* Glow filter */}
                  <filter id="arrowGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Strong glow for highlighted state */}
                  <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="10" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Clip path for sweep animation */}
                  <clipPath id="arrowClip">
                    <path d="M70 10 L70 150 M25 140 L70 185 L115 140" strokeWidth="20" />
                  </clipPath>
                </defs>

                {/* Background glow layer */}
                <motion.g
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path
                    d="M70 15 L70 145"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    filter="url(#arrowGlow)"
                    opacity="0.4"
                  />
                  <path
                    d="M30 140 L70 180 L110 140"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    filter="url(#arrowGlow)"
                    opacity="0.4"
                  />
                </motion.g>

                {/* Main arrow body */}
                <motion.path
                  d="M70 15 L70 145"
                  stroke="url(#metallicGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter={isHighlighted ? "url(#strongGlow)" : "url(#arrowGlow)"}
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
                />

                {/* Arrow head */}
                <motion.path
                  d="M30 140 L70 180 L110 140"
                  stroke="url(#metallicGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  filter={isHighlighted ? "url(#strongGlow)" : "url(#arrowGlow)"}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
                />

                {/* Light sweep animation */}
                <motion.rect
                  x="-50"
                  y="0"
                  width="80"
                  height="200"
                  fill="url(#lightSweep)"
                  animate={{
                    x: [-50, 160],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                  style={{ mixBlendMode: "overlay" }}
                />

                {/* Highlight edge line */}
                <motion.path
                  d="M66 20 L66 140 M42 140 L66 168"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.3"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: [0.2, 0.4, 0.2] } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 2,
                  }}
                />
              </svg>
            </motion.div>

            {/* Pulsing energy rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute rounded-full"
                  style={{
                    width: `${100 + ring * 50}px`,
                    height: `${140 + ring * 50}px`,
                    border: `1px solid hsla(217, 91%, 60%, ${0.3 - ring * 0.08})`,
                    boxShadow: `0 0 ${10 + ring * 5}px hsla(217, 91%, 60%, ${0.15 - ring * 0.03})`,
                  }}
                  animate={{
                    scale: [1, 1.15 + ring * 0.05, 1],
                    opacity: [0.4 - ring * 0.1, 0.15, 0.4 - ring * 0.1],
                  }}
                  transition={{
                    duration: 3 + ring * 0.5,
                    delay: ring * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Sparkle particles around arrow */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-blue-bright"
                style={{
                  left: `${50 + Math.cos((i * Math.PI * 2) / 6) * 60}%`,
                  top: `${50 + Math.sin((i * Math.PI * 2) / 6) * 50}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            ))}
          </motion.div>

          {/* Hint text */}
          <motion.p
            className="text-muted-foreground/50 text-[10px] sm:text-xs tracking-[0.2em] mt-10 md:mt-14 font-display uppercase"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 2.5, duration: 1 }}
          >
            Double-tap to unlock
          </motion.p>
        </div>
      </section>
    );
  }
);

CinematicArrow.displayName = "CinematicArrow";

export default CinematicArrow;
