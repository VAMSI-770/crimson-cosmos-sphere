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
import FeaturedWorkSection from "../components/FeaturedWorkSection";
import CertificationsSection from "../components/CertificationsSection";
import InternshipsSection from "../components/InternshipsSection";
import IdeasSection from "../components/IdeasSection";
import AchievementsSection from "../components/AchievementsSection";
import GoalsSection from "../components/GoalsSection";

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const handleComplete = useCallback(() => setLoaded(true), []);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <CinematicLoader onComplete={handleComplete} />

      <ParticleBackground />

      {/* Nav */}

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ExperienceTimeline />
        <SkillsSection />
        <FeaturedWorkSection />
        <ProjectsSection />
        <CertificationsSection />
        <InternshipsSection />
        <IdeasSection />
        <AchievementsSection />
        <GoalsSection />
        <VisionSection />
        <ContactSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Index;
