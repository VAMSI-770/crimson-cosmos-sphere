import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Eye } from "lucide-react";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
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
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
          >
            <Eye className="w-4 h-4" />
            View Site
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-secondary/50 hover:bg-secondary border border-border/50 rounded-lg text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
