// react
import React, { useState, useRef, useEffect } from "react";

// react-markdown
import ReactMarkdown from "react-markdown";

// react-icons
import { FiArrowUp, FiPaperclip, FiGlobe, FiPlus, FiX } from "react-icons/fi";

// utils
import { formatAddress } from "../../utils/format-address";

/**
 * Tomas Praefatio
 */
export default function TomasPraefatioChat() {
  type Message = { role: "user" | "assistant"; content: string };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hardcoded caseId for now
  const caseId = "0x6914c5b9ab9b49bCF84f980Ff773Bf2ae6186A6D-01";

  // Extraer address del caseId (antes del guion)
  const userAddress = caseId.split("-")[0];

  // Hooks y refs para el menú y file input
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer click fuera
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
          body: JSON.stringify({ caseId, message: input }),
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

  // Handler para subir archivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aquí puedes manejar el archivo (enviar, mostrar, etc.)
      alert(`Archivo seleccionado: ${file.name}`);
    }
  };

  return (
    <div
      className="relative w-full max-w-2xl mx-auto flex flex-col min-h-[60vh] font-spectral"
      style={{ minHeight: "60vh" }}
    >
      {/* Mensajes flotando */}
      <div className="flex-1 w-full pb-36 pt-8 px-0 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex flex-col items-end w-full max-w-full">
                <div
                  className={`px-5 py-3 rounded-2xl text-base w-full ${
                    msg.role === "user" ? "border" : ""
                  }`}
                  style={{
                    background: msg.role === "user" ? "#F0EEE7" : "transparent",
                    borderColor: msg.role === "user" ? "#F0EEE7" : undefined,
                    marginLeft: msg.role === "user" ? "auto" : 0,
                    marginRight: msg.role === "user" ? 0 : "auto",
                    boxShadow: "none",
                  }}
                >
                  {/* Badge de wallet dentro de la caja del usuario */}
                  {msg.role === "user" && (
                    <div className="flex items-center mb-2">
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-[10px]"
                        style={{ background: "#FF9800", color: "#000" }}
                      >
                        {formatAddress(userAddress)}
                      </span>
                    </div>
                  )}
                  {msg.role === "assistant" ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-5 py-3 rounded-2xl max-w-[70%] text-base shadow-sm border bg-white text-gray-800 border-gray-200 animate-pulse">
                Tomas está escribiendo...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSend}
        className="fixed bottom-2 left-0 right-0 w-full max-w-2xl mx-auto z-20"
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-md px-2 py-2 gap-2 relative">
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
            className="flex-1 bg-transparent border-none outline-none text-base px-2 py-1"
            placeholder="Talk with Tomas..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />

          <button
            type="submit"
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors 
              ${
                loading || !input.trim()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#BC694A] hover:bg-[#c98a62] cursor-pointer"
              }
            `}
            disabled={loading || !input.trim()}
          >
            <FiArrowUp size={22} className="text-white" />
          </button>
        </div>
      </form>
    </div>
  );
}
