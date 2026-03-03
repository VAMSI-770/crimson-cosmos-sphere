import { useState, useCallback } from "react";
import ParticleBackground from "../components/ParticleBackground";
import RosePetals from "../components/RosePetals";
import CinematicLoader from "../components/CinematicLoader";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import VisionSection from "../components/VisionSection";
import ContactSection from "../components/ContactSection";
import FooterSection from "../components/FooterSection";

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const handleComplete = useCallback(() => setLoaded(true), []);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <CinematicLoader onComplete={handleComplete} />

      {/* Film grain overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <ParticleBackground />
      <RosePetals />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-background/60 border-b border-border/50">
        <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between h-14">
          <a href="#hero" className="font-display font-bold text-lg glow-text">VB</a>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {["About", "Skills", "Projects", "Vision", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-primary transition-colors duration-300"
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
        <VisionSection />
        <ContactSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Index;
