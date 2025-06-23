"use client";

import { useState, useEffect } from "react";

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
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      setCurrentMessageIndex(0);

      intervalId = setInterval(() => {
        setCurrentMessageIndex((prev) => {
          if (prev >= chatMessages.length - 1) {
            // Clear the interval when we reach the end
            clearInterval(intervalId);

            // Wait 8 seconds total (3s pause + 5s wait) before restarting
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
  }, [chatMessages.length]);

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
            className="text-[#4CA5E6] hover:text-[#38456D] underline transition-colors"
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
          className={`flex items-start gap-3 justify-end transition-all duration-500 ${animationClass}`}
        >
          <div className="bg-gradient-to-br from-[#4CA5E6] to-[#38456D] p-4 rounded-2xl rounded-tr-md shadow-sm max-w-[85%]">
            <p className="text-sm text-white leading-relaxed">
              {message.message}
            </p>
          </div>
        </div>
      );
    }

    if (message.type === "document") {
      return (
        <div
          key={message.id}
          className={`flex items-start gap-3 transition-all duration-500 ${animationClass}`}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
            <img
              src="/assets/tomas-avatar-v0.1.0.png"
              alt="Tomas"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-white p-4 rounded-2xl rounded-tl-md shadow-sm border border-gray-100 max-w-[85%]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/assets/pdf.jpg"
                  alt="PDF Document"
                  className="w-12 h-16 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  Terms & Conditions
                </h4>
                <p className="text-xs text-gray-500">
                  Movie Tokenization Platform • 3.1 MB
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full animate-progress"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <span className="text-xs text-green-600 font-medium">
                    Complete
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-3 leading-relaxed">
              {message.message}
            </p>
          </div>
        </div>
      );
    }

    // Default Tomas message
    return (
      <div
        key={message.id}
        className={`flex items-start gap-3 transition-all duration-500 ${animationClass}`}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
          <img
            src="/assets/tomas-avatar-v0.1.0.png"
            alt="Tomas"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-white p-4 rounded-2xl rounded-tl-md shadow-sm border border-gray-100 max-w-[85%]">
          <p className="text-sm text-gray-700 leading-relaxed">
            {message.message}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#4CA5E6]">
            How it works
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#38456D] sm:text-4xl">
            Your web3 legal processes, simplified
          </p>

          <p className="mt-6 text-lg leading-8 text-[#38456D]/80">
            Follow these simple steps to get your legal matters resolved
            efficiently and securely with Tomas.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {/* Left side: steps */}
            <div className="relative flex flex-col justify-center pl-9">
              <div className="absolute left-0 top-0 h-full w-px bg-[#4CA5E6]/30"></div>
              {howItWorksSteps.map((step) => (
                <div key={step.id} className="relative mb-12">
                  <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-[#4CA5E6]"></div>
                  <div className="flex items-baseline gap-x-4">
                    <span className="font-mono text-lg font-semibold text-[#4CA5E6]">
                      {step.id}
                    </span>
                    <p className="text-lg leading-7 text-[#38456D]">
                      {step.textWithLink || step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: animated chat mockup */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-lg bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 shadow-xl p-6">
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

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-progress {
          animation: progress 1s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
