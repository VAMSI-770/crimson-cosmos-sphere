import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TabType = "about" | "skills" | "projects" | "certifications" | "internships" | "ideas" | "achievements" | "goals";

const tabs: { id: TabType; label: string }[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "internships", label: "Internships" },
  { id: "ideas", label: "Ideas" },
  { id: "achievements", label: "Achievements" },
  { id: "goals", label: "Goals" },
];

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState<TabType>("about");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      } else {
        navigate("/");
        toast.error("Please login to access admin portal");
      }
      setIsLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/");
      }
    });

    checkAuth();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="text-2xl font-display font-bold gradient-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              A
            </motion.div>
            <div>
              <h1 className="font-display font-semibold text-foreground">Admin Portal</h1>
              <p className="text-xs text-muted-foreground">Content Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-secondary/50 hover:bg-secondary border border-border/50 rounded-lg text-foreground transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-primary/10 text-blue-bright border border-blue-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AdminContent tab={activeTab} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

interface AdminContentProps {
  tab: TabType;
}

const AdminContent = ({ tab }: AdminContentProps) => {
  const renderPlaceholder = (title: string, description: string) => (
    <div className="cinema-card rounded-2xl p-8">
      <h2 className="text-2xl font-display font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-8">{description}</p>
      
      <div className="space-y-6">
        <div className="bg-secondary/30 rounded-xl p-6 border border-border/30">
          <p className="text-sm text-muted-foreground mb-4">
            Content editing will be available once database tables are set up.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Run the database migration to enable full editing capabilities.
          </p>
        </div>

        {/* Demo form fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder={`Enter ${title.toLowerCase()} title...`}
              className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-primary/50 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter description..."
              className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-primary/50 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button className="px-6 py-2.5 bg-gradient-to-r from-blue-primary to-blue-bright text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-blue-primary/30 transition-all">
              Save Changes
            </button>
            <button className="px-6 py-2.5 bg-secondary/50 border border-border/50 text-foreground rounded-xl font-medium text-sm hover:bg-secondary transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const contentMap: Record<TabType, { title: string; description: string }> = {
    about: { title: "About Section", description: "Edit your personal introduction and bio." },
    skills: { title: "Skills Section", description: "Manage your technical skills and proficiency levels." },
    projects: { title: "Projects Section", description: "Add, edit, or remove your portfolio projects." },
    certifications: { title: "Certifications", description: "Manage your professional certifications." },
    internships: { title: "Internships", description: "Edit your work experience and internships." },
    ideas: { title: "Ideas Section", description: "Manage your innovative project ideas." },
    achievements: { title: "Achievements", description: "Update your accomplishments and milestones." },
    goals: { title: "Future Goals", description: "Edit your vision and future objectives." },
  };

  const { title, description } = contentMap[tab];
  return renderPlaceholder(title, description);
};

export default AdminPortal;
