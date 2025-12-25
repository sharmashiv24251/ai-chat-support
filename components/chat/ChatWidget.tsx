"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productSlug?: string;
  productChips?: string[];
  onConversationUpdate?: () => void;
}

export default function ChatWidget({
  isOpen,
  onClose,
  productName,
  productSlug,
  productChips,
  onConversationUpdate,
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
  const [isLoading, setIsLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const defaultChips = [
    "Order status",
    "Shipping info",
    "Best sellers",
    "Return policy",
  ];
  const [chips, setChips] = useState(productChips || defaultChips);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Reset messages and conversation when product changes
    if (productName) {
      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Looking at ${productName}? Great choice! Ask me anything — specs, comparisons, shipping, I've got you.`,
        },
      ]);
      setChips(productChips || defaultChips);
    } else {
      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Hey! I'm your AI shopping assistant. Ask me about any product, shipping, returns — or just say what you're looking for.",
        },
      ]);
      setChips(defaultChips);
    }
    setConversationId(null); // Reset conversation for new product context
  }, [productName, productChips]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Create a temporary message for the AI response
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          ...(conversationId && { conversationId }),
          ...(productSlug && { productSlug }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // Update conversation ID if this is a new conversation
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      // Update the AI message with the response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, content: data.reply } : msg
        )
      );

      // Notify parent of conversation update for recent chats refresh
      if (onConversationUpdate) {
        onConversationUpdate();
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Update the existing AI message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content:
                  error instanceof Error
                    ? error.message
                    : "I'm having trouble connecting right now. Please try again in a moment.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
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
    <div
      className={`${
        isMaximized ? "w-[40vw] min-w-[28rem]" : "w-[24rem]"
      } max-w-[calc(100vw-3rem)] rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/80 backdrop-blur-xl ring-1 ring-black/5 flex flex-col transition-all duration-500 ease-out origin-bottom-right`}
    >
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
              {isLoading ? "Thinking..." : "Online"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Session ID indicator */}
          {conversationId && (
            <div
              className="text-[9px] text-neutral-400 font-mono mr-2 max-w-20 truncate"
              title={conversationId}
            >
              {conversationId.slice(0, 8)}...
            </div>
          )}
          {/* Maximize/Minimize Button */}
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors rounded-full hover:bg-black/5"
            title={isMaximized ? "Minimize" : "Expand"}
          >
            {isMaximized ? (
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
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            ) : (
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
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            )}
          </button>
          {/* Close Button */}
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
      </div>

      {/* Messages */}
      <div
        className={`${
          isMaximized ? "h-[50vh]" : "h-80"
        } overflow-y-auto px-5 py-4 space-y-4 scrollbar-hide bg-white/30 transition-all duration-500 ease-out`}
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isLoading && messages[messages.length - 1]?.content === "" && (
          <div className="flex gap-1 px-4 py-3">
            <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chips */}
      <div className="px-5 pb-3 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => sendMessage(chip)}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isLoading}
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder-neutral-400 text-neutral-900 px-3 h-9 disabled:opacity-50"
            placeholder={isLoading ? "AI is thinking..." : "Type a message..."}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
