const FooterSection = () => {
  return (
    <footer className="relative py-10">
      <div className="accent-line mb-8" />
      <div className="container mx-auto px-6 lg:px-16 text-center">
        <p className="text-muted-foreground text-sm font-display tracking-wider">
          © {new Date().getFullYear()} <span className="text-royal-gold font-semibold">Bollepalli Vamsi</span> · All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
