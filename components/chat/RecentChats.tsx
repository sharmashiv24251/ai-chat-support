"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import ProductMiniCard from "./ProductMiniCard";

interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  createdAt: string;
  messages: Message[];
}

interface RecentChatsProps {
  refreshTrigger?: number;
}

// Regex to match [[product:slug]] syntax
const PRODUCT_CARD_REGEX = /\[\[product:([a-z0-9-]+)\]\]/g;

// Parse content and split into text segments and product cards
function parseContentWithProductCards(
  content: string
): Array<{ type: "text" | "product"; value: string }> {
  const segments: Array<{ type: "text" | "product"; value: string }> = [];
  let lastIndex = 0;
  let match;

  // Reset regex lastIndex
  PRODUCT_CARD_REGEX.lastIndex = 0;

  while ((match = PRODUCT_CARD_REGEX.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index);
      if (textBefore.trim()) {
        segments.push({ type: "text", value: textBefore });
      }
    }

    // Add the product card
    segments.push({ type: "product", value: match[1] });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex);
    if (remainingText.trim()) {
      segments.push({ type: "text", value: remainingText });
    }
  }

  // If no product cards found, return the whole content as text
  if (segments.length === 0) {
    segments.push({ type: "text", value: content });
  }

  return segments;
}

// Render message content with Markdown and product cards
function MessageContent({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) {
  if (role === "user") {
    return <div className="whitespace-pre-wrap break-words">{content}</div>;
  }

  const segments = parseContentWithProductCards(content);

  return (
    <div className="prose prose-sm prose-neutral max-w-none">
      {segments.map((segment, index) => {
        if (segment.type === "product") {
          return <ProductMiniCard key={index} slug={segment.value} />;
        }
        return (
          <ReactMarkdown
            key={index}
            components={{
              p: ({ children }) => (
                <p className="mb-2 last:mb-0 text-sm">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-neutral-900">
                  {children}
                </strong>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-2 space-y-1 text-sm">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-2 space-y-1 text-sm">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="ml-2">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-neutral-300 pl-3 italic text-neutral-600 my-2 text-sm">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              ),
            }}
          >
            {segment.value}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}

export default function RecentChats({ refreshTrigger }: RecentChatsProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/conversations");
      const data = await response.json();
      if (data.conversations) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations, refreshTrigger]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPreview = (messages: Message[]) => {
    const userMessage = messages.find((m) => m.role === "user");
    if (userMessage) {
      // Remove product card syntax from preview
      const cleanContent = userMessage.content
        .replace(PRODUCT_CARD_REGEX, "")
        .trim();
      return (
        cleanContent.slice(0, 60) + (cleanContent.length > 60 ? "..." : "")
      );
    }
    return "No messages";
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-8">
            Recent Chats
          </h2>
          <div className="flex items-center justify-center py-12">
            <div className="flex gap-1">
              <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (conversations.length === 0) {
    return (
      <section className="py-16 px-4 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-8">
            Recent Chats
          </h2>
          <div className="text-center py-12 text-neutral-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4 text-neutral-300"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>No conversations yet. Start chatting with the AI assistant!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-neutral-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900">
            Recent Chats
          </h2>
          <span className="text-sm text-neutral-500">
            {conversations.length} conversation
            {conversations.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-4">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              {/* Header - Always visible */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === conv.id ? null : conv.id)
                }
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                      {conv.id.slice(0, 8)}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {formatDate(conv.createdAt)}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {conv.messages.length} message
                      {conv.messages.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 truncate">
                    {getPreview(conv.messages)}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`text-neutral-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                    expandedId === conv.id ? "rotate-180" : ""
                  }`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {/* Expanded content */}
              {expandedId === conv.id && (
                <div className="border-t border-neutral-100 px-6 py-4 bg-neutral-50/50">
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {conv.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                            msg.role === "user"
                              ? "bg-black text-white rounded-br-md"
                              : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-md shadow-sm"
                          }`}
                        >
                          <MessageContent
                            content={msg.content}
                            role={msg.role}
                          />
                          <div
                            className={`text-[10px] mt-2 ${
                              msg.role === "user"
                                ? "text-neutral-400"
                                : "text-neutral-400"
                            }`}
                          >
                            {formatDate(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
