const FooterSection = () => {
  return (
    <footer className="relative py-10">
      <div className="accent-line mb-8" />
      <div className="container mx-auto px-6 lg:px-16 text-center">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} <span className="text-foreground font-medium">Vamsi Bollepalli</span>. Crafted with 🫐 and care.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
