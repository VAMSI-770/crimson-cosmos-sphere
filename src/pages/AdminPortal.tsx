import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar, { type AdminTab } from "@/components/admin/AdminSidebar";
import SiteContentEditor from "@/components/admin/SiteContentEditor";
import GenericCrudManager from "@/components/admin/GenericCrudManager";
import MessagesInbox from "@/components/admin/MessagesInbox";
import SkillsManager from "@/components/admin/SkillsManager";
import MediaLibrary from "@/components/admin/MediaLibrary";
import ResumeManager from "@/components/admin/ResumeManager";
import {
  useEducation, useSkillCategories, useProjects, useCertifications,
  useInternships, useAchievements, useIdeas, useGoals, useContactMessages,
} from "@/hooks/usePortfolioData";

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("about");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
      } else {
        navigate("/");
        toast.error("Please login to access admin portal");
      }
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAuthenticated(false);
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Data hooks
  const education = useEducation();
  const skillCategories = useSkillCategories();
  const projects = useProjects();
  const certifications = useCertifications();
  const internships = useInternships();
  const achievements = useAchievements();
  const ideas = useIdeas();
  const goals = useGoals();
  const messages = useContactMessages();

  const unreadCount = (messages.data || []).filter((m: any) => !m.is_read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-12 h-12 border-2 border-blue-primary border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="space-y-6">
            <SiteContentEditor section="hero" />
            <SiteContentEditor section="about" />
          </div>
        );
      case "education":
        return (
          <GenericCrudManager
            title="Education"
            description="Manage your education timeline."
            tableName="education"
            queryKey="education"
            items={education.data || []}
            isLoading={education.isLoading}
            fields={[
              { key: "year", label: "Year/Period", type: "text", placeholder: "e.g. 2023 – Present" },
              { key: "title", label: "Title", type: "text", placeholder: "e.g. B.Tech – Data Science" },
              { key: "description", label: "Description", type: "textarea" },
            ]}
          />
        );
      case "skills":
        return <SkillsManager />;
      case "projects":
        return (
          <GenericCrudManager
            title="Projects"
            description="Manage your portfolio projects."
            tableName="projects"
            queryKey="projects"
            items={projects.data || []}
            isLoading={projects.isLoading}
            fields={[
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Short Description", type: "textarea" },
              { key: "full_description", label: "Full Description", type: "textarea" },
              { key: "tags", label: "Tags", type: "array" },
              { key: "team", label: "Team", type: "text" },
              { key: "challenges", label: "Challenges", type: "textarea" },
              { key: "outcome", label: "Outcome", type: "textarea" },
              { key: "github_link", label: "GitHub Link", type: "text" },
              { key: "demo_link", label: "Demo Link", type: "text" },
              { key: "image_url", label: "Image", type: "file" },
              { key: "video_url", label: "Project Video", type: "video" },
            ]}
          />
        );
      case "certifications":
        return (
          <GenericCrudManager
            title="Certifications"
            description="Manage your professional certifications."
            tableName="certifications"
            queryKey="certifications"
            items={certifications.data || []}
            isLoading={certifications.isLoading}
            fields={[
              { key: "title", label: "Title", type: "text" },
              { key: "issuer", label: "Issuer", type: "text" },
              { key: "year", label: "Year", type: "text" },
              { key: "description", label: "Description", type: "textarea" },
              { key: "skills", label: "Skills Covered", type: "array" },
              { key: "file_url", label: "Certificate File", type: "file" },
              { key: "file_type", label: "File Type (pdf/image)", type: "text", placeholder: "pdf or image" },
              { key: "preview_image_url", label: "Preview Image", type: "file" },
            ]}
          />
        );
      case "internships":
        return (
          <GenericCrudManager
            title="Internships"
            description="Manage your work experience."
            tableName="internships"
            queryKey="internships"
            items={internships.data || []}
            isLoading={internships.isLoading}
            fields={[
              { key: "company", label: "Company", type: "text" },
              { key: "role", label: "Role", type: "text" },
              { key: "duration", label: "Duration", type: "text" },
              { key: "description", label: "Short Description", type: "textarea" },
              { key: "full_description", label: "Full Description", type: "textarea" },
              { key: "technologies", label: "Technologies", type: "array" },
              { key: "highlights", label: "Key Highlights", type: "array" },
              { key: "file_url", label: "Certificate File", type: "file" },
              { key: "file_type", label: "File Type (pdf/image)", type: "text" },
              { key: "preview_image_url", label: "Preview Image", type: "file" },
            ]}
          />
        );
      case "ideas":
        return (
          <GenericCrudManager
            title="Innovation Ideas"
            description="Manage your creative project ideas."
            tableName="ideas"
            queryKey="ideas"
            items={ideas.data || []}
            isLoading={ideas.isLoading}
            fields={[
              { key: "title", label: "Title", type: "text" },
              { key: "category", label: "Category", type: "text", placeholder: "e.g. EdTech" },
              { key: "description", label: "Short Description", type: "textarea" },
              { key: "full_description", label: "Full Description", type: "textarea" },
              { key: "potential_impact", label: "Potential Impact", type: "textarea" },
              { key: "technologies", label: "Tech Stack", type: "array" },
            ]}
          />
        );
      case "achievements":
        return (
          <GenericCrudManager
            title="Achievements"
            description="Manage your accomplishments."
            tableName="achievements"
            queryKey="achievements"
            items={achievements.data || []}
            isLoading={achievements.isLoading}
            fields={[
              { key: "title", label: "Title", type: "text" },
              { key: "label", label: "Label/Type", type: "text", placeholder: "e.g. Hackathon" },
              { key: "description", label: "Short Description", type: "textarea" },
              { key: "details", label: "Full Details", type: "textarea" },
              { key: "team", label: "Team", type: "text" },
              { key: "file_url", label: "Certificate File", type: "file" },
              { key: "file_type", label: "File Type (pdf/image)", type: "text" },
              { key: "preview_image_url", label: "Preview Image", type: "file" },
            ]}
          />
        );
      case "goals":
        return (
          <GenericCrudManager
            title="Future Goals"
            description="Manage your vision and objectives."
            tableName="goals"
            queryKey="goals"
            items={goals.data || []}
            isLoading={goals.isLoading}
            fields={[
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Short Description", type: "textarea" },
              { key: "full_description", label: "Full Description", type: "textarea" },
              { key: "timeline", label: "Timeline", type: "text", placeholder: "e.g. 2025-2027" },
              { key: "milestones", label: "Key Milestones", type: "array" },
            ]}
          />
        );
      case "contact":
        return <SiteContentEditor section="contact" />;
      case "messages":
        return <MessagesInbox />;
      case "media":
        return <MediaLibrary />;
      case "resume":
        return <ResumeManager />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} unreadCount={unreadCount} />
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
