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
    <section id="contact" className="relative py-32">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Final Frame</p>
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-16">
            Let's Create Something{" "}
            <span className="glow-text">Legendary</span>
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16">
          <ScrollReveal delay={0.1}>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed italic">
              Every great story needs a collaboration. Have an idea, a project, or a vision? Let's build it together.
            </p>
            <div className="space-y-4">
              <a href="mailto:vamsi@example.com" className="flex items-center gap-3 text-secondary-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" /> vamsi@example.com
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-secondary-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" /> LinkedIn
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-secondary-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" /> GitHub
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-5 py-3 rounded-lg bg-surface-light border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_hsla(0,100%,45%,0.1)] transition-all"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-5 py-3 rounded-lg bg-surface-light border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_hsla(0,100%,45%,0.1)] transition-all"
              />
              <textarea
                placeholder="Your Message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-5 py-3 rounded-lg bg-surface-light border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_hsla(0,100%,45%,0.1)] transition-all resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:shadow-[0_0_40px_hsla(0,100%,45%,0.4)] hover:scale-[1.02]"
              >
                Send Message
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
