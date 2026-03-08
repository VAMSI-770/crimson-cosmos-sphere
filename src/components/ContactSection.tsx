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
    <section id="contact" className="relative py-32 bg-cinema-subtle">
      <div className="container mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">Get In Touch</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">
            Begin a New{" "}
            <span className="gradient-text">Collaboration</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-16" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16">
          <ScrollReveal delay={0.1}>
            <p className="text-secondary-foreground text-base mb-10 leading-relaxed">
              Have a project, an idea, or just want to connect? I'm always open to meaningful conversations and collaborations.
            </p>
            <div className="space-y-5">
              {[
                { icon: Mail, label: "vamsibollepalli770@gmail.com", href: "mailto:vamsibollepalli770@gmail.com" },
                { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/vamsi-bollepalli-28a6b231a" },
                { icon: Github, label: "GitHub", href: "https://github.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 text-muted-foreground hover:text-blue-bright transition-all duration-400 text-sm font-medium group"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-primary/[0.06] border border-blue-primary/10 flex items-center justify-center group-hover:bg-blue-primary/10 group-hover:border-blue-primary/30 group-hover:shadow-[0_0_20px_hsla(221,83%,53%,0.12)] transition-all duration-400">
                    <Icon className="w-4 h-4 text-blue-bright" />
                  </div>
                  {label}
                </a>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { type: "text", placeholder: "Name", key: "name" as const },
                { type: "email", placeholder: "Email", key: "email" as const },
              ].map(({ type, placeholder, key }) => (
                <input
                  key={key}
                  type={type}
                  placeholder={placeholder}
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl bg-secondary/40 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-primary/40 focus:ring-2 focus:ring-blue-primary/10 focus:shadow-[0_0_20px_hsla(221,83%,53%,0.08)] transition-all duration-400 text-sm backdrop-blur-sm"
                />
              ))}
              <textarea
                placeholder="Message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-5 py-3.5 rounded-xl bg-secondary/40 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-primary/40 focus:ring-2 focus:ring-blue-primary/10 focus:shadow-[0_0_20px_hsla(221,83%,53%,0.08)] transition-all duration-400 resize-none text-sm backdrop-blur-sm"
              />
              <button type="submit" className="glow-btn w-full">
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
