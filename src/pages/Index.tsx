import ParticleBackground from "../components/ParticleBackground";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import VisionSection from "../components/VisionSection";
import ContactSection from "../components/ContactSection";
import FooterSection from "../components/FooterSection";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <ParticleBackground />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/50">
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
