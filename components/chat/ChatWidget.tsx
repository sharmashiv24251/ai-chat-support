"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { getMockResponse } from "@/lib/constants/website";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productChips?: string[];
}

export default function ChatWidget({
  isOpen,
  onClose,
  productName,
  productChips,
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: productName
        ? `Looking at ${productName}? Great choice! Ask me anything — specs, comparisons, shipping, I've got you.`
        : "Hey! I'm your AI shopping assistant. Ask me about any product, shipping, returns — or just say what you're looking for.",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const defaultChips = [
    "Order status",
    "Shipping info",
    "Best sellers",
    "Return policy",
  ];
  const chips = productChips || defaultChips;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Reset messages when product changes
    if (productName) {
      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Looking at ${productName}? Great choice! Ask me anything — specs, comparisons, shipping, I've got you.`,
        },
      ]);
    }
  }, [productName]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const response = getMockResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage(input);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => onClose()}
        className="group relative h-12 px-5 rounded-full shadow-2xl bg-black text-white flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="font-medium text-sm">Ask Assistant</span>
      </button>
    );
  }

  return (
    <div className="w-[24rem] max-w-[calc(100vw-3rem)] rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/80 backdrop-blur-xl ring-1 ring-black/5 flex flex-col transition-all duration-300 origin-bottom-right">
      {/* Header */}
      <div className="px-5 py-4 border-b border-black/5 bg-white/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-neutral-800 to-black text-white flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-neutral-900">
              Shopping AI
            </div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors rounded-full hover:bg-black/5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto px-5 py-4 space-y-4 scrollbar-hide bg-white/30">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chips */}
      <div className="px-5 pb-3 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => sendMessage(chip)}
            className="text-xs px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors shadow-sm"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-2 bg-white/50 border-t border-white/50">
        <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-2 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-black/5 focus-within:border-neutral-400 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder-neutral-400 text-neutral-900 px-3 h-9"
            placeholder="Type a message..."
          />
          <button
            onClick={() => sendMessage(input)}
            className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
