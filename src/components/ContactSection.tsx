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
    <section id="contact" className="relative py-36 brush-texture">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="gold-text text-sm tracking-[0.3em] uppercase mb-3 font-body font-medium">Final Frame</p>
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-4 italic">
            Let's Create Something{" "}
            <span className="glow-text">Timeless</span>
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-primary to-gold mb-16" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16">
          <ScrollReveal delay={0.1}>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed italic font-display">
              Every great masterpiece begins with a collaboration. Have a vision, a project, or an idea? Let's bring it to life together.
            </p>
            <div className="space-y-4">
              <a href="mailto:vamsi@example.com" className="flex items-center gap-3 text-secondary-foreground hover:text-gold transition-colors duration-300">
                <Mail className="w-5 h-5" /> vamsi@example.com
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-secondary-foreground hover:text-gold transition-colors duration-300">
                <Linkedin className="w-5 h-5" /> LinkedIn
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-secondary-foreground hover:text-gold transition-colors duration-300">
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
                className="w-full px-5 py-3.5 rounded-lg bg-surface-light border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 focus:shadow-[0_0_15px_hsla(43,74%,45%,0.1)] transition-all duration-300"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-5 py-3.5 rounded-lg bg-surface-light border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 focus:shadow-[0_0_15px_hsla(43,74%,45%,0.1)] transition-all duration-300"
              />
              <textarea
                placeholder="Your Message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-5 py-3.5 rounded-lg bg-surface-light border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 focus:shadow-[0_0_15px_hsla(43,74%,45%,0.1)] transition-all duration-300 resize-none"
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-gradient-to-r from-primary via-accent to-gold font-semibold text-primary-foreground transition-all duration-500 hover:shadow-[0_0_40px_hsla(0,100%,40%,0.3),0_0_20px_hsla(43,74%,45%,0.2)] hover:scale-[1.02]"
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
