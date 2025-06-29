"use client";

// react
import { useState, useEffect } from "react";

// next
import Image from "next/image";

interface ChatMessage {
  id: number;
  type: "tomas" | "user" | "document";
  message: string;
  delay: number;
}

export default function HowItWorksSection() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const chatMessages: ChatMessage[] = [
    {
      id: 1,
      type: "tomas",
      message:
        "Hello! I'm Tomas, your AI legal assistant. I understand you're building a platform to tokenize movies. How can I help you today?",
      delay: 0,
    },
    {
      id: 2,
      type: "user",
      message:
        "Hi Tomas! Yes, I need help with the legal framework for our movie tokenization platform. We want to ensure compliance with securities laws.",
      delay: 1000,
    },
    {
      id: 3,
      type: "tomas",
      message:
        "Perfect! I've analyzed your business model. You'll need comprehensive Terms & Conditions covering tokenization, investor rights, and regulatory compliance. Do you have all the business details ready?",
      delay: 2000,
    },
    {
      id: 4,
      type: "user",
      message:
        "Yes, I have all the information about our platform, revenue sharing model, and investor structure ready.",
      delay: 3000,
    },
    {
      id: 5,
      type: "tomas",
      message:
        "Excellent! Let me analyze everything and create your legal documents...",
      delay: 4000,
    },
    {
      id: 6,
      type: "document",
      message:
        "Here's your comprehensive Terms & Conditions for the movie tokenization platform. I've included all necessary clauses for securities compliance, investor rights, and revenue sharing.",
      delay: 5000,
    },
  ];

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const startAnimation = () => {
      // Clear any existing timers
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);

      setCurrentMessageIndex(0);

      intervalId = setInterval(() => {
        setCurrentMessageIndex((prev) => {
          if (prev >= chatMessages.length - 1) {
            // Clear the interval when we reach the end
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }

            // Wait 8 seconds before restarting
            timeoutId = setTimeout(() => {
              startAnimation();
            }, 8000);

            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    };

    startAnimation();

    // Cleanup function
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []); // Remove chatMessages.length dependency to prevent re-runs

  const howItWorksSteps = [
    {
      id: "01",
      text: "Choose your plan: Pay per case for simple legal matters or subscribe monthly for unlimited assistance.",
    },
    {
      id: "02",
      text: "Start a conversation with Tomas, your AI legal assistant, and describe your legal needs.",
    },
    {
      id: "03",
      text: "Upload documents and provide case details for comprehensive legal analysis.",
    },
    {
      id: "04",
      text: "Receive instant legal guidance, document analysis, and actionable recommendations.",
    },
    {
      id: "05",
      text: "For complex cases (1 in 5), Tomas seamlessly escalates to ",
      textWithLink: (
        <>
          For complex cases (1 in 5), Tomas seamlessly escalates to{" "}
          <a
            href="https://www.linkedin.com/in/eugenio-voticky-sousa-92a23a2b0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline transition-colors hover:text-gray-700"
          >
            Eugenio
          </a>
          , our human lawyer, for expert review.
        </>
      ),
    },
  ];

  const renderMessage = (message: ChatMessage, index: number) => {
    const isVisible = index <= currentMessageIndex;
    const animationClass = isVisible ? "animate-fade-in" : "opacity-0";

    if (message.type === "user") {
      return (
        <div
          key={message.id}
          className={`flex w-full mb-6 transition-all duration-500 ${animationClass}`}
        >
          <div className="flex flex-col w-full">
            <div
              className="px-5 py-3 rounded-2xl text-base w-full border"
              style={{
                background: "#FBFBF9",
                borderColor: "#F0EEE7",
                boxShadow: "none",
              }}
            >
              {message.message}
            </div>
          </div>
        </div>
      );
    }

    if (message.type === "document") {
      return (
        <div
          key={message.id}
          className={`flex w-full mb-6 transition-all duration-500 ${animationClass}`}
        >
          <div className="flex items-start mr-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F4F4F4] text-black text-2xl font-bold select-none mt-3"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
              }}
            >
              T
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div
              className="px-5 py-3 rounded-2xl text-base w-full"
              style={{
                background: "white",
                boxShadow: "none",
              }}
            >
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl shadow-sm w-full max-w-md mb-3">
                <Image
                  src="/assets/pdf.svg"
                  alt="PDF icon"
                  className="w-12 h-12 object-contain"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-lg font-semibold truncate">
                    Terms & Conditions
                  </span>
                  <span className="text-sm text-gray-500 truncate mt-1">
                    Movie Tokenization Platform • 3.1 MB
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {message.message}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Default Tomas message
    return (
      <div
        key={message.id}
        className={`flex w-full mb-6 transition-all duration-500 ${animationClass}`}
      >
        <div className="flex items-start mr-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F4F4F4] text-black text-2xl font-bold select-none mt-3"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
            }}
          >
            T
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div
            className="px-5 py-3 rounded-2xl text-base w-full"
            style={{
              background: "white",
              boxShadow: "none",
            }}
          >
            <p className="text-sm text-gray-700 leading-relaxed">
              {message.message}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-black text-white font-semibold text-sm mb-6">
            How it works
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl">
            Your web3 legal processes,{" "}
            <span className="text-black">simplified</span>
          </h2>

          <p className="mt-6 text-xl leading-8 text-black/80 max-w-3xl mx-auto">
            Follow these simple steps to get your legal matters resolved
            efficiently and securely with Tomas.
          </p>
        </div>

        <div className="mx-auto mt-16 w-full sm:mt-20 lg:mt-24">
          <div className="grid grid-cols-1 gap-x-24 gap-y-16 lg:grid-cols-2">
            {/* Left side: steps */}
            <div className="relative flex flex-col justify-center pl-9">
              <div className="absolute left-0 top-0 h-full w-px bg-black/30"></div>
              {howItWorksSteps.map((step) => (
                <div key={step.id} className="relative mb-12">
                  <div className="flex items-baseline gap-x-4">
                    <span className="font-mono text-lg font-semibold text-black">
                      {step.id}
                    </span>

                    <p className="text-lg leading-7 text-black">
                      {step.textWithLink || step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: animated chat mockup */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-5xl rounded-3xl border border-[#F0EEE7] shadow-xl p-8">
                {/* Chat messages */}
                <div className="space-y-4">
                  {chatMessages.map((message, index) =>
                    renderMessage(message, index)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
