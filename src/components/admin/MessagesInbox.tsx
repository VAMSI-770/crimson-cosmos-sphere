import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useContactMessages } from "@/hooks/usePortfolioData";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, Clock } from "lucide-react";

const MessagesInbox = () => {
  const { data: messages = [], isLoading } = useContactMessages();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const markRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
    toast.success("Message deleted");
    if (selectedId === id) setSelectedId(null);
  };

  const selected = messages.find((m: any) => m.id === selectedId);

  return (
    <div className="cinema-card rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-display font-bold text-foreground mb-2">Messages Inbox</h2>
      <p className="text-muted-foreground text-sm mb-6">Contact form submissions from visitors.</p>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No messages yet.</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {messages.map((msg: any) => (
              <motion.div
                key={msg.id}
                onClick={() => { setSelectedId(msg.id); if (!msg.is_read) markRead(msg.id); }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedId === msg.id
                    ? "border-blue-primary/30 bg-blue-primary/5"
                    : msg.is_read
                    ? "border-border/30 bg-secondary/20 hover:bg-secondary/30"
                    : "border-blue-primary/20 bg-blue-primary/5 hover:bg-blue-primary/10"
                }`}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {msg.is_read ? <MailOpen className="w-3.5 h-3.5 text-muted-foreground" /> : <Mail className="w-3.5 h-3.5 text-blue-bright" />}
                    <span className={`text-sm font-medium ${msg.is_read ? "text-foreground" : "text-blue-bright"}`}>{msg.name}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }} className="p-1 hover:bg-destructive/10 rounded text-destructive/60 hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground/60">
                  <Clock className="w-3 h-3" />
                  {new Date(msg.created_at).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-secondary/20 border border-border/30 rounded-xl p-5"
              >
                <h3 className="font-semibold text-foreground mb-1">{selected.name}</h3>
                <p className="text-xs text-blue-bright mb-4">{selected.email}</p>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-4">{new Date(selected.created_at).toLocaleString()}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MessagesInbox;
