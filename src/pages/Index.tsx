import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import CertificationsSection from "../components/CertificationsSection";
import InternshipsSection from "../components/InternshipsSection";
import IdeasSection from "../components/IdeasSection";
import AchievementsSection from "../components/AchievementsSection";
import GoalsSection from "../components/GoalsSection";
import Chatbot from "../components/Chatbot";
import CinematicArrow from "../components/CinematicArrow";
import AdminLoginModal from "../components/AdminLoginModal";

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isArrowHighlighted, setIsArrowHighlighted] = useState(false);
  const handleComplete = useCallback(() => setLoaded(true), []);
  const arrowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleChatCommand = (command: string) => {
    const commandMap: Record<string, string> = {
      "open the arrow": "arrow-section",
      "show skills": "showcase-skills",
      "show projects": "projects",
      "show certifications": "certifications",
      "show internships": "internships",
      "show ideas": "ideas",
      "show achievements": "achievements",
      "show goals": "goals",
      "contact vamsi": "contact",
      "about": "about",
    };

    const sectionId = commandMap[command];
    if (sectionId) {
      scrollToSection(sectionId);
      
      // Highlight arrow if that command was used
      if (command === "open the arrow") {
        setIsArrowHighlighted(true);
        setTimeout(() => setIsArrowHighlighted(false), 5000);
      }
    }
  };

  const handleArrowDoubleClick = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLoginSuccess = () => {
    setShowAdminLogin(false);
    navigate("/admin");
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <CinematicLoader onComplete={handleComplete} />

      <ParticleBackground />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ExperienceTimeline />
        
        <SkillsSection />
        <ProjectsSection />
        <CertificationsSection />
        <InternshipsSection />
        <IdeasSection />
        <AchievementsSection />
        <GoalsSection />
        <VisionSection />
        <CinematicArrow 
          ref={arrowRef}
          onDoubleClick={handleArrowDoubleClick}
          isHighlighted={isArrowHighlighted}
        />
        <ContactSection />
        <FooterSection />
      </main>

      {/* Chatbot */}
      <Chatbot onCommand={handleChatCommand} />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
};

export default Index;
