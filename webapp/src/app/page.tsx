// next
import Link from "next/link";

// components
import Navbar from "@/components/Navbar";
import HowItWorksSection from "@/components/HowItWorksSection";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#F4F3ED]">
      {/* Background Image */}
      <div
        className="absolute inset-0 h-[100vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/assets/tomas-v0.1.0.png)",
          backgroundPosition: "center 0%",
        }}
      />
      {/* Overlay for opacity */}
      <div className="absolute inset-0 h-[100vh] bg-black/30" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col min-h-screen justify-center items-center text-center">
        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg mb-4 mt-8 md:mt-0">
          Tomas,
        </h1>

        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg mb-4 mt-8 md:mt-0">
          the #1 Web3 Lawyer for legal services
        </h1>

        {/* Claims Row */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-8 justify-center items-center mb-10">
          <span className="text-xs md:text-sm text-white/80 font-semibold tracking-wide">
            #1 IN WEB3 LEGAL ADVISORY
          </span>

          <span className="text-xs md:text-sm text-white/80 font-semibold tracking-wide">
            #1 IN SMART CONTRACTS
          </span>

          <span className="text-xs md:text-sm text-white/80 font-semibold tracking-wide">
            #1 IN CRYPTO REGULATION
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <Link href="/app" passHref>
            <button className="px-6 py-2 rounded-[10px] border border-white font-semibold transition-colors duration-200 text-white hover:bg-black hover:text-white hover:border-black cursor-pointer w-full md:w-auto">
              Start legal case
            </button>
          </Link>

          <Link href="/contact-sales" passHref>
            <button className="px-6 py-2 rounded-[10px] font-semibold transition-opacity duration-200 bg-white text-black hover:opacity-80 cursor-pointer w-full md:w-auto">
              Contact
            </button>
          </Link>
        </div>
      </section>

      <HowItWorksSection />
    </main>
  );
}
