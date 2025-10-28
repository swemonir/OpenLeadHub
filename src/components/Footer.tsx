const Footer = () => {
  return (
    <footer className="w-full px-6 py-12 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400">© 2025 OpenLeadHub</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Use
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Data Ethics
            </a>
            <a
              href="/contact"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Prices shown in your local currency.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
