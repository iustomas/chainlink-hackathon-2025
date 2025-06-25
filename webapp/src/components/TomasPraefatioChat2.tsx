"use client";

// react
import React, { useState, useRef, useEffect } from "react";

// react-icons
import { FiArrowUp, FiPaperclip, FiGlobe, FiPlus, FiX } from "react-icons/fi";

// utils
import { formatAddress } from "../../utils/format-address";

// wagmi
import { useAccount } from "wagmi";

// reown
import { modal } from "../../context";

// components
import { TypeWriter } from "./TypeWriter";

/**
 * Tomas Praefatio
 */
export default function TomasPraefatioChat2() {
  type Message = { role: "user" | "assistant"; content: string };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { address } = useAccount();

  // Menu and file input
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aquí puedes manejar el archivo (enviar, mostrar, etc.)
      alert(`Archivo seleccionado: ${file.name}`);
    }
  };

  // const color1 = "#BCE3F8"; // Celeste claro
  // const color2 = "#4CA5E6"; // Azul eléctrico
  // const color3 = "#E3E4E5"; // Blanco grisáceo
  // const color4 = "#FCE3D0"; // Naranja pastel muy claro (casi piel)
  // const color5 = "#38456D"; // Azul oscuro con leve matiz violeta

  return (
    <div className="relative w-full h-full font-spectral bg-white flex flex-col">
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

          {/* Messages area with scroll */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 pt-4 pb-2"
            style={{ minHeight: 0 }}
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

          {/* Fixed input area at bottom */}
          <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
            <form onSubmit={handleSend} className="w-full max-w-4xl mx-auto">
              <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 gap-2 relative">
                <div className="relative flex items-center">
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setShowMenu((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showMenu ? <FiX size={22} /> : <FiPlus size={22} />}
                  </button>

                  {showMenu && (
                    <div
                      ref={menuRef}
                      className="absolute left-0 bottom-12 min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-30 animate-fade-in flex flex-col gap-1"
                    >
                      <button
                        type="button"
                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors gap-2 cursor-pointer"
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowMenu(false);
                        }}
                      >
                        <FiPaperclip size={18} />
                        Upload a file
                      </button>

                      <button
                        type="button"
                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors gap-2 cursor-pointer"
                        onClick={() => {
                          alert("Funcionalidad de sitio web próximamente");
                          setShowMenu(false);
                        }}
                      >
                        <FiGlobe size={18} />
                        Website
                      </button>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </div>

                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none text-base px-3 py-2"
                  placeholder="Talk with Tomas..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  style={{ minWidth: 0 }}
                />
                <button
                  type="submit"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#38456D] text-white hover:bg-[#4CA5E6] transition-colors"
                  disabled={loading || !input.trim()}
                >
                  <FiArrowUp size={22} />
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
