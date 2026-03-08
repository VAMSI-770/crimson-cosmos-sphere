import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ChatbotProps {
  onCommand: (command: string) => void;
}

const botResponses: Record<string, string> = {
  "open the arrow": "Scrolling to the cinematic arrow section... ✨",
  "show skills": "Navigating to the Showcase Skills section...",
  "show projects": "Taking you to the Projects section...",
  "show certifications": "Heading to Certifications...",
  "show internships": "Opening Internships section...",
  "show ideas": "Navigating to Ideas section...",
  "show achievements": "Displaying Achievements...",
  "show goals": "Showing Future Goals...",
  "contact vamsi": "Scrolling to Contact section...",
  "about": "Let me show you the About section...",
  "help": "Available commands:\n• open the arrow\n• show skills\n• show projects\n• show certifications\n• show internships\n• show ideas\n• show achievements\n• show goals\n• contact vamsi\n• about",
};

const Chatbot = ({ onCommand }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hey! I'm Vamsi's assistant. Type 'help' to see available commands.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    const command = input.toLowerCase().trim();
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const response = botResponses[command] || 
      "I don't recognize that command. Type 'help' to see available commands.";

    const botMessage: Message = {
      id: Date.now() + 1,
      text: response,
      sender: "bot",
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);

    // Execute command if recognized
    if (botResponses[command]) {
      onCommand(command);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-primary to-blue-bright text-foreground font-display font-bold text-lg shadow-lg shadow-blue-primary/30"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {isOpen ? "×" : "V"}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[450px] bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-border/30 bg-secondary/30">
              <h3 className="font-display font-semibold text-foreground">Vamsi's Assistant</h3>
              <p className="text-xs text-muted-foreground">Command-based navigation</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      message.sender === "user"
                        ? "bg-blue-primary text-white rounded-br-md"
                        : "bg-secondary/60 text-foreground border border-border/30 rounded-bl-md"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-secondary/60 border border-border/30 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/30 bg-secondary/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a command..."
                  className="flex-1 bg-background/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-primary/50 transition-colors"
                />
                <motion.button
                  onClick={handleSend}
                  className="px-4 py-2.5 bg-blue-primary hover:bg-blue-bright text-white rounded-xl text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
