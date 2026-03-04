const FooterSection = () => {
  return (
    <footer className="relative py-8">
      <div className="accent-line mb-6" />
      <div className="container mx-auto px-6 lg:px-16 text-center">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} <span className="text-foreground">Vamsi Bollepalli</span>. Built with intention.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
