import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { Mail, Linkedin, Github } from "lucide-react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thanks for reaching out! I'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="relative py-28">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.25em] uppercase mb-3 font-semibold">Final Scene</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Let's Build Something{" "}
            <span className="gradient-text">Amazing</span>
          </h2>
          <div className="w-20 h-1 rounded-full bg-gradient-to-r from-blueberry to-strawberry mb-14" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16">
          <ScrollReveal delay={0.1}>
            <p className="text-secondary-foreground text-base mb-8 leading-relaxed">
              Have a project, an idea, or just want to connect? I'm always open to meaningful conversations and collaborations.
            </p>
            <div className="space-y-4">
              <a href="mailto:vamsi@example.com" className="flex items-center gap-3 text-muted-foreground hover:text-blueberry transition-colors duration-300 text-sm font-medium">
                <div className="w-10 h-10 rounded-full bg-blueberry/[0.08] flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blueberry" />
                </div>
                vamsi@example.com
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-blueberry transition-colors duration-300 text-sm font-medium">
                <div className="w-10 h-10 rounded-full bg-blueberry/[0.08] flex items-center justify-center">
                  <Linkedin className="w-4 h-4 text-blueberry" />
                </div>
                LinkedIn
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-blueberry transition-colors duration-300 text-sm font-medium">
                <div className="w-10 h-10 rounded-full bg-blueberry/[0.08] flex items-center justify-center">
                  <Github className="w-4 h-4 text-blueberry" />
                </div>
                GitHub
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-5 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blueberry/40 focus:ring-2 focus:ring-blueberry/10 transition-all duration-300 text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-5 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blueberry/40 focus:ring-2 focus:ring-blueberry/10 transition-all duration-300 text-sm"
              />
              <textarea
                placeholder="Message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-5 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blueberry/40 focus:ring-2 focus:ring-blueberry/10 transition-all duration-300 resize-none text-sm"
              />
              <button type="submit" className="frosting-btn w-full">
                Send Message ✨
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
