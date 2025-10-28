import { ArrowDownIcon, DownloadIcon } from "lucide-react";

const Hero = () => {
  const scrollToPackages = () => {
    document.getElementById("packages")?.scrollIntoView({
      behavior: "smooth",
    });
  };
  const downloadDemo = () => {
    // Placeholder for demo CSV download
    alert("Demo CSV download would start here");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-6 py-20 bg-linear-to-b from-blue-50 to-white">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          Empowering startups with verified U.S. leads.
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
          Access 10+ million verified, segmented business leads to grow your
          startup — pay in your local currency and download instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <button
            onClick={scrollToPackages}
            className="px-8 py-4 bg-[#007AFF] text-white rounded-full font-semibold text-lg hover:bg-[#0066DD] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            Browse Lead Packages
            <ArrowDownIcon className="w-5 h-5" />
          </button>
          <button
            onClick={downloadDemo}
            className="px-8 py-4 bg-white text-[#007AFF] border-2 border-[#007AFF] rounded-full font-semibold text-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <DownloadIcon className="w-5 h-5" />
            See Demo File
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
