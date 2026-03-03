const FooterSection = () => {
  return (
    <footer className="relative py-8">
      <div className="red-line mb-8" />
      <div className="container mx-auto px-6 lg:px-16 text-center">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Vamsi Bollepalli. Crafted with precision.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
