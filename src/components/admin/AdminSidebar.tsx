import { motion } from "framer-motion";
import { 
  User, Code, FolderOpen, Award, Briefcase, Lightbulb, Trophy, Target, 
  Mail, Image, GraduationCap, FileText, ShieldCheck 
} from "lucide-react";

export type AdminTab = 
  | "about" | "education" | "skills" | "projects" | "certifications" 
  | "internships" | "ideas" | "achievements" | "goals" | "contact" | "messages" | "media" | "resume" | "blockchain";

const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "about", label: "About / Hero", icon: User },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Code },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "internships", label: "Internships", icon: Briefcase },
  { id: "ideas", label: "Ideas", icon: Lightbulb },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "goals", label: "Goals", icon: Target },
  { id: "contact", label: "Contact Settings", icon: Mail },
  { id: "messages", label: "Inbox", icon: Mail },
  { id: "media", label: "Media Library", icon: Image },
  { id: "blockchain", label: "Blockchain", icon: ShieldCheck },
];


interface Props {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  unreadCount?: number;
}

const AdminSidebar = ({ activeTab, onTabChange, unreadCount = 0 }: Props) => (
  <aside className="lg:w-64 flex-shrink-0">
    <nav className="sticky top-24 space-y-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
              activeTab === tab.id
                ? "bg-blue-primary/10 text-blue-bright border border-blue-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
            {tab.id === "messages" && unreadCount > 0 && (
              <span className="ml-auto text-xs bg-blue-primary text-white rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </motion.button>
        );
      })}
    </nav>
  </aside>
);

export default AdminSidebar;
