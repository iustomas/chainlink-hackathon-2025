"use client";

// react
import React, { useState, useRef, useEffect } from "react";

// next
import Image from "next/image";

// wagmi
import { useAccount } from "wagmi";

// reown
import { modal } from "../../context";

// components
import TypeWriter from "./TypeWriter";
import RecommendedToStart from "./RecommendedToStart";
import RecommendedDocuments from "./RecommendedDocuments";
import TomasIsThinking from "./TomasIsThinking";
import CaseFacts from "./CaseFacts";
import PayProposal from "./PayProposal";
import DashboardHeader from "./DashboardHeader";

// icons
import { LuPaperclip, LuLayers } from "react-icons/lu";

/**
 * Tomas Praefatio
 */
export default function TomasPraefatioChat() {
  type Message = { role: "user" | "assistant"; content: string };

  type ConversationHistoryResponse = {
    status: string;
    message: string;
    address: string;
    conversation: Array<{
      message: string;
      response: string;
      timestamp: number;
    }>;
    caseFacts: string[];
    price?: number;
  };

  type TomasResponse = {
    response: string;
    caseFacts?: string[];
    price?: number;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [caseFacts, setCaseFacts] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [proposalPrice, setProposalPrice] = useState<number | null>(null);

  const [hasChatted, setHasChatted] = useState(false);
  const [isHistoricalData, setIsHistoricalData] = useState(false);

  const [showChat, setShowChat] = useState(false);

  // Case Facts expansion state
  const [isCaseFactsExpanded, setIsCaseFactsExpanded] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { address } = useAccount();

  // Menu and file input
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingConversationHistory, setIsLoadingConversationHistory] =
    useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (hasChatted) {
      const timeout = setTimeout(() => setShowChat(true), 200);
      return () => clearTimeout(timeout);
    } else {
      setShowChat(false);
    }
  }, [hasChatted]);

  // Load conversation history when address is available
  useEffect(() => {
    if (!address) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }

    const loadConversationHistory = async () => {
      setIsLoadingConversationHistory(true);
      try {
        const response = await fetch(
          `http://localhost:3000/conversation/get-conversation-history-and-last-extracted-facts?address=${address}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();

        if (
          data.status === "success" &&
          data.conversation &&
          data.conversation.length > 0
        ) {
          // Convert conversation history to messages format
          const conversationMessages: Message[] = [];
          (data as ConversationHistoryResponse).conversation.forEach((conv) => {
            conversationMessages.push({ role: "user", content: conv.message });
            conversationMessages.push({
              role: "assistant",
              content: conv.response,
            });
          });

          setMessages(conversationMessages);
          setCaseFacts(data.caseFacts || []);
          setHasChatted(true);
          setIsHistoricalData(true);

          // Check if there's a price in the historical data
          if (data.price !== undefined && data.price > 0) {
            setProposalPrice(data.price);
          }
        }
      } catch (error) {
        console.error("Error loading conversation history:", error);
      } finally {
        setIsLoadingConversationHistory(false);
        setIsLoading(false);
      }
    };

    loadConversationHistory();
  }, [address]);

  const handleConnect = () => {
    if (modal) {
      modal.open();
    }
  };

  const handleCaseFactsToggle = (isExpanded: boolean) => {
    setIsCaseFactsExpanded(isExpanded);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    if (!hasChatted) setHasChatted(true);

    try {
      const res = await fetch(
        "http://localhost:3000/tomas/talk-with-tomas-praefatio",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userAddress: address, message: input }),
        }
      );
      const data: TomasResponse = await res.json();
      if (data && data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response } as Message,
        ]);
        setCaseFacts(data.caseFacts || []);

        console.log("data", data);

        // Check if there's a price in the response
        if (data.price !== undefined) {
          setProposalPrice(data.price);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm sorry, I couldn't get a response from Tomas.",
          } as Message,
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error connecting to Tomas backend.",
        } as Message,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayTomas = () => {
    // TODO: Implement payment logic
    console.log("Paying Tomas:", proposalPrice);
    // Reset the price after payment
    setProposalPrice(null);
  };

  return isLoading || isLoadingConversationHistory ? (
    <div className="flex flex-col items-center justify-center h-screen w-full text-gray-500 text-lg p-4 bg-white">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold mb-4">
          {isLoadingConversationHistory
            ? "Loading your conversation history..."
            : "Checking wallet..."}
        </span>
        <span className="loader-tomas inline-block w-8 h-8 border-2 border-gray-400 rounded-full animate-spin"></span>
      </div>
    </div>
  ) : !address ? (
    <div className="flex flex-col items-center justify-center h-screen w-full text-gray-500 text-lg p-4 bg-white">
      <h1 className="text-2xl font-bold">
        Please connect your wallet to start chatting with Tomas.
      </h1>

      <button
        className="bg-black text-white px-4 py-2 rounded-lg mt-4 cursor-pointer"
        onClick={handleConnect}
      >
        <h2 className="text-lg font-semibold">Connect Wallet</h2>
      </button>
    </div>
  ) : (
    <div className="relative w-full h-full font-spectral bg-white flex flex-col">
      {/* Header section */}
      <DashboardHeader />

      <div
        className={`flex-1 px-[40px] flex flex-row min-h-0 transition-all duration-300 ease-in-out overflow-hidden ${
          isCaseFactsExpanded ? "gap-8" : "gap-4"
        }`}
      >
        {/* Chat principal */}
        <div
          className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out mt-[20px] overflow-hidden ${
            isCaseFactsExpanded ? "mr-8" : "mr-0"
          }`}
        >
          {showChat && (
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-4 pt-4 pb-2 transition-all duration-500 ease-in-out opacity-100 translate-y-0"
              style={{
                transitionProperty: "opacity, transform",
                opacity: showChat ? 1 : 0,
                transform: showChat ? "translateY(0)" : "translateY(20px)",
                minHeight: 0,
                maxHeight: "100%",
              }}
            >
              <div
                className={`w-full max-w-4xl transition-all duration-300 ease-in-out ${
                  isCaseFactsExpanded ? "ml-0" : "mx-auto"
                }`}
              >
                {messages.map((msg, idx) => (
                  <div key={idx} className="flex w-full mb-6">
                    {msg.role === "assistant" && (
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
                    )}

                    <div className="flex flex-col w-full">
                      <div
                        className={`px-5 py-3 rounded-2xl text-base w-full ${
                          msg.role === "user" ? "border" : "bg-white"
                        }`}
                        style={{
                          background:
                            msg.role === "user" ? "#FBFBF9" : undefined,
                          borderColor:
                            msg.role === "user" ? "#F0EEE7" : undefined,
                          boxShadow: "none",
                        }}
                      >
                        {msg.role === "assistant" ? (
                          isHistoricalData ? (
                            msg.content
                          ) : (
                            <TypeWriter text={msg.content} speed={10} />
                          )
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Mostrar cuadro PDF proposal como último mensaje si hay proposalPrice */}
                {proposalPrice !== null && (
                  <div className="flex w-full mb-6">
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
                      <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm w-full max-w-md">
                        <Image
                          src="/assets/pdf.svg"
                          alt="PDF icon"
                          className="w-12 h-12 object-contain"
                          width={48}
                          height={48}
                        />
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-lg font-semibold truncate">
                            Proposal of Tomas
                          </span>
                          <span className="text-sm text-gray-500 truncate mt-1">
                            PDF document · 0.12 MB
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading state */}
                {loading && <TomasIsThinking />}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Recomendaciones solo si no ha chateado */}
          {!hasChatted && (
            <div
              className="flex-1 flex flex-col justify-center transition-all duration-500 ease-in-out opacity-100 translate-y-0 overflow-y-auto"
              style={{
                transitionProperty: "opacity, transform",
                opacity: !hasChatted ? 1 : 0,
                transform: !hasChatted ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <RecommendedToStart />
              <RecommendedDocuments />
            </div>
          )}

          {/* Input container ahora dentro del contenedor con padding */}
          <div
            className={`bg-[#FBFBF9] rounded-xl shadow p-6 flex flex-col items-center transition-all duration-500 ease-in-out w-full flex-shrink-0${
              hasChatted ? " max-w-4xl" : ""
            } mb-8 transition-all duration-300 ease-in-out ${
              isCaseFactsExpanded ? "ml-0" : "mx-auto"
            }`}
          >
            {proposalPrice !== null ? (
              <PayProposal price={proposalPrice} onPay={handlePayTomas} />
            ) : (
              // Show normal input form
              <form
                onSubmit={handleSend}
                className="w-full flex flex-col gap-4"
              >
                <div className="relative w-full">
                  <textarea
                    className="w-full resize-none rounded-2xl text-md focus:outline-none bg-transparent"
                    placeholder="Ask Tomas anything..."
                    rows={hasChatted ? 2 : 4}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !e.shiftKey &&
                        !e.ctrlKey &&
                        !e.metaKey
                      ) {
                        e.preventDefault();
                        if (!loading && input.trim()) {
                          handleSend(e as unknown as React.FormEvent);
                        }
                      } else if (
                        e.key === "Enter" &&
                        (e.ctrlKey || e.metaKey)
                      ) {
                        e.preventDefault();
                        if (!loading && input.trim()) {
                          handleSend(e as unknown as React.FormEvent);
                        }
                      }
                    }}
                  />

                  <button
                    type="submit"
                    className="absolute bottom-2 right-2 bg-black text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-[#2c3552] transition shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    disabled={loading || !input.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="loader-tomas inline-block w-4 h-4 border-2 border-white rounded-full animate-spin"></span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold">Talk Tomas</span>
                    )}
                  </button>
                </div>

                {!hasChatted && (
                  <div
                    className="flex flex-col md:flex-row gap-4 w-full mt-2 transition-all duration-500 ease-in-out opacity-100 translate-y-0"
                    style={{
                      transitionProperty: "opacity, transform",
                      opacity: !hasChatted ? 1 : 0,
                      transform: !hasChatted
                        ? "translateY(0)"
                        : "translateY(20px)",
                    }}
                  >
                    <button
                      type="button"
                      className="flex-1 bg-white rounded-xl py-5 px-6 text-left flex items-center justify-between shadow-sm hover:bg-gray-50 transition cursor-pointer group"
                    >
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-gray-900">
                          Upload files
                        </span>

                        <span className="text-sm text-gray-500">
                          Choose files from your computer or a Vault project
                        </span>
                      </div>
                      <LuPaperclip className="text-2xl text-gray-400 group-hover:text-gray-700 ml-4" />
                    </button>

                    <button
                      type="button"
                      className="flex-1 bg-white rounded-xl py-5 px-6 text-left flex items-center justify-between shadow-sm hover:bg-gray-50 transition cursor-pointer group"
                    >
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-gray-900">
                          Choose knowledge source
                        </span>

                        <span className="text-sm text-gray-500">
                          CFTC, MiCA, Fintech Law, and more
                        </span>
                      </div>
                      <LuLayers className="text-2xl text-gray-400 group-hover:text-gray-700 ml-4" />
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
        {/* Panel lateral derecho para Case Facts */}
        <CaseFacts caseFacts={caseFacts} onToggle={handleCaseFactsToggle} />
      </div>

      {/* Loader Tomas Spinner CSS */}
      <style jsx global>{`
        .loader-tomas {
          border-radius: 50%;
          border-top-color: #38456d;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
