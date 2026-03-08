import { useState, useCallback } from "react";
import ParticleBackground from "../components/ParticleBackground";
import CinematicLoader from "../components/CinematicLoader";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import ExperienceTimeline from "../components/ExperienceTimeline";
import VisionSection from "../components/VisionSection";
import ContactSection from "../components/ContactSection";
import FooterSection from "../components/FooterSection";

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const handleComplete = useCallback(() => setLoaded(true), []);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <CinematicLoader onComplete={handleComplete} />

      <ParticleBackground />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border/30">
        <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between h-14">
          <a href="#hero" className="font-display font-bold text-lg gradient-text">VB</a>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-body font-medium">
            {["About", "Skills", "Projects", "Experience", "Vision", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-blueberry-glow transition-colors duration-400 tracking-wide relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-blueberry-glow after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceTimeline />
        <VisionSection />
        <ContactSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Index;
