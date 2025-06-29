"use client";

// react
import { useState } from "react";

// next
import Link from "next/link";
import Image from "next/image";

// components
import Navbar from "@/components/Navbar";
import HowItWorksSection from "@/components/HowItWorksSection";

export default function Home() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    setTimeout(() => setShowVideo(true), 5000);
  };

  return (
    <main className="relative min-h-screen bg-[#F4F3ED]">
      {/* Hero Section */}
      <section className="relative flex flex-col min-h-screen">
        {/* Background Image */}
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: "url(/assets/cover-4.png)",
            backgroundPosition: "center 0%",
            backgroundSize: "cover",
          }}
        />

        {/* Background Video */}
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            showVideo ? "opacity-100" : "opacity-0"
          }`}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 0%" }}
          >
            <source src="/assets/video-cover-5.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Loading background color */}
        <div
          className={`absolute inset-0 w-full h-full bg-black transition-opacity duration-1000 ${
            isImageLoaded ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Overlay for opacity */}
        <div className="absolute inset-0 h-full bg-black/30" />

        {/* Preload image */}
        <div className="hidden">
          <Image
            src="/assets/cover.png"
            alt="Background"
            width={1920}
            height={1080}
            onLoad={handleImageLoad}
            priority
          />
        </div>

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
            {/* TODO: Add link to demo */}
            <Link href="/" passHref>
              <button className="px-6 py-2 rounded-[10px] border border-white font-semibold transition-colors duration-200 text-white hover:bg-black hover:text-white hover:border-black cursor-pointer w-full md:w-auto">
                View Demo
              </button>
            </Link>

            <Link href="/chat-provisory" passHref>
              <button className="px-6 py-2 rounded-[10px] font-semibold transition-opacity duration-200 bg-white text-black hover:opacity-80 cursor-pointer w-full md:w-auto">
                Start legal case
              </button>
            </Link>
          </div>
        </section>
      </section>

      <HowItWorksSection />
    </main>
  );
}
