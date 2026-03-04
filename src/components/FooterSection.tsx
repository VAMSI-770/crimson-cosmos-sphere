const FooterSection = () => {
  return (
    <footer className="relative py-10">
      <div className="red-line mb-8" />
      <div className="container mx-auto px-6 lg:px-16 text-center">
        <p className="text-muted-foreground text-sm font-display italic">
          © {new Date().getFullYear()} <span className="gold-text">Vamsi Bollepalli</span>. A living digital painting.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
