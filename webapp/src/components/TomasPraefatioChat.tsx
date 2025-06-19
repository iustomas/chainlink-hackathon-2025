// react
import React, { useState, useRef, useEffect } from "react";

// react-markdown
import ReactMarkdown from "react-markdown";

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
      {/* Input flotante */}
      <form
        onSubmit={handleSend}
        className="fixed bottom-0 left-0 right-0 w-full max-w-2xl mx-auto flex items-center gap-4 px-4 py-5 bg-transparent z-20"
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-lg shadow-md px-4 py-2">
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-base px-2 py-1"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="px-8 py-3 text-base font-semibold text-white rounded-lg transition-colors cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading || !input.trim()}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
