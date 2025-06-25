"use client";

// react
import React, { useState, useRef, useEffect } from "react";

// utils
import { formatAddress } from "../../utils/format-address";

// wagmi
import { useAccount } from "wagmi";

// reown
import { modal } from "../../context";

// components
import TypeWriter from "./TypeWriter";
import RecommendedToStart from "./RecommendedToStart";
import RecommendedDocuments from "./RecommendedDocuments";
import { LuPaperclip, LuLayers } from "react-icons/lu";

/**
 * Tomas Praefatio
 */
export default function TomasPraefatioChat() {
  type Message = { role: "user" | "assistant"; content: string };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { address } = useAccount();

  // Menu and file input
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleConnect = () => {
    if (modal) {
      modal.open();
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/tomas/talk-with-tomas-praefatio",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userAddress: address, message: input }),
        }
      );
      const data = await res.json();
      if (data && data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response } as Message,
        ]);
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

  return (
    <div className="relative w-full h-full font-spectral bg-white flex flex-col">
      {/* Header section */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2 border-b border-gray-300 bg-white">
        <div className="w-full pl-[20px]">
          <h2 className="text-md text-gray-600 mb-1">Assistant /</h2>
          {/* TODO: change to a dynamic title */}
          <h1 className="text-lg text-black mb-3">
            Proyecto de Desci para pelirrojas
          </h1>
        </div>
      </div>

      <div className="flex-1 px-[40px]">
        {/* Input area */}
        <div className="flex-shrink-0 py-[20px] mb-[40px]">
          <div className="w-full mx-auto bg-[#FBFBF9] rounded-xl shadow p-6 flex flex-col items-center">
            <form onSubmit={handleSend} className="w-full flex flex-col gap-4">
              <div className="relative w-full">
                <textarea
                  className="w-full resize-none rounded-2xl py-6 text-md focus:outline-none border-0 shadow-none bg-transparent"
                  placeholder="Ask Tomas anything..."
                  rows={4}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  style={{ minHeight: "64px" }}
                />

                <button
                  type="submit"
                  className="absolute bottom-2 right-2 bg-[#38456D] text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-[#2c3552] transition shadow-md"
                  disabled={loading || !input.trim()}
                >
                  <h1 className="text-lg font-semibold">Talk with Tomas</h1>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4 w-full mt-2">
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
            </form>
          </div>
        </div>

        {/* Recommended to start section */}
        <RecommendedToStart />

        {/* Documents section */}
        <RecommendedDocuments />
      </div>

      {!address ? (
        <div className="flex flex-col items-center justify-center h-full w-full text-gray-500 text-lg p-4">
          Please connect your wallet to start chatting with Tomas.
          <button
            className="bg-[#BC694A] text-white px-4 py-2 rounded-lg mt-4"
            onClick={() => {
              handleConnect();
            }}
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          {/* Messages area with scroll */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 pt-4 pb-2"
          >
            <div className="w-full max-w-4xl mx-auto">
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
                        background: msg.role === "user" ? "#FBFBF9" : undefined,
                        borderColor:
                          msg.role === "user" ? "#F0EEE7" : undefined,
                        boxShadow: "none",
                      }}
                    >
                      {msg.role === "user" && (
                        <div className="flex items-center mb-2">
                          <span
                            className="text-xs font-semibold px-3 py-1 rounded-[10px]"
                            style={{ background: "#FF9800", color: "#000" }}
                          >
                            {address ? formatAddress(address) : ""}
                          </span>
                        </div>
                      )}

                      {msg.role === "assistant" ? (
                        <TypeWriter text={msg.content} speed={20} />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="px-5 py-3 rounded-2xl max-w-[70%] text-base bg-white text-gray-800">
                    Tomas is thinking...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
